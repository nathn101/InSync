import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, signInWithCustomToken } from 'firebase/auth';
import { auth, facebookProvider, googleProvider } from '../firebase';
import Cookies from 'js-cookie';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    useEffect(() => {  
        const firebaseToken = Cookies.get('firebase_token');
        const spotifyToken = Cookies.get('spotify_access_token');
        const spotifyRefreshToken = Cookies.get('spotify_refresh_token');
        if (firebaseToken) {
            signInWithCustomToken(auth, firebaseToken)
                .then(async () => {
                    localStorage.setItem('token', await auth.currentUser.getIdToken());
                    window.dispatchEvent(new Event('storage')); // Trigger storage event to update Navbar
                    history.push(`/profile`); // Redirect to profile with Spotify tokens
                })
                .catch((error) => {
                    console.error('Error signing in with custom token:', error);
                    setErrorMessage('Error signing in with custom token');
                });
        }
    }, [history]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem('token', await auth.currentUser.getIdToken());
            window.dispatchEvent(new Event('storage')); // Trigger storage event to update Navbar
            history.push('/profile'); // Redirect to Dashboard
        } catch (error) {
            console.error('Error signing in:', error);
            setErrorMessage('Invalid email or password');
        }
    };

    const handleSpotifyLogin = () => {
        window.location.href = 'http://localhost:5000/api/spotifylogin';
    };

    const handleOAuthSignIn = async (provider) => {
        try {
            await signInWithPopup(auth, provider);
            console.log('OAuth sign-in successful');
            localStorage.setItem('token', await auth.currentUser.getIdToken());
            window.dispatchEvent(new Event('storage')); // Trigger storage event to update Navbar
            history.push('/profile'); // Redirect to Dashboard
        } catch (error) {
            console.error('Error with OAuth sign-in:', error);
            setErrorMessage('Error with OAuth sign-in');
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setErrorMessage('Please enter your email to reset password');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setErrorMessage('Password reset link sent to your email');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            setErrorMessage('Error sending password reset email');
        }
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (errorMessage) {
            setErrorMessage('');
        }
    };

    const isFormValid = email && password;

    return ( 
        <div className="signin-form flex justify-center items-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-green-900">
            <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg text-center text-white max-w-md w-full">
                <h2 className="text-3xl mb-6">Sign In</h2>
                <form onSubmit={handleSignIn} className="form-container space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-left mb-2"><b>Email</b></label>
                        <input 
                            type="text" 
                            placeholder="Enter Email" 
                            name="email" 
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700" 
                            required 
                            value={email}
                            onChange={handleInputChange(setEmail)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-left mb-2"><b>Password</b></label>
                        <input 
                            type="password" 
                            placeholder="Enter Password" 
                            name="password" 
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700" 
                            required 
                            value={password}
                            onChange={handleInputChange(setPassword)}
                        />
                    </div>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    <button 
                        type="submit" 
                        className={`btn w-full p-2 rounded ${isFormValid ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 cursor-not-allowed'} text-white`}
                        disabled={!isFormValid}
                    >
                        Login
                    </button>
                    <p className="mt-2">
                        <button type="button" onClick={handleForgotPassword} className="text-green-500 hover:underline">
                            Forgot Password?
                        </button>
                    </p>
                </form>
                <div className="mt-6 flex justify-center gap-4 items-center">
                    <button onClick={handleSpotifyLogin} className="p-2 rounded bg-white hover:bg-gray-200 text-black w-12 h-12 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168 168" className="w-6 h-6">
                            <path fill="#1ED760" d="M84 0C37.8 0 0 37.8 0 84s37.8 84 84 84 84-37.8 84-84S130.2 0 84 0zm38.1 121.5c-1.2 1.8-3.6 2.4-5.4 1.2-14.7-9-33.3-11.1-55.4-6.3-2.1.6-4.2-.9-4.8-3-1.2-2.1.9-4.2 3-4.8 24.6-5.1 45.6-2.7 62.4 7.2 1.8 1.2 2.4 3.6 1.2 5.7zm7.2-18.6c-1.5 2.4-4.5 3.3-6.9 1.8-16.8-10.2-42.4-13.2-62.4-7.5-2.7.9-5.4-.6-6.3-3.3-.9-2.7.6-5.4 3.3-6.3 22.5-6.3 50.1-3 69.6 8.4 2.4 1.5 3.3 4.5 1.8 6.9zm.3-20.4c-20.7-12.3-55.2-13.5-74.4-7.5-3 .9-6.3-.9-7.2-3.9-.9-3 .9-6.3 3.9-7.2 22.5-6.6 60.6-5.1 83.7 8.4 2.7 1.5 3.6 5.1 2.1 7.8-1.5 2.4-5.1 3.3-7.8 1.8z"/>
                        </svg>
                    </button>
                    <button onClick={() => handleOAuthSignIn(googleProvider)} className="p-2 rounded bg-white hover:bg-gray-200 text-black w-12 h-12 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
                            <path fill="#EA4335" d="M24 9.5c3.1 0 5.8 1.1 7.9 3.1l5.9-5.9C33.6 3.2 29.1 1 24 1 14.9 1 7.3 6.9 4.3 15.1l6.9 5.4C12.9 14.1 18 9.5 24 9.5z"/>
                            <path fill="#4285F4" d="M46.5 24c0-1.5-.1-2.9-.4-4.3H24v8.1h12.7c-.6 3.1-2.4 5.7-4.9 7.4l6.9 5.4c4-3.7 6.3-9.1 6.3-15.6z"/>
                            <path fill="#FBBC05" d="M10.2 28.5c-1.1-3.1-1.1-6.5 0-9.6L3.3 13.5C.1 19.2 0 26.8 3.3 32.5l6.9-5.4z"/>
                            <path fill="#34A853" d="M24 46c5.1 0 9.6-1.7 13.2-4.7l-6.9-5.4c-2 1.3-4.5 2.1-7.2 2.1-6 0-11.1-4.1-12.9-9.6l-6.9 5.4C7.3 41.1 14.9 46 24 46z"/>
                            <path fill="none" d="M0 0h48v48H0z"/>
                        </svg>
                    </button>
                    <button onClick={() => handleOAuthSignIn(facebookProvider)} className="p-2 rounded bg-white hover:bg-gray-200 text-black w-12 h-12 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
                            <path fill="#3B5998" d="M24 1C11.3 1 1 11.3 1 24c0 11.6 8.4 21.2 19.3 23.4v-16.5h-5.8v-6.9h5.8v-5.3c0-5.7 3.4-8.9 8.6-8.9 2.5 0 5.1.4 5.1.4v5.6h-2.9c-2.9 0-3.8 1.8-3.8 3.6v4.6h6.5l-1 6.9h-5.5V47.4C38.6 45.2 47 35.6 47 24 47 11.3 36.7 1 24 1z"/>
                        </svg>
                    </button>
                </div>
                <div className="mt-6">
                    <p>Don't have an account? <Link to="/SignUp" className="text-green-500 hover:underline">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;