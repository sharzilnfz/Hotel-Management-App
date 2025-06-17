import Staff from '../../models/staff/staff.model.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const multerStorage = multer.memoryStorage();

// Filter files to ensure they are images
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadStaffPhoto = upload.single('photo');

// Resize and process uploaded photos
export const resizeStaffPhoto = async (req, res, next) => {
    try {
        if (!req.file) return next();

        const uploadDir = 'public/uploads/staff';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        req.file.filename = `staff-${Date.now()}.jpeg`;

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`${uploadDir}/${req.file.filename}`);

        req.body.photo = `/${uploadDir}/${req.file.filename}`;

        next();
    } catch (error) {
        next(error);
    }
};

// Get all staff members
export const getAllStaff = async (req, res, next) => {
    try {
        let query = Staff.find();

        // Filter by department if provided
        if (req.query.department) {
            query = query.find({ department: req.query.department });
        }

        // Filter by status if provided
        if (req.query.status) {
            query = query.find({ status: req.query.status });
        }

        // Filter by role if provided
        if (req.query.role) {
            query = query.find({ role: req.query.role });
        }

        const staff = await query;

        res.status(200).json({
            status: 'success',
            results: staff.length,
            data: {
                staff
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get a single staff member
export const getStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                status: 'fail',
                message: 'No staff member found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                staff
            }
        });
    } catch (error) {
        next(error);
    }
};

// Create a new staff member
export const createStaff = async (req, res, next) => {
    try {
        // Format startDate if provided
        if (req.body.startDate) {
            req.body.startDate = new Date(req.body.startDate);
        }

        const newStaff = await Staff.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                staff: newStaff
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update a staff member
export const updateStaff = async (req, res, next) => {
    try {
        console.log("Update request received for staff ID:", req.params.id);
        console.log("Request body:", req.body);

        // Find the staff member
        const staff = await Staff.findById(req.params.id);

        if (!staff) {
            console.log("Staff member not found with ID:", req.params.id);
            return res.status(404).json({
                status: 'fail',
                message: 'No staff member found with that ID'
            });
        }

        // Format startDate if provided
        if (req.body.startDate) {
            req.body.startDate = new Date(req.body.startDate);
        }

        // If a new photo is uploaded, remove the old one
        if (req.file && staff.photo && staff.photo !== 'default.jpg') {
            const oldPhotoPath = path.join(__dirname, '../../../', staff.photo.replace(/^\//, ''));
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }
        }

        // Update the staff member
        const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        console.log("Staff member updated successfully:", updatedStaff);

        res.status(200).json({
            status: 'success',
            data: {
                staff: updatedStaff
            }
        });
    } catch (error) {
        console.error("Error updating staff member:", error);
        next(error);
    }
};

// Delete a staff member
export const deleteStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                status: 'fail',
                message: 'No staff member found with that ID'
            });
        }

        // Delete photo if it exists and is not the default
        if (staff.photo && staff.photo !== 'default.jpg') {
            const photoPath = path.join(__dirname, '../../../', staff.photo.replace(/^\//, ''));
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        // Soft delete by setting active to false instead of actually removing
        await Staff.findByIdAndUpdate(req.params.id, { active: false });

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
}; 