const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    accommodation: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Accommodation', 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true //The guest making the booking
    },
    host: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true //The owner of the property
    },
    checkInDate: { 
        type: Date, 
        required: true 
    },
    checkOutDate: { 
        type: Date, 
        required: true 
    },
    totalPrice: { 
        type: Number, 
        required: true 
    }
}, { timestamps: true });

//Corrected Synchronous Pre-Validate Hook for Modern Mongoose
reservationSchema.pre('validate', function() {
    if (this.checkInDate && this.checkOutDate) {
        if (this.checkOutDate <= this.checkInDate) {
            this.invalidate('checkOutDate', 'Check-out date must be after the check-in date.');
        }
    }
    //No next() call needed here anymore!
});

module.exports = mongoose.model('Reservation', reservationSchema);