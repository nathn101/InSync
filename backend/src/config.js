const config = {
    development: {
        redirectUri: 'http://localhost:8888/callback',
        frontendUri: 'http://localhost:3000/profile',
    },
    production: {
        redirectUri: 'https://in-sync-iota.vercel.app/callback',
        frontendUri: 'https://insync-eight.vercel.app/profile',
    }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
