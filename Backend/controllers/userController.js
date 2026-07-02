const User = require('../models/User');
const jwt = require('jsonwebtoken');

//POST /api/users/register - Register a new user/admin account
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        //1. Validation check
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please enter all required fields' });
        }

        //2. Check if user already exists by email or username
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        //3. Create user (keeping plain-text comparison matching your login flow setup)
        const newUser = new User({
            username,
            email,
            password, 
            role: role || 'user' //Default to standard user if role is not supplied
        });

        const savedUser = await newUser.save();

        //4. Generate token immediately after registration
        const token = jwt.sign(
            { id: savedUser._id, role: savedUser.role, username: savedUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

//POST /api/users/login - Multi-identifier adaptive login handler
const loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //1. Check if user exists using flexible lookup (handles username or email payload items)
        const lookupIdentifier = username || email;
        if (!lookupIdentifier) {
            return res.status(400).json({ message: 'Please provide username or email' });
        }

        const user = await User.findOne({
            $or: [{ username: lookupIdentifier }, { email: lookupIdentifier }]
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username/email or password' });
        }

        //2. Validate password (plain text comparison matches setup model)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid username/email or password' });
        }

        //3. Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { username: user.username, role: user.role }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

module.exports = { 
    registerUser, 
    loginUser 
};