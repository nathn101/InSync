import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FaGear, FaSpotify, FaMusic, FaUser } from "react-icons/fa6";
import { FiLogOut, FiSave } from "react-icons/fi"; // Install react-icons if needed
import Cookies from 'js-cookie';
import config from '../context/config';

const Profile = () => {
    const [hasSpotifyAccount, setHasSpotifyAccount] = useState(false);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [userData, setUserData] = useState({});
    const [topArtists, setTopArtists] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const history = useHistory();

    const handleSignOut = async () => {
        try {
            await fetch(`${config.API_URL || ''}/api/logout`, { method: 'POST' });
        } catch (error) {
            console.error('Logout failed:', error);
        }
        Cookies.remove('firebase_token');
        // Cookies.remove('spotify_access_token'); // Now httpOnly
        // Cookies.remove('spotify_refresh_token'); // Now httpOnly
        window.dispatchEvent(new Event('signout'));
        history.push('/Home');
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        // Note: In React, it's better to use state for forms, but keeping your logic for now
        const profileForm = document.querySelector('.profile-form-container');
        const bioForm = document.querySelector('.bio-form-container');
        const name = profileForm.name.value;
        const age = profileForm.age.value;
        const gender = profileForm.gender.value;
        const biography = bioForm.biography.value;

        console.log('Profile updated:', { name, age, gender, biography });
        setShowProfileForm(false); // Switch back to view mode after save
    };

    const toggleProfileForm = () => {
        setShowProfileForm(!showProfileForm);
    };

    // --- DATA FETCHING (Unchanged logic) ---
    const fetchSpotifyUserData = async () => {
        try {
            const response = await fetch(config.SPOTIFY_DATA_URL, { method: 'GET', credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch Spotify user data');
            const data = await response.json();
            Cookies.set('spotify_id', data.id);
            setUserData(data);
            if (Object.keys(data).length > 0) setHasSpotifyAccount(true);
        } catch (error) { console.error('Error:', error); }
    };

    const fetchTopArtists = async () => {
        try {
            const response = await fetch(config.SPOTIFY_TOP_ARTISTS_URL, { method: 'GET', credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch top artists');
            const data = await response.json();
            setTopArtists(data.items);
        } catch (error) { console.error('Error:', error); }
    };

    const fetchTopTracks = async () => {
        try {
            const response = await fetch(config.SPOTIFY_TOP_TRACKS_URL, { method: 'GET', credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch top tracks');
            const data = await response.json();
            setTopTracks(data.items);
        } catch (error) { console.error('Error:', error); }
    };

    useEffect(() => {
        fetchSpotifyUserData();
        fetchTopArtists();
        fetchTopTracks();
    }, []);

    return (
        <div className="relative min-h-screen bg-black overflow-x-hidden flex justify-center font-sans selection:bg-green-500 selection:text-black pt-24 pb-12">

            {/* --- BACKGROUND ELEMENTS --- */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* --- MAIN GLASS CONTAINER --- */}
            <div className="relative z-10 w-full max-w-5xl mx-4">
                <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">

                    {/* --- HEADER SECTION --- */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-10 border-b border-white/5 pb-8">
                        {/* Avatar with Glow Ring */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                            <img
                                src={hasSpotifyAccount && userData.images?.[0]?.url ? userData.images[0].url : 'https://via.placeholder.com/150'}
                                alt="User Avatar"
                                className="relative w-32 h-32 rounded-full border-2 border-black object-cover"
                            />
                        </div>

                        {/* User Info */}
                        <div className="flex-grow text-center md:text-left">
                            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                                {userData.display_name || "Guest User"}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                                    <FaUser className="inline mr-2 text-green-400" />
                                    {hasSpotifyAccount ? `${userData.followers?.total} Followers` : "0 Followers"}
                                </span>
                                {hasSpotifyAccount && (
                                    <span className="px-3 py-1 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20 text-[#1DB954]">
                                        <FaSpotify className="inline mr-2" />
                                        Connected
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Edit Toggle Button */}
                        <button
                            onClick={toggleProfileForm}
                            className={`p-3 rounded-full border transition-all duration-300 ${showProfileForm ? 'bg-green-500 text-black border-green-500' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'}`}
                        >
                            <FaGear className={`w-5 h-5 ${showProfileForm ? 'animate-spin-slow' : ''}`} />
                        </button>
                    </div>

                    {/* --- CONTENT TOGGLE --- */}

                    {!showProfileForm ? (
                        /* ================= VIEW MODE ================= */
                        <div className="space-y-10 animate-fade-in">

                            {/* Top Artists Row */}
                            <div>
                                <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                                    <FaUser /> Top Artists
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                    {hasSpotifyAccount ? topArtists.slice(0, 5).map((artist, idx) => (
                                        <div key={idx} className="flex flex-col items-center group">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10 group-hover:border-green-500 transition-all duration-300 mb-3 shadow-lg">
                                                <img src={artist.images?.[0]?.url} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <h3 className="text-sm font-medium text-gray-300 text-center group-hover:text-white">{artist.name}</h3>
                                        </div>
                                    )) : <EmptyState text="Connect Spotify to see artists" />}
                                </div>
                            </div>

                            {/* Top Tracks List */}
                            <div>
                                <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                                    <FaMusic /> Top Tracks
                                </h2>
                                <div className="space-y-2">
                                    {hasSpotifyAccount ? topTracks.slice(0, 5).map((track, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-green-500/30 transition-all duration-300 group">
                                            <span className="text-green-500 font-mono w-6 text-center">{index + 1}</span>
                                            <img src={track.album?.images[2]?.url} alt="Album Art" className="w-12 h-12 rounded bg-gray-800" />
                                            <div className="flex-grow">
                                                <p className="text-white font-medium group-hover:text-green-400 transition-colors">{track.name}</p>
                                                <p className="text-sm text-gray-500">{track.artists[0].name}</p>
                                            </div>
                                            <div className="hidden md:block text-xs text-gray-600 uppercase tracking-wider">{track.album?.name.substring(0, 20)}...</div>
                                        </div>
                                    )) : <EmptyState text="Connect Spotify to see tracks" />}
                                </div>
                            </div>

                        </div>
                    ) : (
                        /* ================= EDIT MODE ================= */
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold text-white mb-6">Edit Profile</h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Left Col: Details */}
                                <form className="profile-form-container space-y-6">
                                    <InputGroup label="Display Name" name="name" type="text" placeholder="Enter your name" />
                                    <InputGroup label="Age" name="age" type="number" placeholder="24" />

                                    {/* Custom Radio Group */}
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 ml-1">Gender</label>
                                        <div className="flex gap-4">
                                            <label className="cursor-pointer">
                                                <input type="radio" name="gender" value="male" className="peer sr-only" required />
                                                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 peer-checked:bg-green-500 peer-checked:text-black peer-checked:border-green-500 transition-all">Male</div>
                                            </label>
                                            <label className="cursor-pointer">
                                                <input type="radio" name="gender" value="female" className="peer sr-only" required />
                                                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 peer-checked:bg-green-500 peer-checked:text-black peer-checked:border-green-500 transition-all">Female</div>
                                            </label>
                                        </div>
                                    </div>
                                </form>

                                {/* Right Col: Bio */}
                                <form className="bio-form-container flex flex-col h-full">
                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 ml-1">Biography</label>
                                    <textarea
                                        name="biography"
                                        className="w-full flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-all resize-none min-h-[200px]"
                                        placeholder="Tell us about your music taste..."
                                        required
                                    ></textarea>
                                </form>
                            </div>

                            {/* Actions Footer */}
                            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <FiLogOut /> Sign Out
                                </button>

                                <button
                                    type="submit"
                                    onClick={handleProfileUpdate}
                                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all transform hover:-translate-y-0.5"
                                >
                                    <FiSave /> Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

// --- HELPER COMPONENTS ---

const InputGroup = ({ label, name, type, placeholder }) => (
    <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1 ml-1">{label}</label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
        />
    </div>
);

const EmptyState = ({ text }) => (
    <div className="col-span-full py-8 text-center border-2 border-dashed border-white/10 rounded-xl">
        <p className="text-gray-500">{text}</p>
    </div>
);

export default Profile;