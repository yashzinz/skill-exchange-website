const express = require('express');
const router = express.Router();
const session = require('express-session'); 
const User = require('../models/user');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;