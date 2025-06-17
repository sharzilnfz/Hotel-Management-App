import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {
    getAllContent,
    getHomePageContent,
    updateHomePageContent,
    getRoomsPageContent,
    updateRoomsPageContent,
    getSpaPageContent,
    updateSpaPageContent,
    getRestaurantPageContent,
    updateRestaurantPageContent,
    getEventsPageContent,
    updateEventsPageContent,
    getMeetingHallPageContent,
    updateMeetingHallPageContent,
    getNavigationContent,
    updateNavigationContent,
    getFooterContent,
    updateFooterContent,
    getAboutPageContent,
    updateAboutPageContent,
    uploadContentImage
} from '../../controllers/content/content.controller.js';
// import { upload } from '../../middleware/upload.middleware.js';

const router = express.Router();

// Setup file upload
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'content');

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadMulter = multer({
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

// Configure multer for PDF upload
const storagePDF = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'menu-pdf-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadPDF = multer({
    storage: storagePDF,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit for PDFs
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only PDF files are allowed."));
        }
    }
});

// Get all content
router.get('/', getAllContent);

// Home page content routes
router.get('/home', getHomePageContent);
router.put('/home', updateHomePageContent);

// Rooms page content routes
router.get('/rooms', getRoomsPageContent);
router.put('/rooms', updateRoomsPageContent);

// Spa page content routes
router.get('/spa', getSpaPageContent);
router.put('/spa', updateSpaPageContent);

// Restaurant page content routes
router.get('/restaurant', getRestaurantPageContent);
router.put('/restaurant', updateRestaurantPageContent);

// Restaurant menu PDF upload route
router.post('/restaurant/menu-pdf', uploadPDF.single('pdf'), async (req, res) => {
    try {
        console.log('===== UPLOAD RESTAURANT MENU PDF =====');

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No PDF file uploaded'
            });
        }

        // Get the uploaded file URL
        const fileUrl = `/uploads/content/${req.file.filename}`;
        console.log('Restaurant menu PDF URL:', fileUrl);

        // Update the restaurant page content with the new menu PDF
        const { RestaurantPage } = await import('../../models/content/content.model.js');
        
        let restaurantContent = await RestaurantPage.findOne();
        if (!restaurantContent) {
            restaurantContent = await RestaurantPage.create({
                menuItemsPDF: fileUrl
            });
        } else {
            restaurantContent.menuItemsPDF = fileUrl;
            restaurantContent.lastUpdated = new Date();
            await restaurantContent.save();
        }

        res.status(200).json({
            success: true,
            message: 'Restaurant menu PDF uploaded and updated successfully',
            data: {
                url: fileUrl,
                restaurantContent: restaurantContent
            }
        });
    } catch (error) {
        console.error('ERROR in restaurant menu PDF upload:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload restaurant menu PDF',
            error: error.message
        });
    }
});

// Events page content routes
router.get('/events', getEventsPageContent);
router.put('/events', updateEventsPageContent);

// Meeting Hall page content routes
router.get('/meeting-hall', getMeetingHallPageContent);
router.put('/meeting-hall', updateMeetingHallPageContent);

// Navigation content routes
router.get('/navigation', getNavigationContent);
router.put('/navigation', updateNavigationContent);

// Footer content routes
router.get('/footer', getFooterContent);
router.put('/footer', updateFooterContent);

// About page content routes
router.get('/about', getAboutPageContent);
router.put('/about', updateAboutPageContent);

// Debug route for rooms content
router.get('/debug/rooms', async (req, res) => {
    try {
        console.log('===== DEBUG ROOMS CONTENT =====');
        
        // Import the model
        const { RoomsPage } = await import('../../models/content/content.model.js');
        
        // Check if document exists
        const existingDoc = await RoomsPage.findOne();
        console.log('Existing rooms document:', existingDoc);
        
        // If no document exists, create one with explicit defaults
        if (!existingDoc) {
            console.log('No rooms document found, creating new one...');
            const newDoc = await RoomsPage.create({
                header: {
                    title: "Luxurious Rooms & Suites",
                    description: "Experience the ultimate in comfort and luxury with our selection of elegantly designed rooms and suites, each offering unique amenities to enhance your stay."
                },
                coverImage: "",
                categories: []
            });
            console.log('New rooms document created:', newDoc);
            
            res.status(200).json({
                success: true,
                message: 'Rooms document created successfully',
                data: newDoc,
                debug: {
                    created: true,
                    modelName: RoomsPage.modelName
                }
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Rooms document already exists',
                data: existingDoc,
                debug: {
                    created: false,
                    modelName: RoomsPage.modelName
                }
            });
        }
    } catch (error) {
        console.error('ERROR in debug rooms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to debug rooms content',
            error: error.message
        });
    }
});

// Fix route to correct rooms content structure
router.post('/fix/rooms', async (req, res) => {
    try {
        console.log('===== FIX ROOMS CONTENT STRUCTURE =====');
        
        // Import the model
        const { RoomsPage } = await import('../../models/content/content.model.js');
        
        // Find the existing document
        const existingDoc = await RoomsPage.findOne();
        console.log('Current rooms document:', JSON.stringify(existingDoc, null, 2));
        
        if (existingDoc) {
            let needsUpdate = false;
            let updateData = {};
            let unsetData = {};
            
            // Check if the data has header structure (wrong format)
            if (existingDoc.header) {
                console.log('Found header structure, converting to flat structure');
                
                // Move header fields to root level
                if (existingDoc.header.title) {
                    updateData.title = existingDoc.header.title;
                }
                if (existingDoc.header.description) {
                    updateData.description = existingDoc.header.description;
                }
                if (existingDoc.header.coverImage) {
                    updateData.coverImage = existingDoc.header.coverImage;
                }
                
                // Remove the entire header object
                unsetData.header = 1;
                needsUpdate = true;
            }
            
            // Ensure required fields exist with defaults if missing
            if (!existingDoc.title && !updateData.title) {
                updateData.title = "Luxurious Rooms & Suites";
                needsUpdate = true;
            }
            if (!existingDoc.description && !updateData.description) {
                updateData.description = "Experience the ultimate in comfort and luxury with our selection of elegantly designed rooms and suites, each offering unique amenities to enhance your stay.";
                needsUpdate = true;
            }
            if (!existingDoc.coverImage && !updateData.coverImage) {
                updateData.coverImage = "";
                needsUpdate = true;
            }
            if (!existingDoc.categories) {
                updateData.categories = [];
                needsUpdate = true;
            }
            
            if (needsUpdate) {
                const updateQuery = {};
                if (Object.keys(updateData).length > 0) {
                    updateQuery.$set = updateData;
                }
                if (Object.keys(unsetData).length > 0) {
                    updateQuery.$unset = unsetData;
                }
                
                const updatedDoc = await RoomsPage.findByIdAndUpdate(
                    existingDoc._id,
                    updateQuery,
                    { new: true }
                );
                console.log('Updated rooms document:', JSON.stringify(updatedDoc, null, 2));
                
                res.status(200).json({
                    success: true,
                    message: 'Rooms content structure fixed successfully',
                    data: updatedDoc,
                    changes: { set: updateData, unset: unsetData }
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Rooms content structure is already correct',
                    data: existingDoc
                });
            }
        } else {
            // Create new document with correct structure
            const newDoc = await RoomsPage.create({
                title: "Luxurious Rooms & Suites",
                description: "Experience the ultimate in comfort and luxury with our selection of elegantly designed rooms and suites, each offering unique amenities to enhance your stay.",
                coverImage: "",
                categories: []
            });
            
            res.status(200).json({
                success: true,
                message: 'New rooms content created with correct structure',
                data: newDoc
            });
        }
    } catch (error) {
        console.error('ERROR in fix rooms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fix rooms content',
            error: error.message
        });
    }
});

// Upload content image
router.post('/upload-image', uploadMulter.single('image'), uploadContentImage);

// Spa page cover image specific route
router.post('/spa/cover-image', uploadMulter.single('image'), async (req, res) => {
    try {
        console.log('===== UPLOAD SPA COVER IMAGE =====');

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Get the uploaded file URL
        const fileUrl = `/uploads/content/${req.file.filename}`;
        console.log('Spa cover image URL:', fileUrl);

        // Update the spa page content with the new cover image
        const { SpaPage } = await import('../../models/content/content.model.js');
        
        let spaContent = await SpaPage.findOne();
        if (!spaContent) {
            spaContent = await SpaPage.create({
                coverImage: fileUrl
            });
        } else {
            spaContent.coverImage = fileUrl;
            spaContent.lastUpdated = new Date();
            await spaContent.save();
        }

        res.status(200).json({
            success: true,
            message: 'Spa cover image uploaded and updated successfully',
            data: {
                url: fileUrl,
                spaContent: spaContent
            }
        });
    } catch (error) {
        console.error('ERROR in spa cover image upload:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload spa cover image',
            error: error.message
        });
    }
});

// Rooms page cover image specific route
router.post('/rooms/cover-image', uploadMulter.single('image'), async (req, res) => {
    try {
        console.log('===== UPLOAD ROOMS COVER IMAGE =====');

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Get the uploaded file URL
        const fileUrl = `/uploads/content/${req.file.filename}`;
        console.log('Rooms cover image URL:', fileUrl);

        // Update the rooms page content with the new cover image
        const { RoomsPage } = await import('../../models/content/content.model.js');
        
        let roomsContent = await RoomsPage.findOne();
        if (!roomsContent) {
            roomsContent = await RoomsPage.create({
                coverImage: fileUrl
            });
        } else {
            roomsContent.coverImage = fileUrl;
            roomsContent.lastUpdated = new Date();
            await roomsContent.save();
        }

        res.status(200).json({
            success: true,
            message: 'Rooms cover image uploaded and updated successfully',
            data: {
                url: fileUrl,
                roomsContent: roomsContent
            }
        });
    } catch (error) {
        console.error('ERROR in rooms cover image upload:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload rooms cover image',
            error: error.message
        });
    }
});

// Events page cover image specific route
router.post('/events/cover-image', uploadMulter.single('image'), async (req, res) => {
    try {
        console.log('===== UPLOAD EVENTS COVER IMAGE =====');

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Get the uploaded file URL
        const fileUrl = `/uploads/content/${req.file.filename}`;
        console.log('Events cover image URL:', fileUrl);

        // Update the events page content with the new cover image
        const { EventsPage } = await import('../../models/content/content.model.js');
        
        let eventsContent = await EventsPage.findOne();
        if (!eventsContent) {
            eventsContent = await EventsPage.create({
                coverImage: fileUrl
            });
        } else {
            eventsContent.coverImage = fileUrl;
            eventsContent.lastUpdated = new Date();
            await eventsContent.save();
        }

        res.status(200).json({
            success: true,
            message: 'Events cover image uploaded and updated successfully',
            data: {
                url: fileUrl,
                eventsContent: eventsContent
            }
        });
    } catch (error) {
        console.error('ERROR in events cover image upload:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload events cover image',
            error: error.message
        });
    }
});

// Meeting Hall page cover image specific route
router.post('/meeting-hall/cover-image', uploadMulter.single('image'), async (req, res) => {
    try {
        console.log('===== UPLOAD MEETING HALL COVER IMAGE =====');

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Get the uploaded file URL
        const fileUrl = `/uploads/content/${req.file.filename}`;
        console.log('Meeting hall cover image URL:', fileUrl);

        // Update the meeting hall page content with the new cover image
        const { MeetingHallPage } = await import('../../models/content/content.model.js');
        
        let meetingHallContent = await MeetingHallPage.findOne();
        if (!meetingHallContent) {
            meetingHallContent = await MeetingHallPage.create({
                coverImage: fileUrl
            });
        } else {
            meetingHallContent.coverImage = fileUrl;
            meetingHallContent.lastUpdated = new Date();
            await meetingHallContent.save();
        }

        res.status(200).json({
            success: true,
            message: 'Meeting hall cover image uploaded and updated successfully',
            data: {
                url: fileUrl,
                meetingHallContent: meetingHallContent
            }
        });
    } catch (error) {
        console.error('ERROR in meeting hall cover image upload:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload meeting hall cover image',
            error: error.message
        });
    }
});

export default router; 