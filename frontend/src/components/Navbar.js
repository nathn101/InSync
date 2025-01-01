import { Link, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies

const Navbar = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const handleStorageChange = () => {
            setIsSignedIn(!!localStorage.getItem('token') || !!Cookies.get('firebase_token'));
        };

        const handleSignOutEvent = () => {
            setIsSignedIn(false);
        }
        window.addEventListener('signout', handleSignOutEvent);
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('signout', handleSignOutEvent);
        };
    }, []);

    return (
        <nav className="absolute top-0 left-0 w-full flex justify-between items-center bg-black p-4 z-50">
            <Link to="/" className="text-green-500 text-3xl no-underline">InSync</Link>
            <div className="flex gap-4">
                <Link className="text-white no-underline text-base hover:text-green-500 hover:underline-animation" to="/">Home</Link>
                <Link className="text-white no-underline text-base hover:text-green-500 hover:underline-animation" to="/About">About</Link>
                {isSignedIn ? (
                    <>
                        <Link className="text-white no-underline text-base hover:text-green-500 hover:underline-animation" to="/Match">Match</Link>
                        <Link className="text-white no-underline text-base hover:text-green-500 hover:underline-animation" to="/Profile">Profile</Link>
                    </>
                ) : (
                    <Link className="text-white no-underline text-base hover:text-green-500 hover:underline-animation" to="/SignIn">Sign In</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;