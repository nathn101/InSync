const config = {
    development: {
        SPOTIFY_LOGIN_URL: 'http://localhost:5000/api/spotifylogin',
        SPOTIFY_DATA_URL: 'http://localhost:5000/api/spotify-user-data'
    },
    production: {
        SPOTIFY_LOGIN_URL: 'https://in-sync-iota.vercel.app/api/spotifylogin',
        SPOTIFY_DATA_URL: 'https://in-sync-iota.vercel.app/api/spotify-user-data'
    }
};

const env = process.env.NODE_ENV || 'development';

export default config[env];