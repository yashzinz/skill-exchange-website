const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.post('/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send('User  deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting user: ' + error.message);
    }
});

module.exports = router;