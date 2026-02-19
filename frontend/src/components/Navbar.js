import { Link, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

const Navbar = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const checkAuth = () => {
            setIsSignedIn(!!localStorage.getItem('token') || !!Cookies.get('firebase_token'));
        };

        checkAuth();

        const handleStorageChange = () => {
            checkAuth();
        };

        const handleSignOutEvent = () => {
            setIsSignedIn(false);
        };

        window.addEventListener('signout', handleSignOutEvent);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('signout', handleSignOutEvent);
        };
    }, []);

    return (
        <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-6 z-50 pointer-events-none">
            
            {/* 1. BRAND LOGO (Left Side) */}
            <Link to="/" className="pointer-events-auto">
                <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-sm hover:scale-105 transition-transform duration-300">
                    InSync
                </h1>
            </Link>

            {/* 2. NAVIGATION LINKS (Floating Glass Pill) */}
            {/* We use pointer-events-auto so you can click links, but clicks outside pass through to the 3D scene */}
            <div className="pointer-events-auto flex items-center gap-8 px-8 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-lg transition-all hover:bg-white/10 hover:border-green-500/30">
                
                <Link className="text-gray-300 text-xs font-medium uppercase tracking-widest hover:text-green-400 transition-colors duration-300" to="/">
                    Home
                </Link>
                
                <Link className="text-gray-300 text-xs font-medium uppercase tracking-widest hover:text-green-400 transition-colors duration-300" to="/About">
                    About
                </Link>
                
                {isSignedIn ? (
                    <>
                        <Link className="text-gray-300 text-xs font-medium uppercase tracking-widest hover:text-green-400 transition-colors duration-300" to="/Match">
                            Match
                        </Link>
                        <Link className="text-gray-300 text-xs font-medium uppercase tracking-widest hover:text-green-400 transition-colors duration-300" to="/Profile">
                            Profile
                        </Link>
                    </>
                ) : (
                    <Link className="text-gray-300 text-xs font-medium uppercase tracking-widest hover:text-green-400 transition-colors duration-300" to="/Auth">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;