import { useState, useEffect } from 'react';
import Matches from './matches';
import useFetch from '../useFetch';

const Match = () => {
    const { data, isLoading, error } = useFetch('http://localhost:8000/matches');

    return (
        <div className="relative flex justify-center items-center flex-grow bg-gradient-to-b from-black via-gray-900 to-green-900 min-h-screen">
            <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg text-center text-white max-w-4xl w-full">
                <h1 className="text-3xl mb-6">Find Your Match</h1>
                {error && <div className="text-red-500">{error}</div>}
                {isLoading && <div className="text-white">Loading...</div>}
                {data && (
                    <div className="space-y-4">
                        {data.map((match) => (
                            <div key={match.id} className="bg-gray-800 p-4 rounded-lg">
                                <h2 className="text-2xl mb-2">{match.name}</h2>
                                <p className="text-lg">Top Genre: {match.topGenre}</p>
                                <p className="text-lg">Top Artist: {match.topArtist}</p>
                                <button className="btn mt-4 p-2 rounded bg-green-500 hover:bg-green-600 text-white">Connect</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Match;