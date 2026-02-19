const config = {
    development: {
        redirectUri: 'http://127.0.0.1:8888/callback',
        signinErrorUri: 'http://127.0.0.1:3000/SignIn?error=invalid_user',
        frontendUri: 'http://127.0.0.1:3000/profile',
    },
    production: {
        redirectUri: 'https://in-sync-iota.vercel.app/callback',
        signinErrorUri: 'https://insync-eight.vercel.app/SignIn?error=invalid_user',
        frontendUri: 'https://insync-eight.vercel.app/profile',
    }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
