const Reservation = require('../models/Reservation');

//POST /api/reservations - Create a new property booking
const createReservation = async (req, res) => {
    try {
        const { accommodationId, hostId, checkInDate, checkOutDate, totalPrice } = req.body;
        
        //Input presence validation
        if (!accommodationId || !hostId || !checkInDate || !checkOutDate || totalPrice === undefined) {
            return res.status(400).json({ message: 'Missing required reservation parameters' });
        }

        //Validate hex string lengths to prevent Mongoose CastErrors
        if (!accommodationId.match(/^[0-9a-fA-F]{24}$/) || !hostId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid accommodation or host ID syntax structure' });
        }

        //Safety fallback check for authenticated user payload context
        const authenticatedUserId = req.user?.id || req.user?._id;
        if (!authenticatedUserId) {
            return res.status(401).json({ message: 'User authentication context is missing. Re-login.' });
        }
        
        const newReservation = new Reservation({
            accommodation: accommodationId,
            user: authenticatedUserId, //Dynamically maps both token variants safely
            host: hostId,
            checkInDate,
            checkOutDate,
            totalPrice
        });

        const savedReservation = await newReservation.save();
        return res.status(201).json(savedReservation);
    } catch (error) {
        //Appends the raw error message so the frontend knows EXACTLY why MongoDB rejected it
        return res.status(400).json({ 
            message: 'Failed to create reservation', 
            error: error.message 
        });
    }
};

//GET /api/reservations/host - View reservations booked against a host's properties
const getHostReservations = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const reservations = await Reservation.find({ host: userId })
            .populate('accommodation', 'title location price') 
            .populate('user', 'username email'); 

        return res.status(200).json(reservations);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch host reservations', error: error.message });
    }
};

//GET /api/reservations/user - View bookings placed by the current logged-in traveler
const getUserReservations = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const reservations = await Reservation.find({ user: userId })
            .populate('accommodation', 'title location images price');

        return res.status(200).json(reservations);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch user reservations', error: error.message });
    }
};

//DELETE /api/reservations/:id - Evict/Cancel a booking record
const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid reservation ID structure' });
        }

        const deletedReservation = await Reservation.findByIdAndDelete(id);

        if (!deletedReservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        return res.status(200).json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to cancel reservation', error: error.message });
    }
};

module.exports = {
    createReservation,
    getHostReservations,
    getUserReservations,
    deleteReservation
};