const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    video: { 
        type: String, 
        required: true 
    },
    skills: { 
        type: [String], 
        default: [] 
    },
    points: {
        type: Number
    }
});

module.exports = mongoose.model('User', UserSchema);