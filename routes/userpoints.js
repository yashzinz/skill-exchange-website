const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/api/add-points', async (req, res) => {
    const userId = req.session.userId; 
    console.log('User ID from add test session:', userId);
    const { points } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { points: points } },
            { new: true }
        );

        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(404).json({ message: 'User  not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error claiming points', error });
    }
});

router.post('/sub-points', async (req, res) => {
    const userId = req.session.userId; 
    console.log('User ID from sub test session:', userId);
    let { points } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { points: points} },
            { new: true }
        );

        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(404).json({ message: 'User  not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error buying skill', error });
    }
});

module.exports = router;
