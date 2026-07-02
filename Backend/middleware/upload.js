const multer = require('multer');
const path = require('path');

//Configure storage location and filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //Ensure this folder exists in backend root
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); //Unique filename
    }
});

const upload = multer({ storage: storage });

module.exports = upload;