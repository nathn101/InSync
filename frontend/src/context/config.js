const config = {
    development: {
        SPOTIFY_LOGIN_URL: 'http://127.0.0.1:8888/api/spotifylogin',
        SPOTIFY_DATA_URL: 'http://127.0.0.1:8888/api/spotify-user-data',
        SPOTIFY_TOP_ARTISTS_URL: 'http://127.0.0.1:8888/api/spotify-top-artists',
        SPOTIFY_TOP_TRACKS_URL: 'http://127.0.0.1:8888/api/spotify-top-tracks',
        MATCHES_URL: 'http://127.0.0.1:8888/api/matches',
        USER_ITEM_MATRIX_URL: 'http://127.0.0.1:8888/api/user-item-matrix',
        RECOMMENDATIONS_URL: 'http://127.0.0.1:8888/api/recommendations'
    },
    production: {
        SPOTIFY_LOGIN_URL: 'https://in-sync-iota.vercel.app/api/spotifylogin',
        SPOTIFY_DATA_URL: 'https://in-sync-iota.vercel.app/api/spotify-user-data',
        SPOTIFY_TOP_ARTISTS_URL: 'https://in-sync-iota.vercel.app/api/spotify-top-artists',
        SPOTIFY_TOP_TRACKS_URL: 'https://in-sync-iota.vercel.app/api/spotify-top-tracks',
        MATCHES_URL: 'https://in-sync-iota.vercel.app/api/matches',
        USER_ITEM_MATRIX_URL: 'https://in-sync-iota.vercel.app/api/user-item-matrix',
        RECOMMENDATIONS_URL: 'https://in-sync-iota.vercel.app/api/recommendations'
    }
};

const env = process.env.NODE_ENV || 'development';

export default config[env];