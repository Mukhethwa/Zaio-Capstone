const express = require('express');
const router = express.Router();
const { 
    createReservation, 
    getHostReservations, 
    getUserReservations, 
    updateReservation,
    deleteReservation 
} = require('../controllers/reservationController');
const verifyToken = require('../middleware/auth'); 

//POST /api/reservations - Create a booking
router.post('/', verifyToken, createReservation);

//GET /api/reservations/user - Get logged-in traveler's bookings
router.get('/user', verifyToken, getUserReservations);

//GET /api/reservations/my-bookings - Dedicated alias endpoint for frontend tracking
router.get('/my-bookings', verifyToken, getUserReservations);

//GET /api/reservations/host - Get host's income analytics
router.get('/host', verifyToken, getHostReservations);

//PUT /api/reservations/:id - Update booking fields
router.put('/:id', verifyToken, updateReservation);

//DELETE /api/reservations/:id - Cancel a booking
router.delete('/:id', verifyToken, deleteReservation);

module.exports = router;