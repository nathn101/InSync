import { Link, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies

const Navbar = () => {
    const [isSignedIn, setIsSignedIn] = useState(!!localStorage.getItem('token') || !!Cookies.get('token'));
    const history = useHistory();

    useEffect(() => {
        const handleStorageChange = () => {
            setIsSignedIn(!!localStorage.getItem('token'));
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
        <nav className="flex justify-between items-center bg-black p-4">
            <a href="/" className="text-green-500 text-3xl no-underline">InSync</a>
            <div className="flex gap-4">
                <Link className="text-white no-underline text-base hover:text-green-500 hover:underline-animation" to="/">Home</Link>
                <Link className="text-white no-underline text-base hover:text-green-500 hover:underline-animation" to="/About">About</Link>
                {isSignedIn ? (
                    <>
                        <Link className="text-white no-underline text-base hover:text-green-500 hover:underline-animation" to="/Match">Match</Link>
                        <Link className="text-white no-underline text-base hover:text-green-500 hover:underline-animation" to="/Profile">Profile</Link>                    </>
                ) : (
                    <Link className="text-white no-underline text-base hover:text-green-500 hover:underline-animation" to="/SignIn">Sign In</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;