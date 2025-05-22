const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/api/add-points', async (req, res) => {
    const userId = req.session.userId; 
    console.log('User ID added points:', userId);
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

router.post('/api/sub-points', async (req, res) => {
    const userId = req.session.userId; 
    console.log('User ID subbed points:', userId);
    const { points } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { points: -points} },
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
