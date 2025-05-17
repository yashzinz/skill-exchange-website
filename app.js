// import important modules to for storing and reading files
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session'); 

const bodyParser = require('body-parser');
const path = require('path');

const User = require('./models/user'); // Adjust the path as necessary

const {ensureSignedUp} = require('./middleware/auth')

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

const multer = require('multer');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Append timestamp to the filename
  }
});

const upload = multer({ storage: storage });

// Create a new route for uploading videos
app.post('/upload-video', ensureSignedUp, upload.array('videos'), async (req, res) => {
  const userId = req.body.userId; // Assuming you send userId with the request
  const videoPaths = req.files.map(file => file.path); // Get the paths of the uploaded videos

  try {
    // Find the user and update their videos array
    await User.findByIdAndUpdate(userId, { $push: { videos: { $each: videoPaths } } });
    res.status(200).json({ message: 'Videos uploaded successfully', videoPaths });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading videos', error });
  }
});

app.get('/get-user-id', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ userId: req.session.userId });
  } else {
    res.json({ userId: null });
  }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});