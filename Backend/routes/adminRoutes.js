const express = require('express');
const router = express.Router();

// 1. Directly require the model to prevent initialization race conditions
const Reservation = require('../models/Reservation'); 
const verifyToken = require('../middleware/auth'); // Require your existing auth middleware

//@desc    Get all guest bookings for the admin reservation overview matrix
//@route   GET /api/admin/reservations
//@access  Private/Admin
router.get('/reservations', verifyToken, async (req, res) => {
    try {
        const bookings = await Reservation.find({})
            .populate('user', 'username email') 
            .populate('accommodation', 'title location') 
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching administrative reservations:', error);
        res.status(500).json({ message: 'Internal server error pulling reservation rosters.' });
    }
});

//@desc    Administrative override to drop/revoke a booking reservation completely
//@route   DELETE /api/admin/reservations/:id
//@access  Private/Admin
router.delete('/reservations/:id', verifyToken, async (req, res) => {
    try {
        const booking = await Reservation.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Target reservation resource not found.' });
        }

        await booking.deleteOne();
        res.status(200).json({ message: 'Reservation cancelled and dropped successfully.' });
    } catch (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).json({ message: 'Server failed to process document deletion.' });
    }
});

module.exports = router;