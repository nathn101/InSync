const config = {
    development: {
        redirectUri: 'https://in-sync-iota.vercel.app//callback',
        frontendUri: 'http://localhost:3000/SignIn',
    },
    production: {
        redirectUri: 'https://in-sync-iota.vercel.app//callback',
        frontendUri: 'https://insync-eight.vercel.app/SignIn',
    }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
