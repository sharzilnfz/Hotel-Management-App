import Event from "../../models/events/event.model.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../../uploads/events");
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

// Helper functions for parsing form data
const safeParseJSON = (jsonString, defaultValue = []) => {
    try {
        return jsonString ? JSON.parse(jsonString) : defaultValue;
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return defaultValue;
    }
};

const parseBoolean = (value) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return false;
};

// Create a new event
export const createEvent = async (req, res) => {
    try {
        // Log the incoming request
        console.log("=== Create Event: Incoming Request ===");
        console.log("Request Body:", req.body);
        console.log("Request Files:", req.files);

        // Handle file upload
        upload.array("images", 5)(req, res, async function (err) {
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

                // Get form data
                const formData = req.body;

                // Parse addons from form data
                let addons = [];
                if (formData.addons) {
                    addons = safeParseJSON(formData.addons, []);
                }

                // Create event data object
                const eventData = {
                    title: formData.title,
                    description: formData.description,
                    date: new Date(formData.date),
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    bookingDeadlineDate: new Date(formData.bookingDeadlineDate),
                    bookingDeadlineTime: formData.bookingDeadlineTime,
                    location: formData.location,
                    price: parseFloat(formData.price),
                    maxAttendees: parseInt(formData.maxAttendees),
                    isRefundable: parseBoolean(formData.isRefundable),
                    refundPolicy: formData.refundPolicy,
                    addons: addons,
                    images: req.files ? req.files.map(file => file.filename) : [],
                    publishWebsite: parseBoolean(formData.publishWebsite),
                    publishApp: parseBoolean(formData.publishApp),
                    active: parseBoolean(formData.active)
                };

                // Log final event data
                console.log("=== Final Event Data ===");
                console.log(eventData);

                // Create new event
                const event = new Event(eventData);
                await event.save();

                res.status(201).json({
                    success: true,
                    message: "Event created successfully",
                    data: event
                });
            } catch (error) {
                console.error("Error creating event:", error);
                res.status(500).json({
                    success: false,
                    message: "Error creating event",
                    error: error.message
                });
            }
        });
    } catch (error) {
        console.error("Error in createEvent:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all events
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch events",
            error: error.message
        });
    }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }
        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch event",
            error: error.message
        });
    }
};

// Update an event
export const updateEvent = async (req, res) => {
    try {
        // First find the event to get its current image information
        const existingEvent = await Event.findById(req.params.id);
        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Handle file upload
        upload.array("images", 5)(req, res, async function (err) {
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
                    existingImages = safeParseJSON(formData.existingImages, []);
                }

                // Find images to delete (images in existingEvent.images but not in existingImages)
                const imagesToDelete = existingEvent.images.filter(
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

                // Prepare the final images array (keeping existing images and adding new ones)
                const finalImages = [
                    ...existingImages,
                    ...(req.files ? req.files.map(file => file.filename) : [])
                ];

                // Parse addons from form data
                let addons = [];
                if (formData.addons) {
                    addons = safeParseJSON(formData.addons, []);
                }

                // Create updated event data
                const updatedEventData = {
                    title: formData.title,
                    description: formData.description,
                    date: new Date(formData.date),
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    bookingDeadlineDate: new Date(formData.bookingDeadlineDate),
                    bookingDeadlineTime: formData.bookingDeadlineTime,
                    location: formData.location,
                    price: parseFloat(formData.price),
                    maxAttendees: parseInt(formData.maxAttendees),
                    isRefundable: parseBoolean(formData.isRefundable),
                    refundPolicy: formData.refundPolicy,
                    addons: addons,
                    images: finalImages,
                    publishWebsite: parseBoolean(formData.publishWebsite),
                    publishApp: parseBoolean(formData.publishApp),
                    active: parseBoolean(formData.active)
                };

                // Update the event
                const updatedEvent = await Event.findByIdAndUpdate(
                    req.params.id,
                    updatedEventData,
                    { new: true, runValidators: true }
                );

                res.status(200).json({
                    success: true,
                    message: "Event updated successfully",
                    data: updatedEvent
                });
            } catch (error) {
                console.error("Error updating event:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to update event",
                    error: error.message
                });
            }
        });
    } catch (error) {
        console.error("Error in updateEvent:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete an event
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Delete associated images
        if (event.images && event.images.length > 0) {
            event.images.forEach(imageName => {
                const imagePath = path.join(uploadDir, imageName);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log("Deleted image:", imagePath);
                }
            });
        }

        // Delete the event
        await Event.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete event",
            error: error.message
        });
    }
};

// Update event status
export const updateEventStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["upcoming", "ongoing", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event status updated successfully",
            data: event
        });
    } catch (error) {
        console.error("Error updating event status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update event status",
            error: error.message
        });
    }
};

// Get upcoming events
export const getUpcomingEvents = async (req, res) => {
    try {
        const currentDate = new Date();

        const events = await Event.find({
            date: { $gte: currentDate },
            status: "upcoming",
            active: true
        }).sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch upcoming events",
            error: error.message
        });
    }
}; 