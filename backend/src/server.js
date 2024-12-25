require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Import the cors package
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer'); // Import nodemailer

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000', // Specify the allowed origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Verify that the MONGODB_URI environment variable is being read correctly
console.log('MONGODB_URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log('Error connecting to MongoDB:', err);
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Use the token from cookies
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post('/api/register', async (req, res) => {
    try {
        // Check if the email is already registered
        console.log(req.body); // Log the request body
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            email: req.body.email,
            password: hashedPassword
        });

        await newUser.save();
        console.log('New user saved:', newUser); // Log the saved user
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error); // Log the error details
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        console.log(req.body); // Log the request body
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true }); // Set the token in a cookie
        res.json({ token });
    } catch (error) {
        console.error('Error logging in user:', error); // Log the error details
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: 'Email not found' });
        }

        // Generate a password reset token (this is a simple example, consider using a more secure method)
        const resetToken = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });

        // Send the reset token to the user's email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            text: `You requested a password reset. Click the link to reset your password: http://localhost:3000/reset-password?token=${resetToken}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Error sending email' });
            }
            console.log('Email sent:', info.response);
            res.json({ message: 'Password reset link sent to your email' });
        });
    } catch (error) {
        console.error('Error handling forgot password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/profile', verifyToken, (req, res) => {
    // Handle profile logic here
    res.json({ message: 'Profile data' });
});

app.get('/api/match', verifyToken, (req, res) => {
    // Handle match logic here
    res.json({ message: 'Match data' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Serve static files from the public directory
// Music from #Uppbeat (free for Creators!):
// https://uppbeat.io/t/adi-goldstein/i-dont-need-your-love
// License code: O7PW0MDMVUDSBKIO
app.use('/audio', express.static(path.join(__dirname, '../frontend/public/audio')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// OAuth endpoints
app.get('/auth/spotify', (req, res) => {
    betterauth.spotifyLogin();
});

app.get('/auth/google', (req, res) => {
    betterauth.googleLogin();
});

app.get('/auth/facebook', (req, res) => {
    betterauth.facebookLogin();
});