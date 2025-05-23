const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const{ensureSignedUp} = require('../middleware/auth')

// Get all quests for the logged-in user
router.get('/api/quests', ensureSignedUp, async (req, res) => {
    const userId = req.session.userId; // Assuming user ID is stored in session

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User  not found');

        res.json(user.quests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Append timestamp to the filename
  },
});

const upload = multer({ storage: storage });

// Create a new quest
router.post('/api/quests', ensureSignedUp, upload.fields([{ name: 'image' }, { name: 'videos' }]), async (req, res) => {
    const { title, author, description, image } = req.body;
    const userId = req.session.userId; // Assuming user ID is stored in session
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User  not found');

        // Create a new quest object
        const newQuest = {
            title,
            author,
            description,
            image: req.files['image'][0].path, // Store the path of the uploaded image,
            videos: req.files['videos'] ? req.files['videos'].map(file => file.path) : [] // Store the paths of uploaded videos
        };
        
        user.quests.push(newQuest);
        await user.save();
        res.status(201).json(newQuest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific quest by ID
router.get('/api/public-quests/:id', async (req, res) => {
  try {
    const questId = req.params.id;
    const quests = await User.find().select('quests').populate('quests');
    const publicQuests = quests.reduce((acc, user) => acc.concat(user.quests), []);
    const quest = publicQuests.find((q) => q._id.toString() === questId);
    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }
    res.json(quest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router to delete quests
router.delete('/api/quests/:id', ensureSignedUp, async (req, res) => {
    const questId = req.params.id;
    try {
        // Find the user who owns the quest
        const user = await User.findOne({ "quests._id": questId });
        if (!user) {
            return res.status(404).json({ message: 'Quest not found' });
        }
        // Remove the quest from the user's quests array
        user.quests.pull(questId);
    // Save updated user document
        await user.save();
        // Respond with a success message
        res.status(200).json({ message: 'Quest deleted successfully' });
    } catch (error) {
        console.error("Error deleting quest:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// public quests
router.get('/api/public-quests', async (req, res) => {
  try {
    const quests = await User.find().select('quests').populate('quests');
    const publicQuests = quests.reduce((acc, user) => acc.concat(user.quests), []);
    res.json(publicQuests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
