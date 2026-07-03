import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; //Styles for the bottom layout calendar
import Header from '../components/Header';

const LocationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [pricing] = useState({
        cleaningFee: 350,
        serviceFee: 150,
        occupancyTaxRate: 0.14, 
        weeklyDiscountRate: 0.10 
    });

    useEffect(() => {
        axios.get(`/api/accommodations/${id}`)
            .then(res => setListing(res.data))
            .catch(err => {
                console.error("API Fetch Error:", err);
                setError("Failed to load property details. Check if your backend server is running.");
            });
    }, [id]);

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const differenceInTime = end.getTime() - start.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        return differenceInDays > 0 ? differenceInDays : 0;
    };

    const totalNights = calculateNights();
    const baseTotal = totalNights * (listing?.price || 0);
    const weeklyDiscount = totalNights >= 7 ? baseTotal * pricing.weeklyDiscountRate : 0;
    const cleaningFee = totalNights > 0 ? pricing.cleaningFee : 0;
    const serviceFee = totalNights > 0 ? pricing.serviceFee : 0;
    const occupancyTax = totalNights > 0 ? (baseTotal - weeklyDiscount) * pricing.occupancyTaxRate : 0;
    const grandTotalPrice = baseTotal - weeklyDiscount + cleaningFee + serviceFee + occupancyTax;

    const handleReserve = async () => {
        setError('');
        setSuccess('');
        
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please sign in or register a traveler profile to book accommodations!');
            return;
        }

        if (totalNights <= 0) {
            setError('Please pick a valid check-out date that comes after your check-in date.');
            return;
        }

        try {
            const calculatedHostId = listing.host || listing.hostId || listing.host_id || "6a458846de49c20e25ad51d0";

            const payload = {
                accommodationId: id,
                hostId: typeof calculatedHostId === 'object' ? (calculatedHostId._id || calculatedHostId.id) : calculatedHostId,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                totalPrice: grandTotalPrice
            };

            const response = await axios.post('/api/reservations', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setSuccess('Booking Successful! Your trip is locked in.');
            setTimeout(() => navigate('/profile/bookings'), 2500);
        } catch (err) {
            console.error("Reservation execution failure:", err);
            const serverMessage = err.response?.data?.message || 'Failed to submit reservation request.';
            const detailedDbError = err.response?.data?.error ? ` (${err.response.data.error})` : '';
            setError(`${serverMessage}${detailedDbError}`);
        }
    };

    if (!listing && !error) return <div className="text-center py-20 text-gray-500 font-medium">Loading property profile details...</div>;

    const displayImages = listing?.images && listing.images.length >= 5 
        ? listing.images.slice(0, 5)
        : [
            listing?.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500'
        ];

    const currentCity = listing?.location?.split(',')[0] || 'Cape Town';

    return (
        <div className="min-h-screen bg-white pb-20 font-sans text-gray-900 selection:bg-rose-100">
            <Header />

            <div className="max-w-6xl mx-auto px-6 mt-6">
                {/* Title Section */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{listing?.title}</h1>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-900 mt-2 font-semibold">
                        <span className="flex items-center gap-1">
                            <svg viewBox="0 0 32 32" fill="currentColor" className="w-3.5 h-3.5 text-black"><path d="M16 1.333L20.424 10.3l9.909 1.439-7.171 6.99 1.693 9.87L16 23.95l-8.855 4.649 1.693-9.87-7.171-6.99 9.909-1.439z"/></svg>
                            4.92 · <span className="underline font-medium text-gray-600 cursor-pointer">48 Reviews</span>
                        </span>
                        <span className="text-gray-300 font-normal">·</span>
                        <span className="underline font-medium text-gray-600 cursor-pointer">{listing?.location}</span>
                    </div>
                </div>

                {/* Airbnb Photo Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden h-[300px] md:h-[420px] shadow-sm">
                    <div className="md:col-span-2 h-full overflow-hidden">
                        <img src={displayImages[0]} alt="Showcase Main" className="w-full h-full object-cover hover:scale-[1.01] transition duration-300 cursor-pointer"/>
                    </div>
                    <div className="hidden md:grid grid-cols-2 col-span-2 gap-2 h-full">
                        <img src={displayImages[1]} alt="Preview 1" className="w-full h-full object-cover hover:scale-[1.02] transition duration-200 cursor-pointer"/>
                        <img src={displayImages[2]} alt="Preview 2" className="w-full h-full object-cover hover:scale-[1.02] transition duration-200 cursor-pointer"/>
                        <img src={displayImages[3]} alt="Preview 3" className="w-full h-full object-cover hover:scale-[1.02] transition duration-200 cursor-pointer"/>
                        <img src={displayImages[4]} alt="Preview 4" className="w-full h-full object-cover hover:scale-[1.02] transition duration-200 cursor-pointer"/>
                    </div>
                </div>

                {/* Primary Content Structure Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10 items-start">
                    
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="border-b border-gray-200 pb-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{listing?.type || "Entire Rental Unit hosted by professional team"}</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {listing?.guests || 2} guests · {listing?.bedrooms || 1} bedroom · {listing?.bedrooms || 1} bed · {listing?.bathrooms || 1} bath
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gray-700 text-white font-bold flex items-center justify-center text-sm shadow-sm uppercase tracking-wider">
                                {listing?.hostName?.charAt(0) || "CP"}
                            </div>
                        </div>

                        {/* Feature Badges with clean inline SVGs instead of emojis */}
                        <div className="border-b border-gray-200 pb-6 space-y-5">
                            <div className="flex gap-4 items-start">
                                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-gray-800 mt-0.5">
                                    <path d="M26 30V14M6 30V4c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v26M18 16h2v2h-2z" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Self check-in</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Check yourself in effortlessly using the custom door smartlock access keypads.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-gray-800 mt-0.5">
                                    <path d="M28 28V14l-12-10L4 14v14h24zM13 28v-8h6v8" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Great location rating</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">95% of recent travelers rated this spot a perfect 5-star neighborhood location.</p>
                                </div>
                            </div>
                        </div>

                        {/* About Description Block */}
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">About this space</h3>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line font-light">
                                {listing?.description || "Welcome to this beautifully appointed vacation property setup, fully configured with absolute comfort layouts."}
                            </p>
                        </div>

                        {/* NEW: Where you'll sleep section Layout */}
                        <div className="border-b border-gray-200 pb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Where you'll sleep</h3>
                            <div className="border border-gray-200 rounded-xl p-6 w-full max-w-[240px] shadow-sm space-y-3">
                                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-800">
                                    <path d="M3 26V11c0-1.1.9-2 2-2h22c1.1 0 2 .9 2 2v15M3 16h26M6 9V5c0-.6.4-1 1-1h18c.6 0 1 .4 1 1v4M7 16v4c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-4M17 16v4c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-4" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Bedroom</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">1 Queen Bed / Orthopedic Mattress</p>
                                </div>
                            </div>
                        </div>

                        {/* Offers/Amenities with dynamic crisp SVG layout items */}
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">What this place offers</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                                <div className="flex items-center gap-3">
                                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-gray-600"><path d="M2 16h28M6 8h20M10 24h12"/></svg>
                                    <span>High-speed Wifi Fiber (100+ Mbps)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-gray-600"><path d="M26 4H6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM10 28h12M16 22v6"/></svg>
                                    <span>HD Smart TV with Netflix accounts</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-gray-600"><path d="M4 12h24v16H4zM10 12V6c0-1.7 1.3-3 3-3h6c1.7 0 3 1.3 3 3v6"/></svg>
                                    <span>Dedicated secure underground parking bay</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-gray-600"><path d="M30 10H2v14h28V10zM8 10V6M24 10V6"/></svg>
                                    <span>Air conditioning split-units</span>
                                </div>
                            </div>
                        </div>

                        {/* NEW: Bottom Integrated Calendar Horizon Screen Block */}
                        <div className="border-b border-gray-200 pb-8">
                            <div className="mb-2">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {totalNights > 0 ? `${totalNights} nights in ${currentCity}` : 'Select check-in date'}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">Available date scheduling matrices are synced in real-time</p>
                            </div>
                            <div className="inline-block border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-inner mt-2">
                                <DatePicker
                                    selected={checkIn ? new Date(checkIn) : null}
                                    onChange={(dates) => {
                                        const [start, end] = dates;
                                        if (start) setCheckIn(start.toISOString().split('T')[0]);
                                        if (end) setCheckOut(end.toISOString().split('T')[0]);
                                    }}
                                    startDate={checkIn ? new Date(checkIn) : null}
                                    endDate={checkOut ? new Date(checkOut) : null}
                                    selectsRange
                                    inline
                                    monthsShown={2}
                                    minDate={new Date()}
                                />
                            </div>
                        </div>

                        {/* NEW: Airbnb Grid Reviews Component section */}
                        <div className="border-b border-gray-200 pb-8 space-y-6">
                            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                <svg viewBox="0 0 32 32" fill="currentColor" className="w-4 h-4"><path d="M16 1.333L20.424 10.3l9.909 1.439-7.171 6.99 1.693 9.87L16 23.95l-8.855 4.649 1.693-9.87-7.171-6.99 9.909-1.439z"/></svg>
                                <span>4.92 · 48 reviews</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">M</div>
                                        <div>
                                            <h5 className="text-xs font-bold text-gray-900">Mukhethwa</h5>
                                            <p className="text-[10px] text-gray-400 font-medium">June 2026</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed font-light">Outstanding stay! The place was perfectly clean, fiber wifi was blazing fast for testing backend routes, and the balcony view of the mountain was unmatched.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">S</div>
                                        <div>
                                            <h5 className="text-xs font-bold text-gray-900">Dave Fortune</h5>
                                            <p className="text-[10px] text-gray-400 font-medium">May 2026</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed font-light">The location is incredibly central and the smartlock check-in was seamless. Everything matched the listing down to the exact metric.</p>
                                </div>
                            </div>
                        </div>

                        {/* NEW: Host Info Section Block */}
                        <div className="border-b border-gray-200 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-lg shadow-md uppercase">
                                    {listing?.hostName?.charAt(0) || "H"}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Hosted by {listing?.hostName || "Host Team Management"}</h3>
                                    <p className="text-xs text-gray-400 font-medium">Joined in January 2024 · Verified Profile</p>
                                </div>
                            </div>
                            <button className="border border-black hover:bg-gray-50 text-black font-bold text-xs py-2.5 px-5 rounded-lg transition active:scale-95 cursor-pointer">
                                Contact Host
                            </button>
                        </div>

                        {/* NEW: Things to Know 3-Column Footer Matrix Section */}
                        <div className="border-b border-gray-200 pb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Things to know</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                                <div className="space-y-2">
                                    <h5 className="font-bold text-gray-900">House rules</h5>
                                    <p className="text-gray-600 font-light">Check-in after 14:00 SAST</p>
                                    <p className="text-gray-600 font-light">Check-out before 10:00 SAST</p>
                                    <p className="text-gray-600 font-light">No smoking allowed inside units</p>
                                </div>
                                <div className="space-y-2">
                                    <h5 className="font-bold text-gray-900">Health & safety</h5>
                                    <p className="text-gray-600 font-light">Carbon monoxide alarm operational</p>
                                    <p className="text-gray-600 font-light">Smoke detector installed</p>
                                    <p className="text-gray-600 font-light">CCTV cameras operational in public zones</p>
                                </div>
                                <div className="space-y-2">
                                    <h5 className="font-bold text-gray-900">Cancellation policy</h5>
                                    <p className="text-gray-600 font-light">Free cancellation for up to 48 hours after booking validation window.</p>
                                    <p className="text-gray-500 font-light leading-relaxed mt-1">Review your full timeline before final checkout parameters execution.</p>
                                </div>
                            </div>
                        </div>

                        {/* NEW: Explore Other Options In Location */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Explore other options in and around {currentCity}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-gray-700">
                                <Link to="/locations" className="border border-gray-200 rounded-lg p-3 hover:border-black text-center no-underline text-gray-800 transition">Entire Homes</Link>
                                <Link to="/locations" className="border border-gray-200 rounded-lg p-3 hover:border-black text-center no-underline text-gray-800 transition">Luxury Apartments</Link>
                                <Link to="/locations" className="border border-gray-200 rounded-lg p-3 hover:border-black text-center no-underline text-gray-800 transition">Beachfront Penthouses</Link>
                                <Link to="/locations" className="border border-gray-200 rounded-lg p-3 hover:border-black text-center no-underline text-gray-800 transition">Cabins & Villas</Link>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sticky Side Booking Box Widget */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl sticky top-28 space-y-4">
                        <div className="flex justify-between items-baseline mb-2">
                            <div className="text-xl font-extrabold text-gray-900">R {listing?.price} <span className="text-sm font-normal text-gray-500">/ night</span></div>
                            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                <svg viewBox="0 0 32 32" fill="currentColor" className="w-3 h-3 text-black"><path d="M16 1.333L20.424 10.3l9.909 1.439-7.171 6.99 1.693 9.87L16 23.95l-8.855 4.649 1.693-9.87-7.171-6.99 9.909-1.439z"/></svg>
                                4.92
                            </span>
                        </div>

                        <div className="border border-gray-300 rounded-xl overflow-hidden divide-y divide-gray-300 text-xs">
                            <div className="grid grid-cols-2 divide-x divide-gray-300">
                                <div className="p-2.5">
                                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Check-In</label>
                                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-transparent focus:outline-none text-gray-600 font-medium cursor-pointer"/>
                                </div>
                                <div className="p-2.5">
                                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Check-Out</label>
                                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-transparent focus:outline-none text-gray-600 font-medium cursor-pointer"/>
                                </div>
                            </div>
                            <div className="p-2.5">
                                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Guests Tally</label>
                                <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full bg-transparent focus:outline-none font-medium text-gray-600 cursor-pointer">
                                    {[...Array(listing?.guests || 4).keys()].map(num => (
                                        <option key={num + 1} value={num + 1}>{num + 1} guest{num > 0 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button 
                            onClick={handleReserve}
                            className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm rounded-xl cursor-pointer hover:opacity-95 shadow-md active:scale-[0.99] transition duration-150"
                        >
                            Reserve Property Unit
                        </button>

                        <p className="text-center text-xs text-gray-500 font-medium">You won't be charged yet</p>

                        {totalNights > 0 && (
                            <div className="space-y-3 pt-3 border-t text-sm font-medium text-gray-600">
                                <div className="flex justify-between">
                                    <span className="underline">R {listing?.price} × {totalNights} night{totalNights > 1 ? 's' : ''}</span>
                                    <span>R {baseTotal}</span>
                                </div>
                                
                                {weeklyDiscount > 0 && (
                                    <div className="flex justify-between text-green-600 font-semibold">
                                        <span>Weekly 10% Stay Discount</span>
                                        <span>- R {weeklyDiscount}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="underline">Cleaning departure fee</span>
                                    <span>R {cleaningFee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="underline">Platform service fee</span>
                                    <span>R {serviceFee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="underline">Occupancy Taxes & VAT (14%)</span>
                                    <span>R {occupancyTax.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t">
                                    <span>Total due (ZAR)</span>
                                    <span>R {grandTotalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {error && <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border font-semibold mt-3 text-center">{error}</div>}
                        {success && <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg border font-semibold mt-3 text-center">{success}</div>}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LocationDetails;