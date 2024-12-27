require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const request = require('request');
const crypto = require('crypto');
const queryString = require('querystring');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Import the cors package
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer'); // Import nodemailer
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const config = require('./config'); // Import config

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT); // Parse the JSON string

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:3000', 'https://insync-eight.vercel.app'];

// Enable CORS for all routes
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
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

/*
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
*/

// Configure nodemailer
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

const generateRandomString = (length) => {
    return crypto
  .randomBytes(60)
  .toString('hex')
  .slice(0, length);
};

// app.post('/api/register', async (req, res) => {
//     try {
//         // Check if the email is already registered
//         console.log(req.body); // Log the request body
//         const existingUser = await User.findOne({ email: req.body.email });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Email already registered' });
//         }

//         const hashedPassword = await bcrypt.hash(req.body.password, 10);

//         const newUser = new User({
//             email: req.body.email,
//             password: hashedPassword
//         });

//         await newUser.save();
//         console.log('New user saved:', newUser); // Log the saved user
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error('Error registering user:', error); // Log the error details
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.post('/api/login', async (req, res) => {
//     try {
//         console.log(req.body); // Log the request body
//         const user = await User.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(400).json({ error: 'Invalid email or password' });
//         }

//         const isMatch = await bcrypt.compare(req.body.password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ error: 'Invalid email or password' });
//         }

//         const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
//         res.cookie('token', token, { httpOnly: true }); // Set the token in a cookie
//         res.json({ token });
//     } catch (error) {
//         console.error('Error logging in user:', error); // Log the error details
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.post('/api/forgot-password', async (req, res) => {
//     try {
//         const user = await User.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(400).json({ error: 'Email not found' });
//         }

//         // Generate a password reset token (this is a simple example, consider using a more secure method)
//         const resetToken = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });

//         // Send the reset token to the user's email
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: user.email,
//             subject: 'Password Reset',
//             text: `You requested a password reset. Click the link to reset your password: https://insync-eight.vercel.app/reset-password?token=${resetToken}`,
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.error('Error sending email:', error);
//                 return res.status(500).json({ error: 'Error sending email' });
//             }
//             console.log('Email sent:', info.response);
//             res.json({ message: 'Password reset link sent to your email' });
//         });
//     } catch (error) {
//         console.error('Error handling forgot password:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

/*
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
*/

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.listen(8888);

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

var stateKey = 'spotify_auth_state';
var client_id = process.env.SPOTIFY_CLIENT_ID; // your clientId
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret

app.get('/api/spotifylogin', function(req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    // your application requests authorization
    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: config.redirectUri,
        state: state
      }));
});
  
app.get('/callback', function(req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
  
    if (state === null || state !== storedState) {
      res.redirect('/#' +
        queryString.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: config.redirectUri,
          grant_type: 'authorization_code'
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
  
      request.post(authOptions, async function(error, response, body) {
        if (!error && response.statusCode === 200) {
          var access_token = body.access_token,
              refresh_token = body.refresh_token;
  
          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
  
          // use the access token to access the Spotify Web API
          request.get(options, async function(error, response, body) {
            console.log("Spotify Request Body: ", body);

            // Create a Firebase custom token
            const firebaseToken = await admin.auth().createCustomToken(body.id);

            // Store tokens in cookies
            res.cookie('firebase_token', firebaseToken, { httpOnly: false });
            res.cookie('spotify_access_token', access_token, { httpOnly: false });
            res.cookie('spotify_refresh_token', refresh_token, { httpOnly: false });

            // redirect the user back to your application
            res.redirect(config.frontendUri);
          });
        } else {
          res.redirect('/#' +
            queryString.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
});
  
app.get('/refresh_token', function(req, res) {
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) 
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
            refresh_token = body.refresh_token;
        res.send({
          'access_token': access_token,
          'refresh_token': refresh_token
        });
      }
    });
});