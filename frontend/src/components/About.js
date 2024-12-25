import React from 'react';

const About = () => {
    return (
        <div className="about-page flex justify-center items-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-green-900">
            <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg text-center text-white max-w-md w-full">
                <h2 className="text-3xl mb-6">About InSync</h2>
                <p>InSync is a music-based social platform that connects people through their shared love of music. Discover new friends, find matches based on your music preferences, and enjoy a seamless experience with our integrated Spotify, Google, and Facebook login options.</p>
            </div>
        </div>
    );
};

export default About;
