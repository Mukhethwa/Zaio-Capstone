const Accommodation = require('../models/Accommodation');

//POST /api/accommodations - Create a new listing with flexible image support
const createAccommodation = async (req, res) => {
    try {
        //1. Check if files were uploaded via Multer middleware
        let imagePaths = req.files ? req.files.map(file => file.path) : [];

        //2. Fallback: If no files were uploaded, check if a text URL or array was passed in req.body
        if (imagePaths.length === 0) {
            if (req.body.images && Array.isArray(req.body.images)) {
                imagePaths = req.body.images;
            } else if (req.body.image) {
                imagePaths = [req.body.image];
            }
        }

        const newAccommodation = new Accommodation({
            ...req.body,
            images: imagePaths, //Map the paths or URLs to the images array in the model
            host_id: req.user?.id //Associate the listing with the logged-in admin from auth middleware
        });

        const savedAccommodation = await newAccommodation.save();
        return res.status(201).json(savedAccommodation);
    } catch (error) {
        return res.status(400).json({ message: 'Failed to create listing', error: error.message });
    }
};

//GET /api/accommodations - Get all listings safely
const getAccommodations = async (req, res) => {
    try {
        let accommodations = await Accommodation.find({});
        
        if (!accommodations) {
            return res.status(200).json([]);
        }

        try {
            accommodations = await Accommodation.find().populate({
                path: 'host_id',
                select: 'username',
                options: { strictPopulate: false }
            });
        } catch (populateError) {
            console.warn("Populate failed, returning unpopulated listings:", populateError.message);
            accommodations = await Accommodation.find({});
        }

        return res.status(200).json(accommodations);
    } catch (error) {
        console.error("🔥 DATABASE CRASH IN CONTROLLER:", error);
        return res.status(500).json({ 
            message: 'Failed to fetch listings inside the controller', 
            error: error.message
        });
    }
};

//GET /api/accommodations/:id - Get a specific listing safely
const getAccommodationById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid accommodation ID format structure' });
        }

        const accommodation = await Accommodation.findById(id);
        if (!accommodation) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        return res.status(200).json(accommodation);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving listing', error: error.message });
    }
};

//PUT /api/accommodations/:id - UPDATE an existing listing 
const updateAccommodation = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid accommodation ID format structure' });
        }

        //Clean up or format data if amenities come as a string from frontend
        let updatedData = { ...req.body };
        if (typeof updatedData.amenities === 'string') {
            updatedData.amenities = updatedData.amenities.split(',').map(item => item.trim());
        }

        //Handle image updates flexibly if a new direct text URL was supplied
        if (updatedData.image && (!updatedData.images || updatedData.images.length === 0)) {
            updatedData.images = [updatedData.image];
        }

        const updatedAccommodation = await Accommodation.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true } //Returns the newly updated object and validates inputs
        );

        if (!updatedAccommodation) {
            return res.status(404).json({ message: 'Listing not found to update' });
        }

        return res.status(200).json(updatedAccommodation);
    } catch (error) {
        return res.status(400).json({ message: 'Failed to update listing', error: error.message });
    }
};

//DELETE /api/accommodations/:id - Delete a listing
const deleteAccommodation = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid accommodation ID format structure' });
        }

        const deletedListing = await Accommodation.findByIdAndDelete(id);

        if (!deletedListing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        return res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to delete listing', error: error.message });
    }
};

module.exports = {
    createAccommodation,
    getAccommodations,
    getAccommodationById,
    updateAccommodation, //Exported the new update function
    deleteAccommodation
};