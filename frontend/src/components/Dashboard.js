import React from 'react';

const Dashboard = () => {
    return (
        <div className="dashboard flex justify-center items-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-green-900">
            <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg text-center text-white max-w-md w-full">
                <h2 className="text-3xl mb-6">Dashboard</h2>
                <p>Welcome to your dashboard!</p>
            </div>
        </div>
    );
};

export default Dashboard;
