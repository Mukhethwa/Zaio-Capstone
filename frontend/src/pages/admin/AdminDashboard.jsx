import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Top Professional Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* Modern Ruby/Rose Pink Logo Mark */}
          <span className="text-rose-500 text-2xl font-black tracking-tight">airbnb</span>
          <span className="text-xs bg-gray-100 text-gray-600 font-bold uppercase px-2 py-0.5 rounded-md tracking-wider border">
            Host Admin
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-black transition">
            View Live Site
          </Link>
          <button 
            onClick={handleLogout}
            className="text-sm font-semibold text-rose-600 hover:text-rose-700 cursor-pointer transition"
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* Main Workspace Frame */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Welcome Banner Row */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hello, Admin</h1>
          <p className="text-gray-500 mt-1">Welcome to your central accommodations management hub.</p>
        </div>

        {/* Dashboard Grid Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Create a Listing */}
          <Link 
            to="/admin/create-listing" 
            className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 text-2xl font-bold mb-5 group-hover:bg-rose-500 group-hover:text-white transition duration-200">
                ＋
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Create New Listing</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Publish a brand new rental asset to the platform catalog database. Configure custom pricing, specific bedroom tallies, localized maps, and standard pricing fees.
              </p>
            </div>
            <div className="mt-6 text-sm font-bold text-rose-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
              Launch intake intake form →
            </div>
          </Link>

          {/* Card 2: Manage Existing Listings */}
          <Link 
            to="/admin/listings" 
            className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 text-2xl font-bold mb-5 group-hover:bg-indigo-500 group-hover:text-white transition duration-200">
                📋
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">View & Manage Listings</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Review all live properties in a production table matrix. Modify pricing tiers via pre-filled inline data modals, inspect display cover graphics, or delete old inventories instantly.
              </p>
            </div>
            <div className="mt-6 text-sm font-bold text-indigo-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
              Open listing console →
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;