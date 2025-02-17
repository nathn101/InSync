import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FaGear } from "react-icons/fa6";
import Cookies from 'js-cookie';
import config from '../context/config';
import { set } from 'mongoose';

const Profile = () => {
    const [hasSpotifyAccount, setHasSpotifyAccount] = useState(false);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [userData, setUserData] = useState({});
    const [topArtists, setTopArtists] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const history = useHistory();

    const handleSignOut = () => {
        Cookies.remove('firebase_token');
        Cookies.remove('spotify_access_token');
        Cookies.remove('spotify_refresh_token');
        window.dispatchEvent(new Event('signout')); // Dispatch custom signout event
        history.push('/Home');
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        const profileForm = document.querySelector('.profile-form-container');
        const bioForm = document.querySelector('.bio-form-container');
        const name = profileForm.name.value;
        const age = profileForm.age.value;
        const gender = profileForm.gender.value; // Get the gender value
        const biography = bioForm.biography.value;

        console.log('Profile updated:', { name, age, gender, biography });
        // Add your logic to save the profile data
    };

    const toggleProfileForm = () => {
        setShowProfileForm(!showProfileForm);
    };

    const fetchSpotifyUserData = async () => {
        try {
          const response = await fetch(config.SPOTIFY_DATA_URL, {
            method: 'GET',
            credentials: 'include' // Include credentials (cookies)
          });
          if (!response.ok) {
            throw new Error('Failed to fetch Spotify user data');
          }
          
          const data = await response.json();
          console.log("user data: ", data);
          Cookies.set('spotify_id', data.id);
          setUserData(data);
          if (Object.keys(data).length > 0) {
            setHasSpotifyAccount(true);
          }
        } catch (error) {
          console.error('Error fetching Spotify user data:', error);
        }
    };

    const fetchTopArtists = async () => {
        try {
            const response = await fetch(config.SPOTIFY_TOP_ARTISTS_URL, {
                method: 'GET',
                credentials: 'include'
            });
            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to fetch top artists');
            }

            const data = await response.json();
            setTopArtists(data.items);
            // console.log("Top Artists:", topArtists);
        } catch (error) {
            console.error('Error fetching top artists:', error);
        }
    }; 

    const fetchTopTracks = async () => {
        try {
            const response = await fetch(config.SPOTIFY_TOP_TRACKS_URL, {
                method: 'GET',
                credentials: 'include'
            });
            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to fetch top tracks');
            }

            const data = await response.json();
            setTopTracks(data.items);
            console.log("Top Tracks:", topTracks);
        } catch (error) {
            console.error('Error fetching top tracks:', error);
        }
    };

    useEffect(() => {
        fetchSpotifyUserData();
        fetchTopArtists();
        fetchTopTracks();
    }, []);

    console.log(userData);

    return (
        <div className="relative flex justify-center items-center flex-grow bg-gradient-to-b from-black via-gray-900 to-green-900 min-h-screen">
            <div className="bg-gray-800 bg-opacity-50 p-6 pb-6 rounded-lg text-center text-white w-3/5 mt-14 mb-8">
                <div className="flex gap-4 items-center mb-6">
                    <img 
                        src={hasSpotifyAccount? userData.images?.[0]?.url : 'https://via.placeholder.com/150'}
                        alt="User Avatar" 
                        className="w-24 h-24 rounded-full"
                    />
                    <h1 className="text-3xl">{userData.display_name}</h1>
                    <button 
                        onClick={toggleProfileForm} 
                        className="ml-auto p-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
                    >
                        {showProfileForm ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.361-4.361a1 1 0 111.414 1.414L13.414 10.586l4.361 4.361a1 1 0 01-1.414 1.414L12 12l-4.361 4.361a1 1 0 01-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <FaGear />
                        )}
                    </button>
                </div>
                {!showProfileForm && (
                    <div className="flex flex-col w-full gap-4">
                        <div className="flex w-full gap-4">
                            <div className="flex w-full gap-4">
                                <span><h2>Followers: {hasSpotifyAccount ? userData.followers?.total : 0}</h2></span>
                            </div>
                        </div>
                        <h2 className="flex justify-start">Top Artists: </h2>
                        <div className="flex w-full gap-4">
                            {hasSpotifyAccount ? topArtists.slice(0, 5).map((artist) => (
                                <div className="flex flex-col items-center">
                                    <img 
                                        src={artist.images?.[0]?.url}
                                        alt="Artist Avatar" 
                                        className="w-16 h-16 rounded-full"
                                    />
                                    <h3>{artist.name}</h3>
                                </div>
                            )) : <p className="flex w-full items-center justify-center">You have not connected your Spotify account yet.</p>}
                        </div>
                        <h2 className="flex justify-start">Top Tracks: </h2>
                        <div className="flex w-full">
                            <ul className="flex flex-col align-top text-left">
                                {hasSpotifyAccount ? topTracks.slice(0, 5).map((track, index) => (
                                    <li className="flex w-full gap-2 m-0">{index + 1}. <div className="flex flex-col"><span className="text-xl">{track.name}</span><span className="text-s">{track.artists[0].name}</span></div><div>{track.album?.name}</div></li>
                                )) : <p className="flex w-full items-start justify-start">You have not connected your Spotify account yet.</p>}
                            </ul>
                        </div>
                    </div>
                )}
                {showProfileForm && (
                    <div className="flex space-x-6 w-full">
                        <div className="p-6 rounded-lg text-center text-white w-1/2">
                            <h1 className="text-2xl mb-4">My Profile</h1>
                            <form action="" className="profile-form-container space-y-3">
                                <div>
                                    <label htmlFor="name" className="block text-left mb-1">Name</label>
                                    <input type="text" name="name" className="w-full p-2 rounded bg-gray-800 border border-gray-700" placeholder="Enter your name" required/>
                                </div>
                                <div>
                                    <label htmlFor="age" className="block text-left mb-1">Age</label>
                                    <input type="number" name="age" className="w-full p-2 rounded bg-gray-800 border border-gray-700" placeholder="Enter your age" required/>
                                </div>
                                <div>
                                    <p className="text-left mb-1">Gender</p>
                                    <div className="flex items-center space-x-3">
                                        <label htmlFor="male" className="flex items-center">
                                            <input type="radio" name="gender" value="male" id="male" className="mr-1" required/>
                                            Male
                                        </label>
                                        <label htmlFor="female" className="flex items-center">
                                            <input type="radio" name="gender" value="female" id="female" className="mr-1" required/>
                                            Female
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 rounded-lg text-center text-white w-1/2">
                            <h1 className="text-2xl mb-4">Biography</h1>
                            <form action="" className="bio-form-container space-y-3">
                                <div>
                                    <label htmlFor="biography" className="block text-left mb-1">Description</label>
                                    <textarea name="biography" className="w-full p-2 rounded bg-gray-800 border border-gray-700 max-h-40" placeholder="Write something about yourself..." rows="5" required></textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showProfileForm && (
                    <div className="flex w-full justify-between p-8">
                        <button
                            type="submit"
                            onClick={handleProfileUpdate}
                            className="btn w-1/5 p-2 mt-4 rounded bg-green-500 hover:bg-green-600 text-white"
                        >
                            Save Changes
                        </button>
                        <button 
                            onClick={handleSignOut} 
                            className="mt-4 p-2 rounded bg-gray-500 hover:bg-gray-600 text-red-500 w-1/5"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;