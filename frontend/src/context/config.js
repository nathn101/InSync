const config = {
    development: {
        SPOTIFY_LOGIN_URL: 'http://localhost:5000/api/spotifylogin'
    },
    production: {
        SPOTIFY_LOGIN_URL: 'https://insync-eight.vercel.app/api/spotifylogin'
    }
};

const env = process.env.NODE_ENV || 'development';

export default config[env];