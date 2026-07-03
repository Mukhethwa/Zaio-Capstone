import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try { // FIXED: Added the missing opening try block here
      const response = await axios.post('/api/users/login', {
        username,
        password
      });
      
      const { token, user } = response.data;

      if (token) {
        if (user?.role === 'admin') {
          localStorage.setItem('token', token);
          localStorage.setItem('role', user.role);
          localStorage.setItem('username', user.username);

          navigate('/admin/create-listing');
        } else {
          setError('Access denied. This portal is restricted to administrator profiles only.');
          localStorage.clear();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 font-sans antialiased text-gray-900">
      
      {/* Branded Brand Header Anchor Node */}
      <div className="absolute top-6 left-6 md:left-12">
        <Link to="/" className="flex items-center gap-1.5 text-rose-500 hover:opacity-90 transition no-underline">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-current" aria-hidden="true">
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.178a23.947 23.947 0 0 1-1.89-2.257l-.228-.3-.162-.224c-.134.183-.284.375-.45.575l-.337.391a24.52 24.52 0 0 1-1.786 1.918l-.248.243c-2.176 2.15-4.528 3.418-6.75 3.418-3.48 0-6.358-2.416-6.358-6.478 0-1.157.315-2.24 1.011-3.792l.135-.29c1.01-2.35 5.17-11.06 7.13-14.912l.514-.993C12.537 1.963 13.992 1 16 1zm0 2c-1.238 0-2.203.623-3.14 2.296l-.513.992c-1.95 3.834-6.096 12.518-7.1 14.854l-.137.293c-.63 1.407-.866 2.233-.905 2.923l-.005.234c0 2.902 1.94 4.478 4.358 4.478 1.636 0 3.52-1.022 5.347-2.833l.255-.257a22.51 22.51 0 0 0 1.98-2.15l.235-.286.205-.262-.224-.277c-1.39-1.74-2.274-3.77-2.617-5.918l-.053-.362-.016-.2c0-3.136 2.403-5.642 5.51-5.642 3.037 0 5.426 2.41 5.508 5.438l.002.204c0 2.254-.913 4.332-2.378 6.136l-.24.288.242.275c.618.694 1.253 1.374 1.905 2.034l.26.255c1.82 1.794 3.696 2.806 5.318 2.806 2.417 0 4.357-1.576 4.357-4.478 0-.622-.213-1.38-.79-2.76l-.152-.365c-.982-2.288-5.128-10.972-7.09-14.823l-.532-1.024C18.203 3.623 17.238 3 16 3zm0 9c-1.984 0-3.51 1.547-3.51 3.442 0 1.72 1.258 3.32 2.91 4.195l.31.15.29.117c.23.08.31.144.31.253 0 .144-.114.243-.364.243-.654 0-1.42-.486-2.12-1.385l-.17-.23-.284-.424-1.464.975.275.43c.966 1.455 2.258 2.308 3.763 2.308 1.474 0 2.374-.74 2.374-1.843 0-1.037-.624-1.7-1.924-2.18l-.29-.107-.31-.12c-.37-.156-.514-.373-.514-.64 0-.616.48-1.047 1.51-1.047.886 0 1.764.442 2.502 1.272l.19.227.228.293 1.442-.993-.243-.326c-.927-1.2-2.115-1.944-3.515-1.944z"></path>
          </svg>
          <span className="text-xl font-black tracking-tight">airbnb</span>
        </Link>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200/60 mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 text-left">Admin Workspace</h2>
        <p className="text-left text-gray-500 mb-6 text-xs font-medium">Log in using authorization keys to access properties configurations.</p>
        
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3.5 rounded-xl mb-5 text-xs font-semibold text-left animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm text-gray-900 bg-white"
              placeholder="Enter admin username"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm text-gray-900 bg-white"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link 
              to="#" 
              onClick={(e) => { e.preventDefault(); alert("Contact system root engineering devops team for credential rollouts."); }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline no-underline"
            >
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md transform active:scale-98 disabled:opacity-50 cursor-pointer text-sm mt-2"
          >
            {loading ? 'Authenticating Security context...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;