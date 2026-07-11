import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newGuests, setNewGuests] = useState(1);
  const [message, setMessage] = useState('');

  // Fetch the logged-in guest's bookings
  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/reservations/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data);
    } catch (err) {
      console.error("Failed to load reservations", err);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  // Update a booking's details (e.g., changing the number of guests)
  const handleUpdateBooking = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/reservations/${id}`, { guests: newGuests }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Reservation updated successfully!');
      setEditingId(null);
      fetchMyBookings(); // Refresh list
    } catch (err) {
      setMessage('Failed to update reservation.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans text-gray-900">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {message && <p className="text-blue-600 font-semibold mb-2">{message}</p>}
      
      {reservations.length === 0 ? (
        <p className="text-gray-500">You haven't made any reservations yet.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => (
            <div key={res._id} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
              <h3 className="font-bold text-lg">{res.accommodation_id?.title || 'Accommodation Listing'}</h3>
              <p className="text-sm text-gray-600">Location: {res.accommodation_id?.location}</p>
              <p className="text-sm text-gray-700 font-medium">Guests: {res.guests}</p>
              
              {editingId === res._id ? (
                <div className="mt-3 flex items-center gap-2">
                  <input 
                    type="number" 
                    value={newGuests} 
                    onChange={(e) => setNewGuests(e.target.value)} 
                    className="border border-gray-300 rounded px-2 py-1 w-20 text-sm"
                    min="1"
                  />
                  <button onClick={() => handleUpdateBooking(res._id)} className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded">Save</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white text-xs font-bold px-3 py-1.5 rounded">Cancel</button>
                </div>
              ) : (
                <button 
                  onClick={() => { setEditingId(res._id); setNewGuests(res.guests); }} 
                  className="mt-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
                >
                  Change Details
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservations;