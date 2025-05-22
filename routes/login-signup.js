const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/user');

// Set up Multer for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

// Sign-up route
router.post('/signup', upload.array('videos', 3), async (req, res) => { // Allow up to 3 files
    const { name, email, password } = req.body;
    const videoPaths = req.files.map(file => file.path); // Get paths of uploaded files

    // check if email is in database
    const emailcheck = await User.findOne({ email }); 
    if (emailcheck) { 
        return res.status(409).json({ message: 'Email already exists' });
    }

    try {
        const newUser  = new User({ name, email, password, videos: videoPaths, points: 0 }); // Store array of video paths
        await newUser.save();

        // Store user ID and email in session
        req.session.userId = newUser._id;
        req.session.email = newUser.email;

        res.status(201).send('User registered successfully!');

        } catch (error) {
            res.status(400).send('Error registering user: ' + error.message);
        }
    });

// login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (user) {

            req.session.userId = user._id; // Set session on login
            req.session.email = user.email;
            res.json({ message: 'Login successful' });
            
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;