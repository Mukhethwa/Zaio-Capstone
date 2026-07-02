const { setServers } = require('node:dns/promises');
setServers(['1.1.1.1', '8.8.8.8']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static uploaded listing images cleanly from the root directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global Database Configuration Settings
mongoose.set('bufferCommands', false); 

// Database Connection to MongoDB Cloud/Local Instance
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('SUCCESS: Connected to MongoDB Cloud Database!'))
    .catch(err => console.error('CRITICAL: MongoDB Connection Failed:', err.message));

// Connection stream event listeners for runtime stability monitoring
mongoose.connection.on('error', err => {
    console.error('MONGODB RUNTIME ERROR DETECTED:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.warn('WARNING: MongoDB disconnected from cloud cluster.');
});

// Application API Endpoint Routes
app.use('/api/accommodations', require('./routes/accommodationRoutes')); 
app.use('/api/users', require('./routes/userRoutes')); 
app.use('/api/reservations', require('./routes/reservationRoutes')); 
app.use('/api/admin', require('./routes/adminRoutes'));

// ==========================================
// PRODUCTION CAPABILITY: Serve React Build Assets
// ==========================================
// Check if running in production (Heroku automatically provisions node paths)
if (process.env.NODE_ENV === 'production' || true) {
    // Tell Express to serve the static built production dashboard folder assets
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // For any wildcard route that isn't explicitly an API route, serve the index.html file
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

// Centralized Global Error Handling Interceptor Middleware
app.use((err, req, res, next) => {
    console.error("CRASH LOG DETECTED:", err.stack);
    res.status(500).json({ 
        error: \"Backend crashed internally!\", 
        message: err.message, 
        stack: err.stack 
    });
});

// Server Initialization Activation
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SERVER STATUS: Live on port block ${PORT}`));