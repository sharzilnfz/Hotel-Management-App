import MenuItem from "../../models/restaurant/menuItem.model.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../../uploads/restaurant");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error("Not an image! Please upload only images."));
        }
    }
});

// Helper function to process uploads with error handling
const handleUpload = (req, res, next) => {
    return new Promise((resolve, reject) => {
        upload.array('images', 5)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return reject({
                        status: 400,
                        message: 'File too large. Maximum size is 5MB'
                    });
                }
                return reject({
                    status: 400,
                    message: `Upload error: ${err.message}`
                });
            } else if (err) {
                // An unknown error occurred
                return reject({
                    status: 400,
                    message: err.message || 'Unknown error during file upload'
                });
            }
            // No error occurred, continue
            resolve(req.files);
        });
    });
};

// Create a new menu item
export const createMenuItem = async (req, res) => {
    try {
        // Handle file upload first
        try {
            await handleUpload(req, res);
        } catch (uploadError) {
            return res.status(uploadError.status).json({
                success: false,
                message: uploadError.message
            });
        }

        const { name, description, category, price, preparationTime, ingredients, available, extras } = req.body;

        // Validate required fields
        if (!name || !description || !category || !price || !preparationTime || !ingredients) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find category by name and get its ID
        const MenuCategory = (await import("../../models/restaurant/menuCategory.model.js")).default;
        const categoryDoc = await MenuCategory.findOne({ 
            name: { $regex: new RegExp(`^${category}$`, 'i') },
            isActive: true 
        });
        if (!categoryDoc) {
            return res.status(400).json({ message: "Category not found or inactive" });
        }

        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        // Process uploaded images - store relative paths for database
        const imagesPaths = req.files.map(file => `/uploads/restaurant/${path.basename(file.path)}`);

        // Parse extras if provided
        let parsedExtras = [];
        if (extras) {
            try {
                parsedExtras = JSON.parse(extras);
            } catch (error) {
                console.error("Error parsing extras:", error);
                return res.status(400).json({ message: "Invalid extras format" });
            }
        }

        // Create new menu item
        const newMenuItem = new MenuItem({
            name,
            description,
            category: categoryDoc._id, // Use the category ID from the found document
            price: parseFloat(price),
            preparationTime: parseInt(preparationTime),
            ingredients,
            available: available === "true" || available === true,
            extras: parsedExtras,
            images: imagesPaths
        });

        await newMenuItem.save();
        
        // Populate category for response
        await newMenuItem.populate('category', 'name description');

        res.status(201).json({
            success: true,
            data: newMenuItem,
            message: "Menu item created successfully"
        });
    } catch (error) {
        console.error("Error creating menu item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create menu item",
            error: error.message
        });
    }
};

// Get all menu items
export const getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find({}).populate('category', 'name description');

        res.status(200).json({
            success: true,
            count: menuItems.length,
            data: menuItems
        });
    } catch (error) {
        console.error("Error fetching menu items:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch menu items",
            error: error.message
        });
    }
};

// Get menu item by ID
export const getMenuItemById = async (req, res) => {
    try {
        const { id } = req.params;

        const menuItem = await MenuItem.findById(id).populate('category', 'name description');

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        console.error("Error fetching menu item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch menu item",
            error: error.message
        });
    }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the menu item first
        const menuItem = await MenuItem.findById(id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        // Handle file upload
        try {
            await handleUpload(req, res);
        } catch (uploadError) {
            return res.status(uploadError.status).json({
                success: false,
                message: uploadError.message
            });
        }

        const { name, description, category, price, preparationTime, ingredients, available, extras } = req.body;

        // Find category by name if provided
        let categoryDoc = null;
        if (category) {
            const MenuCategory = (await import("../../models/restaurant/menuCategory.model.js")).default;
            categoryDoc = await MenuCategory.findOne({ 
                name: { $regex: new RegExp(`^${category}$`, 'i') },
                isActive: true 
            });
            if (!categoryDoc) {
                return res.status(400).json({ message: "Category not found or inactive" });
            }
        }

        // Update fields
        menuItem.name = name || menuItem.name;
        menuItem.description = description || menuItem.description;
        menuItem.category = categoryDoc ? categoryDoc._id : menuItem.category; // Use category ID if found
        menuItem.price = price ? parseFloat(price) : menuItem.price;
        menuItem.preparationTime = preparationTime ? parseInt(preparationTime) : menuItem.preparationTime;
        menuItem.ingredients = ingredients || menuItem.ingredients;
        menuItem.available = available === undefined ? menuItem.available : (available === "true" || available === true);

        // Update extras if provided
        if (extras) {
            try {
                menuItem.extras = JSON.parse(extras);
            } catch (error) {
                console.error("Error parsing extras:", error);
                return res.status(400).json({ message: "Invalid extras format" });
            }
        }

        // Handle new images if uploaded
        if (req.files && req.files.length > 0) {
            // Delete old images from server
            menuItem.images.forEach(imagePath => {
                const fullPath = path.join(__dirname, "../..", imagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });

            // Add new images with relative paths
            const imagesPaths = req.files.map(file => `/uploads/restaurant/${path.basename(file.path)}`);
            menuItem.images = imagesPaths;
        }

        await menuItem.save();
        
        // Populate category for response
        await menuItem.populate('category', 'name description');

        res.status(200).json({
            success: true,
            data: menuItem,
            message: "Menu item updated successfully"
        });
    } catch (error) {
        console.error("Error updating menu item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update menu item",
            error: error.message
        });
    }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const menuItem = await MenuItem.findById(id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        // Delete images from server
        menuItem.images.forEach(imagePath => {
            const fullPath = path.join(__dirname, "../..", imagePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        });

        // Delete from database
        await MenuItem.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Menu item deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting menu item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete menu item",
            error: error.message
        });
    }
}; 