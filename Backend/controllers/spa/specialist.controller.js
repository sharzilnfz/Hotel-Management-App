import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Specialist from '../../models/spa/specialist.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads/specialists');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'));
    }
  },
});

// Create a new specialist
export const createSpecialist = async (req, res) => {
  try {
    // Log the incoming request
    console.log('=== Incoming Specialist Request ===');
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);
    console.log('Request Content-Type:', req.get('Content-Type'));
    console.log('=== End Request ===');

    // Handle file upload
    upload.single('photo')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error('Multer Error:', err);
        return res.status(400).json({
          success: false,
          message: 'File upload error',
          error: err.message,
        });
      } else if (err) {
        console.error('Upload Error:', err);
        return res.status(400).json({
          success: false,
          message: 'Error uploading files',
          error: err.message,
        });
      }

      try {
        // Get form data
        const formData = req.body;

        // Parse specializations if it's a string
        let specializations = formData.specializations;
        if (typeof specializations === 'string') {
          try {
            specializations = JSON.parse(specializations);
          } catch (error) {
            console.error('Error parsing specializations:', error);
            specializations = [];
          }
        }

        // Create specialist data object
        const specialistData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          nationality: formData.nationality,
          experienceYears: formData.experienceYears,
          status: formData.status || 'active',
          languages: formData.languages,
          specializations: specializations || [],
          photo: req.file ? req.file.filename : req.body.photo,
        };

        // Log final specialist data
        console.log('=== Final Specialist Data ===');
        console.log(specialistData);
        console.log('=== End Final Data ===');

        // Create new specialist
        const specialist = new Specialist(specialistData);
        await specialist.save();

        res.status(201).json({
          success: true,
          message: 'Specialist created successfully',
          data: specialist,
        });
      } catch (error) {
        console.error('Error creating specialist:', error);
        res.status(500).json({
          success: false,
          message: 'Error creating specialist',
          error: error.message,
        });
      }
    });
  } catch (error) {
    console.error('Error in createSpecialist:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get all specialists
export const getAllSpecialists = async (req, res) => {
  try {
    const specialists = await Specialist.find();
    res.status(200).json({
      success: true,
      data: specialists,
    });
  } catch (error) {
    console.error('Error fetching specialists:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch specialists',
      error: error.message,
    });
  }
};

// Get a single specialist by ID
export const getSpecialistById = async (req, res) => {
  try {
    const specialist = await Specialist.findById(req.params.id);
    if (!specialist) {
      return res.status(404).json({
        success: false,
        message: 'Specialist not found',
      });
    }
    res.status(200).json({
      success: true,
      data: specialist,
    });
  } catch (error) {
    console.error('Error fetching specialist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch specialist',
      error: error.message,
    });
  }
};

// Update a specialist
export const updateSpecialist = async (req, res) => {
  try {
    // First find the specialist to get its current photo information
    const existingSpecialist = await Specialist.findById(req.params.id);
    if (!existingSpecialist) {
      return res.status(404).json({
        success: false,
        message: 'Specialist not found',
      });
    }

    // Handle file upload
    upload.single('photo')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error('Multer Error:', err);
        return res.status(400).json({
          success: false,
          message: 'File upload error',
          error: err.message,
        });
      } else if (err) {
        console.error('Upload Error:', err);
        return res.status(400).json({
          success: false,
          message: 'Error uploading files',
          error: err.message,
        });
      }

      try {
        // Get form data
        const formData = req.body;

        // Parse specializations if it's a string
        let specializations = formData.specializations;
        if (typeof specializations === 'string') {
          try {
            specializations = JSON.parse(specializations);
          } catch (error) {
            console.error('Error parsing specializations:', error);
            specializations = existingSpecialist.specializations;
          }
        }

        // Prepare updated data
        const updatedData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          nationality: formData.nationality,
          experienceYears: formData.experienceYears,
          status: formData.status,
          languages: formData.languages,
          specializations: specializations,
        };

        // Update photo only if a new one is uploaded
        if (req.file) {
          // Delete old photo if it exists
          if (existingSpecialist.photo) {
            const oldPhotoPath = path.join(uploadDir, existingSpecialist.photo);
            if (fs.existsSync(oldPhotoPath)) {
              fs.unlinkSync(oldPhotoPath);
            }
          }
          updatedData.photo = req.file.filename;
        }

        // Update specialist
        const updatedSpecialist = await Specialist.findByIdAndUpdate(
          req.params.id,
          updatedData,
          { new: true, runValidators: true }
        );

        res.status(200).json({
          success: true,
          message: 'Specialist updated successfully',
          data: updatedSpecialist,
        });
      } catch (error) {
        console.error('Error updating specialist:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to update specialist',
          error: error.message,
        });
      }
    });
  } catch (error) {
    console.error('Error in updateSpecialist:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Delete a specialist
export const deleteSpecialist = async (req, res) => {
  try {
    const specialist = await Specialist.findById(req.params.id);

    if (!specialist) {
      return res.status(404).json({
        success: false,
        message: 'Specialist not found',
      });
    }

    // Delete associated photo from the uploads directory
    if (specialist.photo) {
      const photoPath = path.join(uploadDir, specialist.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // Delete the specialist from the database
    await Specialist.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Specialist deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting specialist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete specialist',
      error: error.message,
    });
  }
};
