const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    type: { type: String, required: true }, 
    location: { type: String, required: true }, 
    guests: { type: Number, required: true }, 
    bedrooms: { type: Number, required: true }, 
    bathrooms: { type: Number, required: true }, 
    amenities: [{ type: String }], 
    price: { type: Number, required: true }, 
    images: [{ type: String }], 
    host_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    weeklyDiscount: { type: Number, default: 0 }, 
    cleaningFee: { type: Number, default: 0 }, 
    serviceFee: { type: Number, default: 0 }, 
    occupancyTaxes: { type: Number, default: 0 },
    description: { type: String } 
});

module.exports = mongoose.model('Accommodation', accommodationSchema);