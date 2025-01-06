import { useState, useEffect } from 'react';
import config from '../context/config';
import Cookies from 'js-cookie';

const Match = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(null);

    const fetchRecommendations = async () => {
        const userId = Cookies.get('spotify_id'); // Assuming the user ID is stored in the firebase_token cookie
        try {
            const response = await fetch(`${config.RECOMMENDATIONS_URL}/${userId}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }
            const data = await response.json();
            setRecommendations(data);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);
    console.log("recommendations: ", recommendations);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-green-900 text-white">
            <h1 className="text-4xl mb-8">Recommended Users</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((recommendation, index) => (
                    <div key={index} className="bg-gray-800 p-6 rounded-lg text-center">
                        <h2 className="text-2xl mb-4">{recommendation.displayName}</h2>
                        <p>{recommendation.email}</p>
                        <p>{recommendation.trackName}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Match;