import { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Password reset link sent to your email');
            } else {
                setMessage(data.error || 'An error occurred');
            }
        } catch (error) {
            console.error('Error sending password reset link:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="forgot-password-form flex justify-center items-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-green-900">
            <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg text-center text-white max-w-md w-full">
                <h2 className="text-3xl mb-6">Forgot Password</h2>
                <form onSubmit={handleForgotPassword} className="form-container space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-left mb-2"><b>Email</b></label>
                        <input 
                            type="email" 
                            placeholder="Enter Email" 
                            name="email" 
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn w-full p-2 rounded bg-green-500 hover:bg-green-600 text-white"
                    >
                        Send Reset Link
                    </button>
                </form>
                {message && <p className="mt-4">{message}</p>}
            </div>
        </div>
    );
}

export default ForgotPassword;
