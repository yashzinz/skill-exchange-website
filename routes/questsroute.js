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
router.post('/api/quests', ensureSignedUp, upload.array('videos'), async (req, res) => {
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
            image,
            videos: req.files.map(file => file.path) // Store the paths of uploaded videos
        };
        user.quests.push(newQuest);
        await user.save();
        res.status(201).json(newQuest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific quest by ID
router.get('/api/quests/:id', ensureSignedUp, async (req, res) => {
    const questId = req.params.id;
    try {
        const user = await User.findOne({ "quests._id": questId });
        if (!user) {
            return res.status(404).json({ message: 'Quest not found' });
        }
        const quest = user.quests.id(questId); // Get the specific quest
        res.status(200).json(quest);
    } catch (error) {
        console.error("Error fetching quest:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

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

module.exports = router;
