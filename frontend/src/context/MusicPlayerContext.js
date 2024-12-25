import React, { createContext, useState, useContext } from 'react';

// Create a context
const MusicPlayerContext = createContext();

// Create a provider component
export const MusicPlayerProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [volume, setVolume] = useState(1);

    const playTrack = (track) => {
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const pauseTrack = () => {
        setIsPlaying(false);
    };

    const stopTrack = () => {
        setCurrentTrack(null);
        setIsPlaying(false);
    };

    const changeVolume = (newVolume) => {
        setVolume(newVolume);
    };

    return (
        <MusicPlayerContext.Provider
            value={{
                isPlaying,
                currentTrack,
                volume,
                playTrack,
                pauseTrack,
                stopTrack,
                changeVolume,
            }}
        >
            {children}
        </MusicPlayerContext.Provider>
    );
};

// Custom hook to use the MusicPlayerContext
export const useMusicPlayer = () => {
    return useContext(MusicPlayerContext);
};