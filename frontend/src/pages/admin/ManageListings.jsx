import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManageListings = () => {
    const [listings, setListings] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [editingListing, setEditingListing] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    //Pulls the logged in operator metadata dynamically with an authentic structural fallback
    const adminUsername = localStorage.getItem('username') || 'Jane Doe';

    const hostInfo = {
        name: adminUsername,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    };

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await axios.get('/api/accommodations');
                setListings(res.data);
            } catch (err) {
                console.error("Error fetching listings:", err);
                setError('Failed to fetch listings from database.');
            }
        };
        fetchListings();
    }, []);

    const deleteListing = async (id) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                const token = localStorage.getItem('token');
                // Removed localhost
                await axios.delete(`/api/accommodations/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setListings(listings.filter(l => l._id !== id));
                setMessage('Listing deleted successfully');
                setTimeout(() => setMessage(''), 3000);
            } catch (err) {
                setError('Failed to delete listing.');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            // Format as FormData so the backend Multer middleware accepts it
            const updateData = new FormData();
            updateData.append('title', editingListing.title || '');
            updateData.append('location', editingListing.location || '');
            updateData.append('description', editingListing.description || '');
            updateData.append('price', editingListing.price || 0);
            updateData.append('guests', editingListing.guests || 1);
            updateData.append('bedrooms', editingListing.bedrooms || 1);
            updateData.append('bathrooms', editingListing.bathrooms || 1);
            
            const amenitiesStr = typeof editingListing.amenities === 'string' 
                ? editingListing.amenities 
                : editingListing.amenities.join(', ');
            updateData.append('amenities', amenitiesStr);

            // Removed localhost
            const res = await axios.put(`/api/accommodations/${editingListing._id}`, updateData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setListings(listings.map(l => l._id === editingListing._id ? res.data : l));
            setEditingListing(null);
            setMessage('Listing updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError('Failed to update listing profile.');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans antialiased text-gray-900">
            
            {/* 1. BRANDED AIRBNB TOP NAV BAR WITH MENU LOGIC */}
            <nav className="bg-white border-b border-gray-100 px-6 md:px-12 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
                {/* Brand Identity Branding Logo Mark */}
                <Link to="/" className="flex items-center gap-1.5 text-rose-500 hover:opacity-90 transition no-underline">
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-current" aria-hidden="true">
                        <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.178a23.947 23.947 0 0 1-1.89-2.257l-.228-.3-.162-.224c-.134.183-.284.375-.45.575l-.337.391a24.52 24.52 0 0 1-1.786 1.918l-.248.243c-2.176 2.15-4.528 3.418-6.75 3.418-3.48 0-6.358-2.416-6.358-6.478 0-1.157.315-2.24 1.011-3.792l.135-.29c1.01-2.35 5.17-11.06 7.13-14.912l.514-.993C12.537 1.963 13.992 1 16 1zm0 2c-1.238 0-2.203.623-3.14 2.296l-.513.992c-1.95 3.834-6.096 12.518-7.1 14.854l-.137.293c-.63 1.407-.866 2.233-.905 2.923l-.005.234c0 2.902 1.94 4.478 4.358 4.478 1.636 0 3.52-1.022 5.347-2.833l.255-.257a22.51 22.51 0 0 0 1.98-2.15l.235-.286.205-.262-.224-.277c-1.39-1.74-2.274-3.77-2.617-5.918l-.053-.362-.016-.2c0-3.136 2.403-5.642 5.51-5.642 3.037 0 5.426 2.41 5.508 5.438l.002.204c0 2.254-.913 4.332-2.378 6.136l-.24.288.242.275c.618.694 1.253 1.374 1.905 2.034l.26.255c1.82 1.794 3.696 2.806 5.318 2.806 2.417 0 4.357-1.576 4.357-4.478 0-.622-.213-1.38-.79-2.76l-.152-.365c-.982-2.288-5.128-10.972-7.09-14.823l-.532-1.024C18.203 3.623 17.238 3 16 3zm0 9c-1.984 0-3.51 1.547-3.51 3.442 0 1.72 1.258 3.32 2.91 4.195l.31.15.29.117c.23.08.31.144.31.253 0 .144-.114.243-.364.243-.654 0-1.42-.486-2.12-1.385l-.17-.23-.284-.424-1.464.975.275.43c.966 1.455 2.258 2.308 3.763 2.308 1.474 0 2.374-.74 2.374-1.843 0-1.037-.624-1.7-1.924-2.18l-.29-.107-.31-.12c-.37-.156-.514-.373-.514-.64 0-.616.48-1.047 1.51-1.047.886 0 1.764.442 2.502 1.272l.19.227.228.293 1.442-.993-.243-.326c-.927-1.2-2.115-1.944-3.515-1.944z"></path>
                    </svg>
                    <span className="text-xl font-black tracking-tight hidden sm:inline-block">airbnb</span>
                    <span className="text-xs font-semibold text-gray-400 tracking-wider ml-1 uppercase bg-gray-100 px-1.5 py-0.5 rounded">Host</span>
                </Link>

                {/* Profile Widget & Dropdown trigger */}
                <div className="relative">
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex items-center gap-3 border border-gray-200 p-2 pl-3.5 rounded-full hover:shadow-md transition bg-white cursor-pointer active:scale-98"
                    >
                        {/* Hamburger Icon */}
                        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-gray-600">
                            <line x1="5" y1="8" x2="27" y2="8" />
                            <line x1="5" y1="16" x2="27" y2="16" />
                            <line x1="5" y1="24" x2="27" y2="24" />
                        </svg>
                        
                        {/* Custom Context Username & Avatar Image */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-700 hidden md:inline-block max-w-[120px] truncate">
                                {hostInfo.name}
                            </span>
                            <img 
                                src={hostInfo.avatar} 
                                alt={hostInfo.name} 
                                className="w-7 h-7 object-cover rounded-full bg-gray-200 shadow-inner"
                            />
                        </div>
                    </button>

                    {/* Dropdown Options List Menu overlay */}
                    {menuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-1 duration-150 text-left">
                                <Link to="/admin/dashboard" className="block px-4 py-2.5 text-xs font-bold text-gray-900 hover:bg-gray-50 no-underline">Dashboard Home</Link>
                                <Link to="/admin/create-listing" className="block px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 no-underline">Create Listing</Link>
                                <hr className="border-gray-100 my-1" />
                                <Link to="/" className="block px-4 py-2.5 text-xs text-rose-600 font-medium hover:bg-gray-50 no-underline">Logout Hub</Link>
                            </div>
                        </>
                    )}
                </div>
            </nav>

            {/* 2. ROUNDED OPTIONS NAVIGATION - SIDE TO SIDE LINK PILLS */}
            <header className="max-w-6xl mx-auto mt-6 px-6">
                <div className="flex flex-wrap items-center gap-2.5 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <Link 
                        to="/admin/reservations" 
                        className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gray-50 text-gray-700 border border-gray-200/60 hover:bg-gray-100 hover:text-black no-underline transition shadow-sm"
                    >
                        View Reservations
                    </Link>
                    <Link 
                        to="/admin/listings" 
                        className="px-5 py-2.5 text-xs font-bold rounded-xl bg-rose-500 text-white border border-rose-500 hover:bg-rose-600 no-underline transition shadow-sm shadow-rose-100"
                    >
                        View Listings
                    </Link>
                    <Link 
                        to="/admin/create-listing" 
                        className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gray-50 text-gray-700 border border-gray-200/60 hover:bg-gray-100 hover:text-black no-underline transition shadow-sm"
                    >
                        Create Listings
                    </Link>
                </div>
            </header>

            {/* MAIN DASHBOARD CONTENT GRID */}
            <main className="max-w-6xl mx-auto mt-8 px-6 text-left">
                
                {/* 3. MY HOTEL LIST HEADER */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-900">My Hotel List</h1>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">Control live availability configurations and pricing rates.</p>
                    </div>
                </div>

                {message && <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl mb-6 text-xs font-medium animate-pulse">{message}</div>}
                {error && <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl mb-6 text-xs font-medium">{error}</div>}

                {/* 4. CHRONOLOGICAL ROWS FOR ALL APPLICABLE LISTINGS */}
                <div className="space-y-6">
                    {listings.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                            <p className="text-sm font-semibold text-gray-500">No properties mapped onto this admin context profile yet.</p>
                            <Link to="/admin/create-listing" className="inline-block mt-4 bg-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl no-underline">Post First Asset</Link>
                        </div>
                    ) : (
                        listings.map((item) => (
                            <div 
                                key={item._id} 
                                className="bg-white rounded-2xl border border-gray-200/70 p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-6 items-start md:items-stretch"
                            >
                                {/* Left Segment: Photo Asset & Interactive Utility Controls */}
                                <div className="w-full md:w-64 flex flex-col justify-between gap-4 shrink-0">
                                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-100 shadow-inner relative">
                                        <img 
                                            src={item.images && item.images[0] ? item.images[0] : (item.image ? `http://localhost:5000${item.image}` : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6')} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                            Live
                                        </span>
                                    </div>
                                    
                                    {/* Rounded Action Macro Buttons Bundle */}
                                    <div className="flex flex-col gap-2 mt-auto">
                                        <button 
                                            onClick={() => setEditingListing(item)} 
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition active:scale-98 cursor-pointer"
                                        >
                                            Update
                                        </button>
                                        <button 
                                            onClick={() => deleteListing(item._id)} 
                                            className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition active:scale-98 cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Right Segment: Metadata Description Metrics & Metadata Stack */}
                                <div className="flex-1 flex flex-col justify-between py-1 text-left">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-snug">{item.title}</h3>
                                                <p className="text-xs text-gray-400 font-medium">{item.location || 'Cape Town, South Africa'}</p>
                                            </div>
                                            
                                            {/* Star Review Rating Indicator badge */}
                                            <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg shrink-0">
                                                <span className="text-amber-500 text-xs">★</span>
                                                <span className="text-xs font-bold text-gray-800">4.96</span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500 leading-relaxed font-normal max-w-2xl line-clamp-3">
                                            {item.description || 'No descriptive structural profile metadata string logged onto this property configuration node inside the cloud ecosystem database.'}
                                        </p>
                                    </div>

                                    {/* Bottom Info Bar Block */}
                                    <div className="border-t border-gray-100 pt-4 mt-6 flex justify-between items-center">
                                        <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                                            <span>Guests: <strong className="text-gray-700">{item.guests || 2}</strong></span>
                                            <span>Bedrooms: <strong className="text-gray-700">{item.bedrooms || 1}</strong></span>
                                            <span>Bathrooms: <strong className="text-gray-700">{item.bathrooms || 1}</strong></span>
                                        </div>
                                        
                                        {/* Financial Nightly Quote Pricing Rate */}
                                        <div className="text-right">
                                            <span className="text-xs text-gray-400 block font-normal">Nightly Rate</span>
                                            <span className="text-lg font-black text-gray-900">R {item.price || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* PRE-FILLED INTERACTIVE MODAL COMPONENT WINDOW */}
            {editingListing && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-left">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3.5 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Update Hotel Settings</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{editingListing.title}</p>
                            </div>
                            <button 
                                onClick={() => setEditingListing(null)} 
                                className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold transition flex items-center justify-center border text-sm cursor-pointer"
                            >
                                ×
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Hotel Title</label>
                                    <input type="text" name="title" value={editingListing.title || ''} onChange={handleEditChange} required className="w-full border border-gray-200 p-2.5 rounded-xl text-xs mt-1.5 focus:outline-rose-500"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Location Address</label>
                                    <input type="text" name="location" value={editingListing.location || ''} onChange={handleEditChange} required className="w-full border border-gray-200 p-2.5 rounded-xl text-xs mt-1.5 focus:outline-rose-500"/>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Description Summary</label>
                                <textarea name="description" value={editingListing.description || ''} onChange={handleEditChange} rows="3" required className="w-full border border-gray-200 p-2.5 rounded-xl text-xs mt-1.5 focus:outline-rose-500"></textarea>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Price (R)</label>
                                    <input type="number" name="price" value={editingListing.price || 0} onChange={handleEditChange} required className="w-full border border-gray-200 p-2.5 rounded-xl text-xs mt-1.5 focus:outline-rose-500"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Max Guests</label>
                                    <input type="number" name="guests" value={editingListing.guests || 1} onChange={handleEditChange} className="w-full border border-gray-200 p-2.5 rounded-xl text-xs mt-1.5 focus:outline-rose-500"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Bedrooms</label>
                                    <input type="number" name="bedrooms" value={editingListing.bedrooms || 1} onChange={handleEditChange} className="w-full border border-gray-200 p-2.5 rounded-xl text-xs mt-1.5 focus:outline-rose-500"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Bathrooms</label>
                                    <input type="number" name="bathrooms" value={editingListing.bathrooms || 1} onChange={handleEditChange} className="w-full border border-gray-200 p-2.5 rounded-xl text-xs mt-1.5 focus:outline-rose-500"/>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Amenities (Comma separated)</label>
                                <input type="text" name="amenities" value={Array.isArray(editingListing.amenities) ? editingListing.amenities.join(', ') : editingListing.amenities || ''} onChange={handleEditChange} className="w-full border border-gray-200 p-2.5 rounded-xl text-xs mt-1.5 focus:outline-rose-500" placeholder="WiFi, Pool, Aircon, Kitchen"/>
                            </div>

                            <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100 mt-6">
                                <button type="button" onClick={() => setEditingListing(null)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-gray-950 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md transition">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageListings;