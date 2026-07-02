const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    //Typically sent in the format: "Bearer <token>"
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        //Verify token using the secret key from your .env file
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; //Attach the decoded user payload to the request
        next(); //Pass control to the next middleware or controller
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = verifyToken;