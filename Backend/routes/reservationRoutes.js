//routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const { 
    createReservation, 
    getHostReservations, 
    getUserReservations, 
    deleteReservation 
} = require('../controllers/reservationController');
const verifyToken = require('../middleware/auth'); //Protect bookings with JWT

//POST /api/reservations - Create a booking (Requires logged-in user)
router.post('/', verifyToken, createReservation);

//GET /api/reservations/user - Get logged-in traveler's bookings
router.get('/user', verifyToken, getUserReservations);

//GET /api/reservations/host - Get bookings made on a host's properties
router.get('/host', verifyToken, getHostReservations);

//DELETE /api/reservations/:id - Cancel a booking
router.delete('/:id', verifyToken, deleteReservation);

module.exports = router;