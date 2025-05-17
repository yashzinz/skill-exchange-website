// import important modules to for storing and reading files
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session'); 

const bodyParser = require('body-parser');
const path = require('path');

const User = require('./models/user'); // Adjust the path as necessary

// import files to read
const adminauth = require('./middleware/adminmdw')

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/SkillCircleSignUp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const app = express();
const port = 3000;

// Middlewares
app.use(session({
    secret: 'skillsecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/admin', adminauth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin/admin.html'));
});

// Routes
const users = require('./routes/users');
app.use('/', users);

const skillRouter = require('./routes/skillroute');
app.use('/', skillRouter);

const adminRouter = require('./routes/adminroute');
app.use('/', adminRouter);

const loginSignupRouter = require('./routes/login-signup');
app.use('/', loginSignupRouter)

const updateProfile = require('./routes/profileupdate');
app.use('/', updateProfile);

// app.get('/dashboard', async (req, res) => {
//        const userId = req.session.userId; // Adjust as necessary
//        const user = await User.findById(userId);
//        res.json({ skills: user.skills, videos: user.videos });
//    });

// Route to handle quest submission
// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Append extension
//     }
// });

// const upload = multer({ storage: storage });

// app.post('/quests', upload.single('video'), async (req, res) => {
//   const { title, description } = req.body;
//   const videoPath = req.file.path; // Path to the uploaded video

//   // Find the user and update their quests
//   const userId = req.session.userId; // Adjust as necessary
//   try {
//     // Update the user's quests array with the new quest
//     await User.findByIdAndUpdate(
//         userId, {
//         $push: { quests: { title, description, video: videoPath }},
//     });
//     res.status(200).send("Quest added successfully.");
//   } catch (error) {
//     console.error("Error adding quest:", error);
//     res.status(500).send("Failed to add quest.");
//   }
// });


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});