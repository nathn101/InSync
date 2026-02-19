import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    sendPasswordResetEmail, 
    signInWithCustomToken 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider } from '../firebase';
import Cookies from 'js-cookie';
import config from '../context/config';
import { FaSpotify, FaGoogle, FaFacebook } from 'react-icons/fa';

const Auth = () => {
    // STATE: Mode Toggle (Login vs Signup)
    const [isLogin, setIsLogin] = useState(true);

    // STATE: Form Data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    
    // STATE: Flow Control
    const [showUsernameForm, setShowUsernameForm] = useState(false); // For 2-step signup
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const history = useHistory();

    // 1. Check for existing cookies/tokens on mount
    useEffect(() => {  
        const firebaseToken = Cookies.get('firebase_token');
        if (firebaseToken) {
            setLoading(true);
            signInWithCustomToken(auth, firebaseToken)
                .then(async () => {
                    localStorage.setItem('token', await auth.currentUser.getIdToken());
                    window.dispatchEvent(new Event('storage')); 
                    history.push(`/profile`);
                })
                .catch((error) => {
                    console.error('Error signing in with custom token:', error);
                    setErrorMessage('Session expired. Please sign in again.');
                    setLoading(false);
                });
        }
    }, [history]);

    // 2. MAIN AUTH HANDLER (Login OR Signup)
    const handleAuth = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            if (isLogin) {
                // --- LOGIN FLOW ---
                await signInWithEmailAndPassword(auth, email, password);
                localStorage.setItem('token', await auth.currentUser.getIdToken());
                window.dispatchEvent(new Event('storage'));
                history.push('/profile');
            } else {
                // --- SIGNUP FLOW ---
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                await createUserWithEmailAndPassword(auth, email, password);
                // On success, switch UI to "Username" step
                setShowUsernameForm(true);
            }
        } catch (error) {
            console.error('Auth Error:', error);
            // Cleaner error messages
            let msg = error.message;
            if (error.code === 'auth/user-not-found') msg = "No account found with this email.";
            if (error.code === 'auth/wrong-password') msg = "Incorrect password.";
            if (error.code === 'auth/email-already-in-use') msg = "Email already in use.";
            if (error.message === "Passwords do not match") msg = "Passwords do not match.";
            setErrorMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    // 3. USERNAME HANDLER (Step 2 of Signup)
    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = auth.currentUser;
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: user.email,
            });
            localStorage.setItem("token", await user.getIdToken());
            window.dispatchEvent(new Event("storage"));
            history.push("/profile");
        } catch (error) {
            console.error("Error saving username:", error);
            setErrorMessage("Error saving username. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // 4. EXTERNAL PROVIDERS
    const handleOAuthSignIn = async (provider) => {
        try {
            await signInWithPopup(auth, provider);
            localStorage.setItem('token', await auth.currentUser.getIdToken());
            window.dispatchEvent(new Event('storage'));
            history.push('/profile');
        } catch (error) {
            console.error('OAuth Error:', error);
            setErrorMessage('Error signing in with provider.');
        }
    };

    const handleSpotifyLogin = () => {
        setLoading(true);
        window.location.href = config.SPOTIFY_LOGIN_URL;
    };

    const handleForgotPassword = async () => {
        if (!email) return setErrorMessage('Enter your email to reset password.');
        try {
            await sendPasswordResetEmail(auth, email);
            setErrorMessage('Reset link sent to your email!');
        } catch (error) {
            setErrorMessage('Error sending reset email.');
        }
    };

    // Helper to switch modes and clear errors
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErrorMessage('');
        setShowUsernameForm(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center font-sans selection:bg-green-500 selection:text-black">
            
            {/* --- BACKGROUND ELEMENTS --- */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            {/* --- GLASS CARD --- */}
            <div className="relative z-10 w-full max-w-md p-4">
                <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                            {showUsernameForm ? "One last thing..." : (isLogin ? "Welcome Back" : "Join InSync")}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            {showUsernameForm ? "Choose a unique username" : (isLogin ? "Login to access your dashboard" : "Create an account to start matching")}
                        </p>
                    </div>

                    {/* --- USERNAME FORM (Step 2 Signup) --- */}
                    {showUsernameForm ? (
                        <form onSubmit={handleUsernameSubmit} className="space-y-4">
                            <InputGroup 
                                label="Username" 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                placeholder="Choose a username"
                            />
                            {errorMessage && <p className="text-red-400 text-sm text-center">{errorMessage}</p>}
                            <SubmitButton loading={loading} text="Complete Setup" />
                        </form>
                    ) : (
                        
                        /* --- MAIN FORM (Login/Signup) --- */
                        <>
                            <form onSubmit={handleAuth} className="space-y-4">
                                <InputGroup 
                                    label="Email" 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="name@example.com"
                                />
                                
                                <InputGroup 
                                    label="Password" 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="••••••••"
                                />

                                {!isLogin && (
                                    <InputGroup 
                                        label="Confirm Password" 
                                        type="password" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        placeholder="••••••••"
                                    />
                                )}

                                {/* Forgot Password Link */}
                                {isLogin && (
                                    <div className="flex justify-end">
                                        <button type="button" onClick={handleForgotPassword} className="text-xs text-green-500 hover:text-green-400 hover:underline">
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                {errorMessage && <p className="text-red-400 text-sm text-center">{errorMessage}</p>}

                                <SubmitButton loading={loading} text={isLogin ? "Sign In" : "Create Account"} />
                            </form>

                            {/* --- SOCIAL LOGIN --- */}
                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-black/50 px-2 text-gray-500">Or continue with</span></div>
                                </div>

                                <div className="mt-6 flex justify-center gap-4">
                                    <SocialButton onClick={handleSpotifyLogin} icon={<FaSpotify />} color="text-[#1ED760]" label="Spotify" />
                                    <SocialButton onClick={() => handleOAuthSignIn(googleProvider)} icon={<FaGoogle />} color="text-white" label="Google" />
                                    <SocialButton onClick={() => handleOAuthSignIn(facebookProvider)} icon={<FaFacebook />} color="text-[#1877F2]" label="Facebook" />
                                </div>
                            </div>

                            {/* --- TOGGLE LINK --- */}
                            <div className="mt-8 text-center text-sm text-gray-400">
                                <p>
                                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                                    <button onClick={toggleMode} className="text-green-500 hover:text-green-400 font-medium hover:underline transition-all">
                                        {isLogin ? "Sign up" : "Sign in"}
                                    </button>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- HELPER COMPONENTS FOR STYLING ---

const InputGroup = ({ label, type, value, onChange, placeholder }) => (
    <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1 ml-1">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
        />
    </div>
);

const SubmitButton = ({ loading, text }) => (
    <button 
        type="submit" 
        disabled={loading}
        className={`w-full py-3 rounded-xl font-medium tracking-wide transition-all duration-300 shadow-lg ${
            loading 
            ? 'bg-gray-600 cursor-not-allowed opacity-50' 
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black hover:shadow-green-500/20'
        }`}
    >
        {loading ? 'Processing...' : text}
    </button>
);

const SocialButton = ({ onClick, icon, color, label }) => (
    <button 
        onClick={onClick}
        type="button"
        className={`p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${color} text-xl w-14 h-14 flex items-center justify-center`}
        title={`Sign in with ${label}`}
    >
        {icon}
    </button>
);

export default Auth;