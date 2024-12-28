import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FaGear } from "react-icons/fa6";
import Cookies from 'js-cookie';
import config from '../context/config';

const Profile = () => {
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [userData, setUserData] = useState({});
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
        console.log('Cookies:', Cookies.get());
        try {
          const response = await fetch(config.SPOTIFY_DATA_URL, {
            method: 'GET',
            credentials: 'include' // Include credentials (cookies)
          });
          console.log(response);
          if (!response.ok) {
            throw new Error('Failed to fetch Spotify user data');
          }
          
          const data = await response.json();
          console.log('Spotify user data:', data);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching Spotify user data:', error);
        }
    };

    useEffect(() => {
        fetchSpotifyUserData();
    }, []);

    console.log(userData);

    return (
        <div className="relative flex justify-center items-center flex-grow bg-gradient-to-b from-black via-gray-900 to-green-900 min-h-screen">
            <div className="bg-gray-800 bg-opacity-50 p-6 pb-6 rounded-lg text-center text-white w-3/5 mb-16">
                <div className="flex gap-4 items-center mb-6">
                    <img 
                        src={userData.images?.[0]?.url}
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
                    <div className="flex w-full gap-4">
                        <span><h2>Followers: {userData.followers?.total}</h2></span>
                        <span><h2>Following: </h2><h2></h2></span>
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