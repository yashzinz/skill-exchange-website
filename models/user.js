const mongoose = require('mongoose');

const QuestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "images/quest.jpg" },
    videos: { type: [String], default: [] },
});

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true },
    videos: {  type: [String],  default: [] },
    skills: {  type: [String],  default: [] },
    fieldOfStudy: {  type: String },
    certification: { type: String  },
    experience: {  type: String },
    quests: { type: [QuestSchema], default: [] },
    points: { type: Number },
    avatarUrl: { type: String, default: '' }
});

module.exports = mongoose.model('User', UserSchema);