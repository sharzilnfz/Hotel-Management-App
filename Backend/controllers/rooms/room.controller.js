import Room from "../../models/rooms/room.model.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
// Adjust path to be relative to project root where server.js serves static files from
const uploadDir = path.join(__dirname, "../../uploads/rooms");
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
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed."));
        }
    }
});

// Helper function to safely parse JSON
const safeParseJSON = (jsonString, defaultValue = {}) => {
    try {
        // Handle case where value might be an array of strings due to FormData issues
        if (Array.isArray(jsonString)) {
            // Try the first element if it's an array
            return JSON.parse(jsonString[0]);
        }
        return JSON.parse(jsonString);
    } catch (error) {
        console.error(`Error parsing JSON: ${error.message}`, jsonString);
        return defaultValue;
    }
};

// Create a new room
export const createRoom = async (req, res) => {
    try {
        // Log the incoming request
        console.log("=== Incoming Request ===");
        console.log("Request Headers:", req.headers);
        console.log("Request Body:", req.body);
        console.log("Request Files:", req.files);
        console.log("Request Content-Type:", req.get('Content-Type'));
        console.log("=== End Request ===");

        // Handle file upload
        upload.array("images", 10)(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.error("Multer Error:", err);
                return res.status(400).json({
                    success: false,
                    message: "File upload error",
                    error: err.message
                });
            } else if (err) {
                console.error("Upload Error:", err);
                return res.status(400).json({
                    success: false,
                    message: "Error uploading files",
                    error: err.message
                });
            }

            try {
                // Log the processed request
                console.log("=== Processed Request ===");
                console.log("Processed Body:", req.body);
                console.log("Processed Files:", req.files);
                console.log("=== End Processed Request ===");

                // Get form data
                const formData = req.body;
                console.log("Raw Form Data:", formData);

                // Parse extras from the form data
                let extras = [];
                try {
                    extras = safeParseJSON(formData.extras, []);
                } catch (error) {
                    console.error("Error parsing extras:", error);
                }

                // Create room data object
                const roomData = {
                    name: formData.name,
                    type: formData.type,
                    category: formData.category,
                    bedType: formData.bedType,
                    capacity: parseInt(formData.capacity),
                    price: parseFloat(formData.price),
                    totalRooms: parseInt(formData.totalRooms),
                    availableRooms: parseInt(formData.totalRooms), // Initial available rooms equals total
                    description: formData.description,
                    isRefundable: formData.isRefundable === 'true',
                    refundPolicy: formData.refundPolicy,
                    breakfastIncluded: formData.breakfastIncluded === 'true',
                    checkInTime: formData.checkInTime,
                    checkOutTime: formData.checkOutTime,
                    amenities: JSON.parse(formData.amenities || '[]'),
                    extras: extras,
                    payNow: formData.payNow === 'true',
                    payAtHotel: formData.payAtHotel === 'true',
                    discount: JSON.parse(formData.discount || '{}'),
                    cancellationPolicy: formData.cancellationPolicy,
                    publishWebsite: formData.publishWebsite === 'true',
                    publishApp: formData.publishApp === 'true',
                    active: formData.active === 'true',
                    images: req.files ? req.files.map(file => file.filename) : []
                };

                // Log final room data
                console.log("=== Final Room Data ===");
                console.log(roomData);
                console.log("=== End Final Data ===");

                // Create new room
                const room = new Room(roomData);
                await room.save();

                res.status(201).json({
                    success: true,
                    message: "Room created successfully",
                    data: room
                });
            } catch (error) {
                console.error("Error creating room:", error);
                res.status(500).json({
                    success: false,
                    message: "Error creating room",
                    error: error.message
                });
            }
        });
    } catch (error) {
        console.error("Error in createRoom:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all rooms
export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({
            success: true,
            data: rooms
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch rooms",
            error: error.message
        });
    }
};

// Get a single room by ID
export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }
        res.status(200).json({
            success: true,
            data: room
        });
    } catch (error) {
        console.error("Error fetching room:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch room",
            error: error.message
        });
    }
};

// Update a room
export const updateRoom = async (req, res) => {
    try {
        // First find the room to get its current image information
        const existingRoom = await Room.findById(req.params.id);
        if (!existingRoom) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        // Handle file upload
        upload.array("images", 10)(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.error("Multer Error:", err);
                return res.status(400).json({
                    success: false,
                    message: "File upload error",
                    error: err.message
                });
            } else if (err) {
                console.error("Upload Error:", err);
                return res.status(400).json({
                    success: false,
                    message: "Error uploading files",
                    error: err.message
                });
            }

            try {
                // Log request details
                console.log("Request files:", req.files);
                console.log("Request body:", req.body);

                // Get form data
                const formData = req.body;

                // Handle existing images
                let existingImages = [];
                if (formData.existingImages) {
                    try {
                        existingImages = JSON.parse(formData.existingImages);
                        console.log("Parsed existingImages:", existingImages);
                    } catch (error) {
                        console.error("Error parsing existingImages:", error);
                    }
                }

                // Find images to delete (images in existingRoom.images but not in existingImages)
                const imagesToDelete = existingRoom.images.filter(
                    img => !existingImages.includes(img)
                );

                console.log("Images to delete:", imagesToDelete);

                // Delete removed images
                if (imagesToDelete.length > 0) {
                    imagesToDelete.forEach(imageName => {
                        const imagePath = path.join(uploadDir, imageName);
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                            console.log("Deleted image:", imagePath);
                        }
                    });
                }

                // Prepare the final images array
                let finalImages = [...existingImages];

                // Add newly uploaded images
                if (req.files && req.files.length > 0) {
                    const newImageNames = req.files.map(file => file.filename);
                    finalImages = [...finalImages, ...newImageNames];
                }

                console.log("Final images array:", finalImages);

                // Helper to get single value from potential array
                const getSingleValue = (value, defaultVal) => {
                    if (Array.isArray(value)) return value[0];
                    return value || defaultVal;
                };

                // Helper to parse boolean values
                const parseBoolean = (value) => {
                    if (Array.isArray(value)) {
                        return value[0] === 'true';
                    }
                    return value === 'true';
                };

                // Parse extras from the form data
                let extras = [];
                try {
                    extras = safeParseJSON(formData.extras, []);
                    console.log("Parsed extras:", extras);
                } catch (error) {
                    console.error("Error parsing extras:", error);
                }

                // Create room data object
                const roomData = {
                    name: getSingleValue(formData.name, ''),
                    type: getSingleValue(formData.type, ''),
                    category: getSingleValue(formData.category, ''),
                    bedType: getSingleValue(formData.bedType, ''),
                    capacity: parseInt(getSingleValue(formData.capacity, 0)),
                    price: parseFloat(getSingleValue(formData.price, 0)),
                    totalRooms: parseInt(getSingleValue(formData.totalRooms, 0)),
                    availableRooms: parseInt(getSingleValue(formData.availableRooms, 0)) || parseInt(getSingleValue(formData.totalRooms, 0)),
                    description: getSingleValue(formData.description, ''),
                    isRefundable: parseBoolean(formData.isRefundable),
                    refundPolicy: getSingleValue(formData.refundPolicy, ''),
                    breakfastIncluded: parseBoolean(formData.breakfastIncluded),
                    checkInTime: getSingleValue(formData.checkInTime, ''),
                    checkOutTime: getSingleValue(formData.checkOutTime, ''),
                    amenities: safeParseJSON(formData.amenities, []),
                    extras: extras,
                    payNow: parseBoolean(formData.payNow),
                    payAtHotel: parseBoolean(formData.payAtHotel),
                    discount: safeParseJSON(formData.discount, {}),
                    cancellationPolicy: getSingleValue(formData.cancellationPolicy, ''),
                    publishWebsite: parseBoolean(formData.publishWebsite),
                    publishApp: parseBoolean(formData.publishApp),
                    active: parseBoolean(formData.active),
                    images: finalImages
                };

                // Log final room data
                console.log("=== Final Room Data ===");
                console.log(roomData);
                console.log("=== End Final Data ===");

                // Update room
                const updatedRoom = await Room.findByIdAndUpdate(
                    req.params.id,
                    roomData,
                    { new: true, runValidators: true }
                );

                if (!updatedRoom) {
                    return res.status(404).json({
                        success: false,
                        message: "Room not found"
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Room updated successfully",
                    data: updatedRoom
                });
            } catch (error) {
                console.error("Error updating room:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to update room",
                    error: error.message
                });
            }
        });
    } catch (error) {
        console.error("Error in updateRoom:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete a room
export const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        // Delete associated images from the uploads directory
        if (room.images && room.images.length > 0) {
            room.images.forEach(imageName => {
                const imagePath = path.join(uploadDir, imageName);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }

        // Delete the room from the database
        await Room.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Room deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete room",
            error: error.message
        });
    }
}; 