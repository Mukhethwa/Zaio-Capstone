import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const adminUsername = localStorage.getItem('username') || 'Jane Doe';

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/reservations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data);
    } catch (err) {
      //Gracefully handle missing backend endpoints by treating them as an empty list
      if (err.response && err.response.status === 404) {
          setReservations([]);
      } else {
          setError(err.response?.data?.message || 'Failed to retrieve reservations roster. Check backend routes.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (reservationId) => {
    if (!window.confirm('Are you absolute sure you want to cancel this guest booking reservation?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      setError('');
      setSuccess('');

      await axios.delete(`http://localhost:5000/api/admin/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Reservation revoked and dropped successfully.');
      setReservations(reservations.filter(res => res._id !== reservationId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel the specified booking.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans antialiased text-gray-900 text-left">
      
      {/* BRANDED NAV BAR SYSTEM */}
      <nav className="bg-white px-6 md:px-12 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm border-b border-gray-100">
        <Link to="/" className="flex items-center gap-1.5 text-rose-500 hover:opacity-90 transition no-underline">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-current">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.178a23.947 23.947 0 0 1-1.89-2.257l-.228-.3-.162-.224c-.134.183-.284.375-.45.575l-.337.391a24.52 24.52 0 0 1-1.786 1.918l-.248.243c-2.176 2.15-4.528 3.418-6.75 3.418-3.48 0-6.358-2.416-6.358-6.478 0-1.157.315-2.24 1.011-3.792l.135-.29c1.01-2.35 5.17-11.06 7.13-14.912l.514-.993C12.537 1.963 13.992 1 16 1zm0 2c-1.238 0-2.203.623-3.14 2.296l-.513.992c-1.95 3.834-6.096 12.518-7.1 14.854l-.137.293c-.63 1.407-.866 2.233-.905 2.923l-.005.234c0 2.902 1.94 4.478 4.358 4.478 1.636 0 3.52-1.022 5.347-2.833l.255-.257a22.51 22.51 0 0 0 1.98-2.15l.235-.286.205-.262-.224-.277c-1.39-1.74-2.274-3.77-2.617-5.918l-.053-.362-.016-.2c0-3.136 2.403-5.642 5.51-5.642 3.037 0 5.426 2.41 5.508 5.438l.002.204c0 2.254-.913 4.332-2.378 6.136l-.24.288.242.275c.618.694 1.253 1.374 1.905 2.034l.26.255c1.82 1.794 3.696 2.806 5.318 2.806 2.417 0 4.357-1.576 4.357-4.478 0-.622-.213-1.38-.79-2.76l-.152-.365c-.982-2.288-5.128-10.972-7.09-14.823l-.532-1.024C18.203 3.623 17.238 3 16 3zm0 9c-1.984 0-3.51 1.547-3.51 3.442 0 1.72 1.258 3.32 2.91 4.195l.31.15.29.117c.23.08.31.144.31.253 0 .144-.114.243-.364.243-.654 0-1.42-.486-2.12-1.385l-.17-.23-.284-.424-1.464.975.275.43c.966 1.455 2.258 2.308 3.763 2.308 1.474 0 2.374-.74 2.374-1.843 0-1.037-.624-1.7-1.924-2.18l-.29-.107-.31-.12c-.37-.156-.514-.373-.514-.64 0-.616.48-1.047 1.51-1.047.886 0 1.764.442 2.502 1.272l.19.227.228.293 1.442-.993-.243-.326c-.927-1.2-2.115-1.944-3.515-1.944z"></path>
          </svg>
          <span className="text-xl font-black tracking-tight hidden sm:inline-block">airbnb</span>
          <span className="text-xs font-semibold text-gray-400 tracking-wider ml-1 uppercase bg-gray-100 px-1.5 py-0.5 rounded">Host</span>
        </Link>

        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 border border-gray-200 p-2 pl-3.5 rounded-full hover:shadow-md transition bg-white cursor-pointer"
          >
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-gray-600">
              <line x1="5" y1="8" x2="27" y2="8" /><line x1="5" y1="16" x2="27" y2="16" /><line x1="5" y1="24" x2="27" y2="24" />
            </svg>
            <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700 hidden md:inline-block max-w-[120px] truncate">
                    {adminUsername}
                </span>
                <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                    alt="Admin Profile avatar" 
                    className="w-7 h-7 object-cover rounded-full bg-gray-200 shadow-inner"
                />
            </div>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                <Link to="/admin/listings" className="block px-4 py-2.5 text-xs text-gray-700 font-bold hover:bg-gray-50 no-underline">View My Listings</Link>
                <Link to="/admin/create-listing" className="block px-4 py-2.5 text-xs text-gray-700 font-bold hover:bg-gray-50 no-underline">Create Listing</Link>
                <hr className="border-gray-100 my-1" />
                <Link to="/" className="block px-4 py-2.5 text-xs text-rose-600 font-bold hover:bg-gray-50 no-underline">Log Out</Link>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* CONSISTENT ROUNDED OPTIONS NAVIGATION */}
      <header className="max-w-6xl mx-auto mt-6 px-6">
          <div className="flex flex-wrap items-center gap-2.5 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
              <Link 
                  to="/admin/reservations" 
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-rose-500 text-white border border-rose-500 hover:bg-rose-600 no-underline transition shadow-sm shadow-rose-100"
              >
                  View Reservations
              </Link>
              <Link 
                  to="/admin/listings" 
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gray-50 text-gray-700 border border-gray-200/60 hover:bg-gray-100 hover:text-black no-underline transition shadow-sm"
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

      {/* RESERVATIONS MANAGEMENT TABLE CONTAINER */}
      <main className="max-w-6xl mx-auto mt-8 px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-gray-900">My Reservations</h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Manage live property guest bookings across your accommodation ecosystem catalog.</p>
        </div>

        {error && <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl mb-6 text-xs font-medium">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl mb-6 text-xs font-medium">{success}</div>}

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-xs font-medium text-gray-400">Loading catalog configurations...</div>
          ) : reservations.length === 0 ? (
            <div className="p-12 text-center text-xs font-medium text-gray-500">No client booking reservations registered in your scope directory.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    <th className="py-4 px-6">Booked By</th>
                    <th className="py-4 px-6">Property Name</th>
                    <th className="py-4 px-6">Check-in Date</th>
                    <th className="py-4 px-6">Check-out Date</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {reservations.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        {booking.user?.username || booking.user?.name || booking.guestName || 'Registered Client User'}
                        <span className="block text-[10px] text-gray-400 font-normal mt-0.5">{booking.user?.email || 'N/A'}</span>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-700">
                        {booking.accommodation?.title || booking.propertyName || 'Unknown Stay Accomodation'}
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-mono">
                        {new Date(booking.checkIn || booking.checkInDate).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-mono">
                        {new Date(booking.checkOut || booking.checkOutDate).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(booking._id)}
                          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-1.5 px-4 rounded-xl text-[11px] transition shadow-sm cursor-pointer active:scale-95 inline-block"
                        >
                          Cancel Booking
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminReservations;