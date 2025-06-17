import HouseKeepingStaff from '../../models/house-keeping/staff.model.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage for staff avatar uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/staff';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'staff-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter for image files only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Initialize multer upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB limit
    }
}).single('avatar');

// Export the upload middleware
export const uploadStaffPhoto = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                status: 'error',
                message: `Upload error: ${err.message}`
            });
        } else if (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message
            });
        }
        next();
    });
};

// Get all staff
export const getAllStaff = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        // Filter by status if provided
        if (status) {
            query.status = status;
        }

        const staff = await HouseKeepingStaff.find(query).sort({ name: 1 });

        res.status(200).json({
            status: 'success',
            results: staff.length,
            data: {
                staff
            }
        });
    } catch (error) {
        console.error('Error getting staff:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get a single staff member
export const getStaff = async (req, res) => {
    try {
        const staff = await HouseKeepingStaff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                status: 'error',
                message: 'Staff member not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                staff
            }
        });
    } catch (error) {
        console.error('Error getting staff member:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Create a new staff member
export const createStaff = async (req, res) => {
    try {
        console.log('Create staff request received:', req.body);

        // Handle assignedAreas - parse it if it's a string
        if (req.body.assignedAreas && typeof req.body.assignedAreas === 'string') {
            try {
                req.body.assignedAreas = JSON.parse(req.body.assignedAreas);
                console.log("Parsed assignedAreas:", req.body.assignedAreas);
            } catch (e) {
                console.error("Error parsing assignedAreas:", e);
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid assignedAreas format'
                });
            }
        }

        // Add the avatar path if a file was uploaded
        if (req.file) {
            req.body.avatar = req.file.path;
            console.log('Avatar file uploaded:', req.file.path);
        }

        const newStaff = await HouseKeepingStaff.create(req.body);

        console.log('New staff member created:', newStaff);

        res.status(201).json({
            status: 'success',
            data: {
                staff: newStaff
            }
        });
    } catch (error) {
        console.error('Error creating staff member:', error);

        // Handle duplicate key error (email must be unique)
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'A staff member with this email already exists'
            });
        }

        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update a staff member
export const updateStaff = async (req, res) => {
    try {
        // Handle assignedAreas - parse it if it's a string
        if (req.body.assignedAreas && typeof req.body.assignedAreas === 'string') {
            try {
                req.body.assignedAreas = JSON.parse(req.body.assignedAreas);
                console.log("Parsed assignedAreas:", req.body.assignedAreas);
            } catch (e) {
                console.error("Error parsing assignedAreas:", e);
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid assignedAreas format'
                });
            }
        }

        // Add the avatar path if a file was uploaded
        if (req.file) {
            req.body.avatar = req.file.path;
            console.log('Avatar file updated:', req.file.path);
        }

        const updatedStaff = await HouseKeepingStaff.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedStaff) {
            return res.status(404).json({
                status: 'error',
                message: 'Staff member not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                staff: updatedStaff
            }
        });
    } catch (error) {
        console.error('Error updating staff member:', error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete a staff member
export const deleteStaff = async (req, res) => {
    try {
        const deletedStaff = await HouseKeepingStaff.findByIdAndDelete(req.params.id);

        if (!deletedStaff) {
            return res.status(404).json({
                status: 'error',
                message: 'Staff member not found'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        console.error('Error deleting staff member:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update staff performance rating
export const updatePerformance = async (req, res) => {
    try {
        const { rating } = req.body;

        if (rating === undefined || rating < 0 || rating > 5) {
            return res.status(400).json({
                status: 'error',
                message: 'Rating must be a number between 0 and 5'
            });
        }

        const staff = await HouseKeepingStaff.findByIdAndUpdate(
            req.params.id,
            { performanceRating: rating },
            { new: true, runValidators: true }
        );

        if (!staff) {
            return res.status(404).json({
                status: 'error',
                message: 'Staff not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                staff
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update task counts
export const updateTaskCounts = async (req, res) => {
    try {
        const { assigned, completed } = req.body;
        const updateData = {};

        if (assigned !== undefined) {
            updateData.totalTasksAssigned = assigned;
        }

        if (completed !== undefined) {
            updateData.totalTasksCompleted = completed;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'At least one of assigned or completed task count must be provided'
            });
        }

        const staff = await HouseKeepingStaff.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!staff) {
            return res.status(404).json({
                status: 'error',
                message: 'Staff not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                staff
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
}; 