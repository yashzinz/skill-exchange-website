const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust the path as necessary
const multer = require('multer')
const {ensureSignedUp} = require('../middleware/auth')

router.get('/api/user', ensureSignedUp, async (req, res) =>{
    const userId = req.session.userId
    try{
        const user = await User.findById(userId).select('name fieldOfStudy certification experience'); // Fetch necessary fields
        if (user) {
            res.status(200).json({ 
                name: user.name, 
                fieldOfStudy: user.fieldOfStudy, 
                certification: user.certification, 
                experience: user.experience 
        });
        } else {
            res.status(404).json({ message: 'User  not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching skills', error });
    }

});

// Save profile data
router.post('/api/user', ensureSignedUp, async (req, res) => {
  const { fieldOfStudy, certification, experience } = req.body;

  try {
    // Assuming you have the user ID in the session
    const userId = req.session.userId;
    await User.findByIdAndUpdate(
        userId, {
        fieldOfStudy,
        certification,
        experience,
    });
    res.status(200).send('Profile updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating profile');
  }
});

// GET route to fetch user's skills
router.get('/api/skills', ensureSignedUp, async (req, res) => {
    const userId = req.session.userId; // Get user ID from session
    try {
        const user = await User.findById(userId).select('skills'); // Fetch only the skills field
        if (user) {
            res.status(200).json({ skills: user.skills || [] }); // Return skills or an empty array
        } else {
            res.status(404).json({ message: 'User  not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching skills', error });
    }
});

// POST route to add skills
router.post('/add-skills', ensureSignedUp, async (req, res) => {
    const userId = req.session.userId; // Get user ID from session
    const { skills } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { skills: { $each: skills } } }, // Add skills to the user's skills array
            { new: true }
        );

        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(404).json({ message: 'User  not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding skills', error });
    }
});

// DELETE route to remove a skill from the user's skills array
router.delete('/api/skills', ensureSignedUp, async (req, res) => {
    const userId = req.session.userId; // Get user ID from session
    const skillToDelete = req.body.skill; // Get the skill from the request body

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { skills: skillToDelete } }, // Use $pull to remove the skill from the array
            { new: true } // Return the updated user document
        );

        if (user) {
            res.status(200).json({ message: 'Skill deleted successfully', skills: user.skills });
        } else {
            res.status(404).json({ message: 'User  not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting skill: ' + error.message });
    }
});

module.exports = router;
