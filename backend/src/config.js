const config = {
    development: {
        redirectUri: 'http://localhost:8888/callback',
        frontendUri: 'http://localhost:3000/SignIn',
    },
    production: {
        redirectUri: 'https://insync-eight.vercel.app/callback',
        frontendUri: 'https://insync-eight.vercel.app/SignIn',
    }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
