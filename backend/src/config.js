const config = {
    development: {
        redirectUri: 'http://localhost:8888/callback',
        signinErrorUri: 'http://localhost:3000/SignIn?error=invalid_user',
        frontendUri: 'http://localhost:3000/profile',
    },
    production: {
        redirectUri: 'https://in-sync-iota.vercel.app/callback',
        signinErrorUri: 'https://insync-eight.vercel.app/SignIn?error=invalid_user',
        frontendUri: 'https://insync-eight.vercel.app/profile',
    }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
