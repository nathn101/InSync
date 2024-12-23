import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center bg-black p-4">
            <a href="/" className="text-green-500 text-xl no-underline">InSync</a>
            <div className="flex gap-4">
                <Link className="text-white no-underline text-base hover:text-green-500 hover:underline-animation" to="/">Home</Link>
                <Link className="text-white no-underline text-base hover:text-green-500 hover:underline-animation" to="/Match">Match</Link>
                <Link className="text-white no-underline text-base hover:text-green-500 hover:underline-animation" to="/Profile">Profile</Link>
                <Link className="text-white no-underline text-base hover:text-green-500 hover:underline-animation" to="/SignIn">Sign In</Link>
            </div>
        </nav>
    );
}

export default Navbar;