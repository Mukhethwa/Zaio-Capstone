import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newGuests, setNewGuests] = useState(1);
  const [newCheckIn, setNewCheckIn] = useState('');
  const [newCheckOut, setNewCheckOut] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  //Fetch the logged-in guest's bookings
  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/reservations/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load reservations", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  //Update a booking's details (Guests, Check-In, and Check-Out Dates)
  const handleUpdateBooking = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/reservations/${id}`, { 
        guests: newGuests,
        checkInDate: newCheckIn,
        checkOutDate: newCheckOut
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Reservation updated successfully!');
      setEditingId(null);
      fetchMyBookings(); 
    } catch (err) {
      setMessage('Failed to update reservation.');
    }
  };

  //Cancel/Delete a booking completely
  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Reservation cancelled successfully.');
      fetchMyBookings();
    } catch (err) {
      setMessage('Failed to cancel reservation.');
    }
  };

  //Format MongoDB date strings to human-readable format
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  //Format ISO string to HTML Input format (YYYY-MM-DD)
  const formatInputDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans text-gray-900 min-h-[70vh]">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">My Bookings</h2>
      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
          {message}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
        </div>
      ) : reservations.length === 0 ? (
        <p className="text-gray-500 bg-gray-50 p-8 rounded-xl text-center border border-gray-100">
          You haven't made any reservations yet.
        </p>
      ) : (
        <div className="space-y-6">
          {reservations.map((res) => (
            <div key={res._id} className="border border-gray-200 rounded-2xl p-5 shadow-sm bg-white flex flex-col md:flex-row gap-5 items-start">
              
              {/* Optional Property Image block */}
              <div className="w-full md:w-48 aspect-square rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                <img 
                  src={res.accommodation?.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'} 
                  alt={res.accommodation?.title || 'Accommodation'} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Booking Info Fields */}
              <div className="flex-grow w-full">
                <h3 className="font-bold text-xl text-gray-900 mb-1">
                  {res.accommodation?.title || 'Accommodation Listing'}
                </h3>
                <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                  <span className="font-medium text-gray-700">Location:</span> {res.accommodation?.location || 'Not Specified'}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100/60">
                  <p className="text-gray-600"><span className="font-semibold text-gray-800">Check-in:</span> {formatDate(res.checkInDate)}</p>
                  <p className="text-gray-600"><span className="font-semibold text-gray-800">Check-out:</span> {formatDate(res.checkOutDate)}</p>
                  <p className="text-gray-600"><span className="font-semibold text-gray-800">Guests:</span> {res.guests || 1}</p>
                  <p className="text-gray-600"><span className="font-semibold text-gray-800">Total Paid:</span> R{res.totalPrice || 0}</p>
                </div>
                
                {editingId === res._id ? (
                  <div className="mt-4 p-4 border border-gray-200 bg-gray-50/50 rounded-xl space-y-3">
                    <h4 className="font-semibold text-sm text-gray-800">Modify Your Stay Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">Guests</label>
                        <input 
                          type="number" 
                          value={newGuests} 
                          onChange={(e) => setNewGuests(parseInt(e.target.value) || 1)} 
                          className="border border-gray-300 rounded-lg px-3 py-1.5 w-full text-sm bg-white"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">Check-In Date</label>
                        <input 
                          type="date" 
                          value={newCheckIn} 
                          onChange={(e) => setNewCheckIn(e.target.value)} 
                          className="border border-gray-300 rounded-lg px-3 py-1.5 w-full text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">Check-Out Date</label>
                        <input 
                          type="date" 
                          value={newCheckOut} 
                          onChange={(e) => setNewCheckOut(e.target.value)} 
                          className="border border-gray-300 rounded-lg px-3 py-1.5 w-full text-sm bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button onClick={() => handleUpdateBooking(res._id)} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-sm">Save Changes</button>
                      <button onClick={() => setEditingId(null)} className="bg-gray-400 hover:bg-gray-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button 
                      onClick={() => { 
                        setEditingId(res._id); 
                        setNewGuests(res.guests || 1);
                        setNewCheckIn(formatInputDate(res.checkInDate));
                        setNewCheckOut(formatInputDate(res.checkOutDate));
                      }} 
                      className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
                    >
                      Change Details
                    </button>
                    <button 
                      onClick={() => handleCancelBooking(res._id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl transition"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservations;