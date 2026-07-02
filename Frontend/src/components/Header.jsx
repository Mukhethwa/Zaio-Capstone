import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; //Essential styles for calendar layout rendering

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username'); 

    //Date Range Selection State Context
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    //Guest Profile Counter State Engine
    const [showGuestMenu, setShowGuestMenu] = useState(false);
    const [guestCount, setGuestCount] = useState(1);
    const [destination, setDestination] = useState('');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        window.location.reload();
    };

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        //Pack local query filters to carry across listing results grid matrices
        console.log("Executing Search Filter Execution Payload:", {
            destination,
            startDate,
            endDate,
            guests: guestCount
        });
        
        //Dynamic path router passing search criteria query strings if needed
        navigate(`/locations?search=${destination}&guests=${guestCount}`);
    };

    return (
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50 font-sans shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                
                {/* 1. Brand Logo Section (Airbnb SVG Layout Structure) */}
                <Link to="/" className="flex items-center text-rose-500 no-underline hover:opacity-90 transition min-w-[120px]">
                    <svg width="102" height="32" fill="currentColor" viewBox="0 0 1000 300">
                       {/* <path d="M500 150c-20 0-40-15-50-35L300 0H150l250 450c20 40 80 40 100 0l250-450H600L550 115c-10 20-30 35-50 35zm0 100c-60 0-110-50-110-110S440 30 500 30s110 50 110 110-50 110-110 110zm0-170c-35 0-60 25-60 60s25 60 60 60 60-25 60-60-25-60-60-60z"/>
                        */}<text x="140" y="220" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="160" letterSpacing="-2">Airbnb</text>
                    </svg>
                </Link>

                {/* 2. Upgraded "Pill" Search Engine Structure */}
                <div className="hidden md:flex items-center border border-gray-200 rounded-full py-1.5 pl-4 pr-2 shadow-sm hover:shadow-md transition bg-white relative">
                    
                    {/* Destination Input Wrapper */}
                    <div className="flex flex-col text-left pr-2 border-r border-gray-200">
                        <label className="text-[10px] font-black text-gray-950 uppercase tracking-wider">Where</label>
                        <input 
                            type="text" 
                            placeholder="Search destinations" 
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="text-xs bg-transparent outline-none w-28 placeholder-gray-400 text-gray-900 font-medium pt-0.5" 
                        />
                    </div>

                    {/* Integrated Range Calendar Date Picker */}
                    <div className="flex flex-col text-left px-3 border-r border-gray-200 relative custom-datepicker-container">
                        <label className="text-[10px] font-black text-gray-950 uppercase tracking-wider mb-0.5">Stay Horizon</label>
                        <DatePicker
                            selected={startDate}
                            onChange={handleDateChange}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            monthsShown={2}
                            minDate={new Date()} //Prevents setting stay blocks into expired historic dates
                            placeholderText="Add checking windows"
                            className="text-xs bg-transparent outline-none w-36 placeholder-gray-400 text-gray-900 font-medium cursor-pointer"
                        />
                    </div>

                    {/* Interactive Increment Guest Popover Gate */}
                    <div className="flex items-center justify-between text-left pl-3 pr-1 min-w-[110px] relative">
                        <div 
                            className="flex flex-col cursor-pointer select-none"
                            onClick={() => setShowGuestMenu(!showGuestMenu)}
                        >
                            <label className="text-[10px] font-black text-gray-950 uppercase tracking-wider">Who</label>
                            <span className="text-xs font-medium text-gray-900 pt-0.5">
                                {guestCount} guest{guestCount > 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Pink Circular Action Button */}
                        <button 
                            onClick={handleSearchSubmit}
                            className="bg-rose-500 hover:bg-rose-600 rounded-full p-2.5 text-white transition ml-3 shadow-sm flex items-center justify-center cursor-pointer"
                        >
                            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="4.5" className="w-3.5 h-3.5">
                                <circle cx="14" cy="14" r="10"></circle>
                                <path d="M22 22L30 30"></path>
                            </svg>
                        </button>

                        {/* Dynamic Guest Counter Popover Dropdown layout */}
                        {showGuestMenu && (
                            <>
                                {/* Transparent page barrier overlay to close dropdown comfortably when clicking outside */}
                                <div className="fixed inset-0 z-40" onClick={() => setShowGuestMenu(false)} />
                                
                                <div className="absolute right-0 top-[54px] w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900">Guests</span>
                                            <span className="text-[11px] text-gray-400 font-medium">Ages 13 or above</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                type="button"
                                                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                                className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm transition ${guestCount <= 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-400 text-gray-600 hover:border-black active:scale-95'}`}
                                                disabled={guestCount <= 1}
                                            >
                                                —
                                            </button>
                                            <span className="font-bold text-sm text-gray-900 min-w-[12px] text-center">
                                                {guestCount}
                                            </span>
                                            <button 
                                                type="button"
                                                onClick={() => setGuestCount(guestCount + 1)}
                                                className="w-8 h-8 rounded-full border border-gray-400 hover:border-black flex items-center justify-center font-bold text-sm text-gray-600 active:scale-95 transition"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>

                {/* 3. Right Side Layout Profile & Options Workspace */}
                <nav className="flex items-center gap-2">
                    <Link to="/admin/login" className="hidden lg:block text-sm font-bold text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-full transition no-underline">
                        Become a host
                    </Link>
                    
                    <button className="hidden lg:flex items-center justify-center h-10 w-10 hover:bg-gray-50 rounded-full transition text-gray-700">
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                            <path d="M8 .25a7.75 7.75 0 1 0 0 15.5A7.75 7.75 0 0 0 8 .25zm0 1.5c1.46 0 2.76.62 3.65 1.6H4.35C5.24 2.37 6.54 1.75 8 1.75zm-4.3 2.75h8.6c.3.72.5 1.5.55 2.32H3.15c.05-.82.25-1.6.55-2.32zm.55 7.93c-.9-.98-2.2-1.6-3.65-1.6h7.3c-1.45 0-2.75.62-3.65 1.6zm4.3 1.32c-1.46 0-2.76-.62-3.65-1.6h7.3c-.89.98-2.19 1.6-3.65 1.6zm4.3-2.75H3.15c-.05-.82-.25-1.6-.55-2.32h9.8c-.3.72-.5 1.5-.55 2.32z"></path>
                        </svg>
                    </button>

                    {/* Profile Panel Pill Matrix Wrapper */}
                    <div className="flex items-center border border-gray-200 rounded-full p-1.5 pl-3 hover:shadow-md transition gap-3 cursor-pointer ml-2 relative group select-none">
                        <svg viewBox="0 0 32 32" fill="currentColor" className="w-4 h-4 text-gray-600">
                            <path d="M4 10h24v2H4zm0 6h24v2H4zm0 6h24v2H4z"></path>
                        </svg>
                        
                        <div className="bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center overflow-hidden font-sans shadow-inner">
                            {token ? (
                                <span className="font-bold text-xs uppercase tracking-wider">{username?.charAt(0) || 'U'}</span>
                            ) : (
                                <svg viewBox="0 0 32 32" fill="currentColor" className="w-8 h-8 mt-1.5 text-white">
                                    <path d="M16 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0 2c-5.335 0-16 2.67-16 8v4h32v-4c0-5.33-10.665-8-16-8z"></path>
                                </svg>
                            )}
                        </div>

                        {/* Interactive Context Dropdown Overlay Dashboard Menu Matrix */}
                        <div className="absolute right-0 top-12 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-2 hidden group-hover:block z-50 transform origin-top-right transition-all duration-200">
                            {token ? (
                                <>
                                    <div className="px-4 py-2 font-bold text-xs text-rose-500 border-b border-gray-100 truncate">
                                        Logged in as {username || 'User'}
                                    </div>
                                    <Link to="/locations" className="block no-underline px-4 py-2.5 text-sm text-gray-700 font-semibold hover:bg-gray-50">Explore Stays</Link>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button 
                                        onClick={handleLogout} 
                                        className="w-full text-left border-0 bg-transparent px-4 py-2.5 text-sm text-red-600 font-semibold hover:bg-gray-50 cursor-pointer"
                                    >
                                        Log out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block no-underline px-4 py-2.5 text-sm font-bold text-gray-900 hover:bg-gray-50">Sign up</Link>
                                    <Link to="/login" className="block no-underline px-4 py-2.5 text-sm text-gray-600 font-medium hover:bg-gray-50">Log in</Link>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <Link to="/admin/login" className="block no-underline px-4 py-2.5 text-sm text-gray-600 font-medium hover:bg-gray-50">Host your home</Link>
                                    <Link to="#" className="block no-underline px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-50 cursor-not-allowed">Help Center</Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

            </div>
        </header>
    );
};

export default Header;