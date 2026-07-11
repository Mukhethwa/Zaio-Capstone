const Reservation = require('../models/Reservation');

//POST /api/reservations - Create a new property booking
const createReservation = async (req, res) => {
    try {
        const { accommodationId, hostId, checkInDate, checkOutDate, totalPrice } = req.body;
        
        if (!accommodationId || !hostId || !checkInDate || !checkOutDate || totalPrice === undefined) {
            return res.status(400).json({ message: 'Missing required reservation parameters' });
        }

        if (!accommodationId.match(/^[0-9a-fA-F]{24}$/) || !hostId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid accommodation or host ID syntax structure' });
        }

        const authenticatedUserId = req.user?.id || req.user?._id;
        if (!authenticatedUserId) {
            return res.status(401).json({ message: 'User authentication context is missing. Re-login.' });
        }
        
        const newReservation = new Reservation({
            accommodation: accommodationId,
            user: authenticatedUserId, 
            host: hostId,
            checkInDate,
            checkOutDate,
            totalPrice
        });

        const savedReservation = await newReservation.save();
        return res.status(201).json(savedReservation);
    } catch (error) {
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
            .populate('accommodation', 'title location image price'); // Fixed: Populate field keys clearly

        return res.status(200).json(reservations);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch user reservations', error: error.message });
    }
};

//PUT /api/reservations/:id - Edit an existing booking's parameters
const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { guests, checkInDate, checkOutDate } = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid reservation ID structure' });
        }

        const userId = req.user?.id || req.user?._id;

        //Build dynamic updating context body
        const updates = {};
        if (guests !== undefined) updates.guests = guests;
        if (checkInDate) updates.checkInDate = checkInDate;
        if (checkOutDate) updates.checkOutDate = checkOutDate;

        const updatedReservation = await Reservation.findOneAndUpdate(
            { _id: id, user: userId }, 
            { $set: updates },
            { new: true }
        ).populate('accommodation', 'title location image price');

        if (!updatedReservation) {
            return res.status(404).json({ message: 'Reservation not found or unauthorized access' });
        }

        return res.status(200).json(updatedReservation);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update reservation', error: error.message });
    }
};

//DELETE /api/reservations/:id - Cancel a booking record
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
    updateReservation,
    deleteReservation
};