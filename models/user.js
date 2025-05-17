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
    videos: { 
        type: [String], 
        default: [] 
    },
    skills: { 
        type: [String], 
        default: [] 
    },
    fieldOfStudy: { 
        type: String 
    },
    certification: { 
        type: String 
    },
    experience: { 
        type: String 
    },
    quests: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        video: { type: String, required: true } // Path to the uploaded video
    }],
    points: {
        type: Number
    }
});

module.exports = mongoose.model('User', UserSchema);