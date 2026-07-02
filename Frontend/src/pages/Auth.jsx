import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const Auth = () => {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',      
        password: '',
        role: 'user' //Default registration profile fallback
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const endpoint = isLoginMode ? '/api/users/login' : '/api/users/register';
        const url = `http://localhost:5000${endpoint}`;

        if (!formData.username || !formData.password || (!isLoginMode && !formData.email)) {
            setError('Please fill in all required fields.');
            return;
        }

        //Matches structural schema properties
        const payload = isLoginMode 
            ? { username: formData.username, password: formData.password }
            : { username: formData.username, email: formData.email, password: formData.password, role: formData.role };

        try {
            const response = await axios.post(url, payload);
            const { token, user } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', user?.role || formData.role);
                localStorage.setItem('username', user?.username || formData.username);
            }

            setSuccess(isLoginMode ? '👋 Welcome back!' : '🚀 Account created successfully!');
            
            setTimeout(() => {
                navigate('/');
                window.location.reload(); 
            }, 1500);

        } catch (err) {
            console.error("Authentication Request Crash:", err);
            setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Header />
            
            <div className="max-w-md mx-auto mt-20 px-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                            {isLoginMode ? 'Sign in to your account' : 'Create platform profile'}
                        </h2>
                        <p className="text-xs text-gray-500 mt-2">
                            {isLoginMode ? "Welcome back to your holiday engine portal" : "Join us to manage or reserve platform units"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                        <div>
                            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 text-xs">Username</label>
                            <input 
                                type="text" 
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Enter username"
                                className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:border-rose-500 transition font-medium"
                            />
                        </div>

                        {!isLoginMode && (
                            <>
                                <div>
                                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 text-xs">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="name@example.com"
                                        className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:border-rose-500 transition font-medium"
                                    />
                                </div>

                                {/* Dynamic System Role Selection Dropdown */}
                                <div>
                                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 text-xs">Account Type / Privilege Profile</label>
                                    <select 
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:border-rose-500 transition font-semibold text-gray-700 cursor-pointer"
                                    >
                                        <option value="user">Standard Traveler Account (User)</option>
                                        <option value="host">Property Owner Profile (Host)</option>
                                        <option value="admin">System Administrator Workspace (Admin)</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 text-xs">Password</label>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:border-rose-500 transition font-medium"
                            />
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm rounded-xl cursor-pointer hover:opacity-95 shadow-md active:scale-[0.99] transition duration-150 mt-2"
                        >
                            {isLoginMode ? 'Sign In' : 'Register Account'}
                        </button>
                    </form>

                    {error && <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border font-semibold text-center">{error}</div>}
                    {success && <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg border font-semibold text-center">{success}</div>}

                    <div className="text-center pt-2 border-t border-gray-100">
                        <button 
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setError('');
                                setSuccess('');
                            }}
                            className="text-xs text-rose-600 font-semibold underline hover:text-rose-700"
                        >
                            {isLoginMode ? "Don't have an account? Sign up here" : "Already have an account? Log in instead"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;