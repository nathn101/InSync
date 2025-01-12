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
const config = require('../src/config.js'); // Import config
const winston = require('winston'); // Import winston
const { ObjectId } = require('mongodb'); // Import ObjectId

const User = require('../src/config/User');
const UserTrack = require('../src/config/UserTrack');
const buildUserItemMatrix = require('../src/utils/userItemMatrix');
const getRecommendations = require('../src/utils/collaborativeFiltering');
const connectDB = require('../src/config/mongodb'); // Import the connectDB function

const generateRandomString = (length) => {
  return crypto
.randomBytes(60)
.toString('hex')
.slice(0, length);
};

// Configure winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
// logger.info(`service account: ${JSON.stringify(serviceAccount)}`);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:3000', 'https://insync-eight.vercel.app', 'https://in-sync-iota.vercel.app'];

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

// Middleware to log the IP address of incoming requests
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  logger.info(`Incoming request from IP: ${ip}`);
  next();
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
app.listen(8888);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Serve static files from the public directory
// Music from #Uppbeat (free for Creators!):
// https://uppbeat.io/t/adi-goldstein/i-dont-need-your-love
// License code: O7PW0MDMVUDSBKIO
app.use('/audio', express.static(path.join(__dirname, '../frontend/public/audio')));
app.use('/manifest.json', express.static(path.join(__dirname, '../frontend/public/manifest.json')));

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
.then(() => logger.info('MongoDB connected'))
.catch(err => logger.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Add a simple endpoint to verify the server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

var stateKey = 'spotify_auth_state';
var client_id = process.env.SPOTIFY_CLIENT_ID; // your clientId
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret

app.get('/api/spotifylogin', function(req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state, {httpOnly: false, secure: true, sameSite: 'None'});
  
    // your application requests authorization
    var scope = 'user-read-private user-read-email user-top-read user-follow-read user-library-read';
    res.redirect('https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: config.redirectUri,
        state: state
      }));
});
  
app.get('/callback', async function(req, res) {
  logger.info('Callback Endpoint Hit');
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    return res.redirect('/signin?error=state_mismatch');
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
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };
    logger.info('Requesting auth token from Spotify');
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
          if (error) {
            logger.error('Error fetching Spotify user data:', error);
            return res.redirect('/signin?error=invalid_token');
          }
          logger.info(`Spotify User Data: ${JSON.stringify(body)}`);
          logger.info('Checking if user exists in the database');
          logger.info(`User ID: ${body.id}`);
          
          let user;
          // Check if user already exists in the database
          try {
            user = await User.findOne({ spotifyId: body.id });

            if (!user) {
              // Create a new user if not found
              user = new User({
                spotifyId: body.id,
                displayName: body.display_name,
                email: body.email,
                images: body.images
              });
              await user.save();
            }

            // Store the MongoDB ObjectId in the cookies
            res.cookie('user_id', user._id.toString(), { httpOnly: true, secure: true, sameSite: 'None' });
          } catch (error) {
            logger.info('Error finding user:', error);
            return res.redirect(config.signinErrorUri);
          }

          // Create a Firebase custom token
          logger.info(`Creating Firebase custom token`);
          const firebaseToken = await admin.auth().createCustomToken(body.id);
          res.cookie('firebase_token', firebaseToken, { httpOnly: false, secure: true, sameSite: 'None' });

          // Fetch user's top tracks
          const topTracksOptions = {
            url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };

          request.get(topTracksOptions, async function(error, response, topTracksBody) {
            if (error) {
              logger.error(`Error fetching Spotify top tracks: ${error}`);
              return res.redirect('/signin?error=invalid_token');
            }
            logger.info('Getting Spotify Top Tracks');
            // logger.info(`Spotify Top Tracks: ${JSON.stringify(topTracksBody)}`);

            // Store user-track interactions in the database
            for (const track of topTracksBody.items) {
              await UserTrack.findOneAndUpdate(
                { userId: user._id, trackId: track.id },
                { $inc: { playCount: 1 }, $set: { trackName: track.name } }, // Include trackName
                { upsert: true, new: true }
              );
            }

            // Fetch user's saved tracks
            const savedTracksOptions = {
              url: 'https://api.spotify.com/v1/me/tracks?limit=30',
              headers: { 'Authorization': 'Bearer ' + access_token },
              json: true
            };

            request.get(savedTracksOptions, async function(error, response, savedTracksBody) {
              if (error) {
                logger.error(`Error fetching Spotify saved tracks: ${error}`);
                return res.redirect('/signin?error=invalid_token');
              }
              logger.info('Getting Spotify Saved Tracks');
              // logger.info(`Spotify Saved Tracks: ${JSON.stringify(savedTracksBody)}`);

              // Store user-track interactions for saved tracks
              for (const item of savedTracksBody.items) {
                const track = item.track;
                await UserTrack.findOneAndUpdate(
                  { userId: user._id, trackId: track.id },
                  { $set: { saved: true, trackName: track.name } }, // Include trackName
                  { upsert: true, new: true }
                );
              }
              
              // Redirect to the profile page after setting the cookies
              logger.info('Redirecting to the profile page');
              logger.info('Setting cookies');
              res.cookie('spotify_access_token', access_token, { httpOnly: false, secure: true, sameSite: 'None' });
              res.cookie('spotify_refresh_token', refresh_token, { httpOnly: false, secure: true, sameSite: 'None' });
              res.redirect(config.frontendUri);
            });
          });
        });
      } else {
        logger.error(`Error during token exchange: ${error}`);
        res.redirect('/signin?error=invalid_token');
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
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) 
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

// Proxy endpoint to fetch Spotify user data
app.get('/api/spotify-user-data', (req, res) => {
  const accessToken = req.cookies.spotify_access_token;
  if (!accessToken) {
    return res.status(401).json({ error: 'Spotify access token not found' });
  }

  request.get('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }, (error, response, body) => {
    if (error) {
      logger.error(`Error fetching Spotify user data: ${error}`);
      return res.status(500).json({ error: 'Failed to fetch Spotify user data' });
    }

    try {
      const data = JSON.parse(body);
      res.status(response.statusCode).json(data);
    } catch (parseError) {
      logger.error(`Error parsing Spotify user data: ${parseError}`);
      res.status(500).json({ error: 'Failed to parse Spotify user data' });
    }
  });
});

// Proxy endpoint to fetch Spotify top artists
app.get('/api/spotify-top-artists', (req, res) => {
  const accessToken = req.cookies.spotify_access_token;
  if (!accessToken) {
    return res.status(401).json({ error: 'Spotify access token not found' });
  }
  request.get('https://api.spotify.com/v1/me/top/artists?time_range=short_term', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }, (error, response, body) => {
    if (error) {
      logger.error(`Error fetching top artists: ${error}`);
      return res.status(500).json({ error: 'Failed to fetch top artists' });
    }
    // console.log("Top Artists: ", body);
    try {
      const data = JSON.parse(body);
      // console.log("Top Artists Data: ", data);
      res.status(response.statusCode).json(data);
    } catch (parseError) {
      logger.error(`Error parsing top artists: ${parseError}`);
      res.status(500).json({ error: 'Failed to parse top artists' });
    }
  });
});

// Proxy endpoint to fetch Spotify top tracks
app.get('/api/spotify-top-tracks', (req, res) => {
  const accessToken = req.cookies.spotify_access_token;
  if (!accessToken) {
    return res.status(401).json({ error: 'Spotify access token not found' });
  }
  request.get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }, (error, response, body) => {
    if (error) {
      logger.error(`Error fetching top tracks: ${error}`);
      return res.status(500).json({ error: 'Failed to fetch top tracks' });
    }
    try {
      const data = JSON.parse(body);
      // logger.info(`Top Tracks Data: ${JSON.stringify(data)}`);
      res.status(response.statusCode).json(data);
    } catch (parseError) {
      logger.error(`Error parsing top tracks: ${parseError}`);
      res.status(500).json({ error: 'Failed to parse top tracks' });
    }
  });
});

// Endpoint to get the user-item matrix
app.get('/api/user-item-matrix', async (req, res) => {
  try {
    const userItemMatrix = await buildUserItemMatrix();
    res.json(userItemMatrix);
    console.log("User-Item Matrix: ", userItemMatrix);
  } catch (error) {
    logger.error('Error building user-item matrix:', error);
    res.status(500).json({ error: 'Failed to build user-item matrix' });
  }
});

// Endpoint to get recommendations for a user
app.get('/api/recommendations/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const recommendations = await getRecommendations(userId);
    console.log(recommendations);
    res.json(recommendations);
  } catch (error) {
    logger.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});