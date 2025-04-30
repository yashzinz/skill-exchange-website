    const express = require('express');
    const mongoose = require('mongoose');
    const session = require('express-session'); 

    const bodyParser = require('body-parser');
    const multer = require('multer');
    const path = require('path');


    const User = require('./models/user');

    // MongoDB connection
    mongoose.connect('mongodb://localhost:27017/SkillCircleSignUp', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err));

    const app = express();
    const port = 3000;

    // Middleware
    app.use(session({
        secret: 'skillsecret', // Replace with a strong secret key
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set to true if using HTTPS
    }));

    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.get('/admin', (req, res) => {
        res.sendFile(path.join(__dirname, 'public/admin/admin.html'));
    });

    // Routes
    const users = require('./routes/users');
    app.use('/', users);

    const skillRouter = require('./routes/skillroute');
    app.use('/', skillRouter);

    const adminRouter = require('./routes/adminroute');
    app.use('/', adminRouter);

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
    app.post('/signup', upload.array('videos', 3), async (req, res) => { // Allow up to 3 files
        const { name, email, password } = req.body;
        const videoPaths = req.files.map(file => file.path); // Get paths of uploaded files


        const emailcheck = await User.findOne({ email }); 
        if (emailcheck) { 
            return res.status(409).json({ message: 'Email already exists' });
        }

        try {
            const newUser  = new User({ name, email, password, videos: videoPaths }); // Store array of video paths
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
    app.post('/login', async (req, res) => {
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

    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });