import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import RestaurantSettings from '../../models/restaurant/restaurantSettings.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads/restaurant');
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'));
    }
  },
});

// Get restaurant settings
export const getRestaurantSettings = async (req, res) => {
  try {
    let settings = await RestaurantSettings.findOne();

    // If no settings exist, create default ones
    if (!settings) {
      settings = new RestaurantSettings({
        name: 'Parkside Restaurant',
        description: 'Fine dining experience with exceptional cuisine',
        headChef: 'Chef Rodriguez',
        cuisineType: 'International',
        openingHours: '6:00 AM - 11:00 PM',
        coverImage: '',
      });
      await settings.save();
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching restaurant settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant settings',
      error: error.message,
    });
  }
};

// Update restaurant settings
export const updateRestaurantSettings = async (req, res) => {
  try {
    // Log incoming request
    console.log('=== Restaurant Settings Update Request ===');
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);
    console.log('Request Content-Type:', req.get('Content-Type'));
    console.log('=== End Request ===');

    // Handle file upload
    upload.single('coverImage')(req, res, async function (err) {
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
        const { name, description, headChef, cuisineType, openingHours } =
          req.body;

        // Prepare update data
        const updateData = {
          name,
          description,
          headChef,
          cuisineType,
          openingHours,
        };

        // Add cover image if uploaded
        if (req.file) {
          updateData.coverImage = `/uploads/restaurant/${req.file.filename}`;
        }

        // Find existing settings or create new ones
        let settings = await RestaurantSettings.findOne();

        if (settings) {
          // Update existing settings
          Object.assign(settings, updateData);
          await settings.save();
        } else {
          // Create new settings
          settings = new RestaurantSettings(updateData);
          await settings.save();
        }

        res.status(200).json({
          success: true,
          message: 'Restaurant settings updated successfully',
          data: settings,
        });
      } catch (error) {
        console.error('Error updating restaurant settings:', error);
        res.status(500).json({
          success: false,
          message: 'Error updating restaurant settings',
          error: error.message,
        });
      }
    });
  } catch (error) {
    console.error('Error in updateRestaurantSettings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
