const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {ensureSignedUp} = require('../middleware/auth')

// skills route
router.post('/add-skills', ensureSignedUp, async (req, res) => {
    const userId = req.session.userId; // Get user ID from session
    console.log('User ID from session:', userId); // Debugging line
    const { skills } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { skills: { $each: skills } } },
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

module.exports = router;