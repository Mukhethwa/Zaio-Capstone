const express = require('express');
const router = express.Router();
//Import user controller functions
const userController = require('../controllers/userController');

//Ensure this explicitly maps to registration controller function
//When combined with /api/users in server.js, this creates: POST /api/users/register
router.post('/register', userController.registerUser);

//Ensure this explicitly maps to login controller function
//When combined with /api/users in server.js, this creates: POST /api/users/login
router.post('/login', userController.loginUser);

module.exports = router;