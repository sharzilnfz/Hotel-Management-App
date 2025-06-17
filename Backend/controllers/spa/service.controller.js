import Service from "../../models/spa/service.model.js";
import Category from "../../models/spa/category.model.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../../uploads/services");
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

// Get all services
export const getAllServices = async (req, res) => {
    try {
        const { category, search, status, popular } = req.query;

        const filter = {};

        // Filter by category
        if (category) {
            filter.categoryId = category;
        }

        // Filter by status
        if (status) {
            filter.status = status;
        }

        // Filter by popularity
        if (popular === 'true') {
            filter.isPopular = true;
        }

        // Search in title and description
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const services = await Service.find(filter)
            .populate('categoryId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch services",
            error: error.message
        });
    }
};

// Get a single service by ID
export const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('categoryId', 'name');

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error("Error fetching service:", error);

        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to fetch service",
            error: error.message
        });
    }
};

// Create a new service
export const createService = async (req, res) => {
    try {
        // Log request body before validation
        console.log('Create Service Request Body:', req.body);

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
                // Log uploaded files
                console.log('Uploaded Files:', req.files);

                // Check if category exists
                if (req.body.categoryId) {
                    const categoryExists = await Category.findById(req.body.categoryId);
                    if (!categoryExists) {
                        return res.status(400).json({
                            success: false,
                            message: "Category not found"
                        });
                    }
                }

                // Parse form data
                let serviceData = {
                    title: req.body.title,
                    description: req.body.description,
                    categoryId: req.body.categoryId,
                    specialist: req.body.specialist,
                    specialistId: req.body.specialistId,
                    availability: req.body.availability,
                    status: req.body.status || 'active',
                    displayStatus: req.body.displayStatus || 'available',
                    isPopular: req.body.isPopular === 'true',
                    isRefundable: req.body.isRefundable === 'true' || req.body.isRefundable === true,
                    refundPolicy: req.body.refundPolicy,
                    durations: req.body.durations ? (typeof req.body.durations === 'string' ? JSON.parse(req.body.durations) : req.body.durations) : [],
                    addons: req.body.addons ? (typeof req.body.addons === 'string' ? JSON.parse(req.body.addons) : req.body.addons) : [],
                    images: req.files && req.files.length > 0 ? req.files.map(file => file.filename) : (req.body.images || [])
                };

                console.log('Processed Service Data:', serviceData);

                // Create new service
                const service = new Service(serviceData);
                await service.save();

                res.status(201).json({
                    success: true,
                    message: "Service created successfully",
                    data: service
                });
            } catch (error) {
                console.error("Error creating service:", error);

                // Clean up uploaded files if there's an error
                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        const filePath = path.join(uploadDir, file.filename);
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    });
                }

                if (error.name === 'ValidationError') {
                    const messages = Object.values(error.errors).map(val => val.message);
                    return res.status(400).json({
                        success: false,
                        message: messages.join(', '),
                        error: error.message
                    });
                }

                res.status(500).json({
                    success: false,
                    message: "Failed to create service",
                    error: error.message
                });
            }
        });
    } catch (error) {
        console.error("Error in createService:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Update a service
export const updateService = async (req, res) => {
    try {
        // Log request body before validation
        console.log('Update Service Request Body:', req.body);

        // First find the service to get its current image information
        const existingService = await Service.findById(req.params.id);
        if (!existingService) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
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
                // Check if category exists if categoryId is being updated
                if (req.body.categoryId && req.body.categoryId !== existingService.categoryId.toString()) {
                    const categoryExists = await Category.findById(req.body.categoryId);
                    if (!categoryExists) {
                        return res.status(400).json({
                            success: false,
                            message: "Category not found"
                        });
                    }
                }

                // Parse form data
                let serviceData = {
                    title: req.body.title,
                    description: req.body.description,
                    categoryId: req.body.categoryId || existingService.categoryId,
                    specialist: req.body.specialist,
                    specialistId: req.body.specialistId,
                    availability: req.body.availability,
                    status: req.body.status || existingService.status,
                    displayStatus: req.body.displayStatus || 'available',
                    isPopular: req.body.isPopular === 'true',
                    isRefundable: req.body.isRefundable === 'true' || req.body.isRefundable === true,
                    refundPolicy: req.body.refundPolicy,
                    durations: req.body.durations ? (typeof req.body.durations === 'string' ? JSON.parse(req.body.durations) : req.body.durations) : existingService.durations,
                    addons: req.body.addons ? (typeof req.body.addons === 'string' ? JSON.parse(req.body.addons) : req.body.addons) : existingService.addons
                };

                console.log('Processed Update Service Data:', serviceData);

                // Handle existing images
                let existingImages = [];
                if (req.body.existingImages) {
                    try {
                        existingImages = JSON.parse(req.body.existingImages);
                    } catch (error) {
                        console.error("Error parsing existingImages:", error);
                        existingImages = [];
                    }
                }

                // Find images to delete
                const imagesToDelete = existingService.images.filter(
                    img => !existingImages.includes(img)
                );

                // Delete removed images
                if (imagesToDelete.length > 0) {
                    imagesToDelete.forEach(imageName => {
                        const imagePath = path.join(uploadDir, imageName);
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                    });
                }

                // Prepare the final images array
                serviceData.images = [
                    ...existingImages,
                    ...(req.files ? req.files.map(file => file.filename) : [])
                ];

                // Update the service
                const updatedService = await Service.findByIdAndUpdate(
                    req.params.id,
                    serviceData,
                    { new: true, runValidators: true }
                ).populate('categoryId', 'name');

                res.status(200).json({
                    success: true,
                    message: "Service updated successfully",
                    data: updatedService
                });
            } catch (error) {
                console.error("Error updating service:", error);

                // Clean up newly uploaded files if there's an error
                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        const filePath = path.join(uploadDir, file.filename);
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    });
                }

                if (error.name === 'ValidationError') {
                    const messages = Object.values(error.errors).map(val => val.message);
                    return res.status(400).json({
                        success: false,
                        message: messages.join(', '),
                        error: error.message
                    });
                }

                res.status(500).json({
                    success: false,
                    message: "Failed to update service",
                    error: error.message
                });
            }
        });
    } catch (error) {
        console.error("Error in updateService:", error);

        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete a service
export const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // Delete associated images
        if (service.images && service.images.length > 0) {
            service.images.forEach(imageName => {
                const imagePath = path.join(uploadDir, imageName);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }

        // Delete service from database
        await Service.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Service deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete service",
            error: error.message
        });
    }
};

// Seed initial services
export const seedServices = async (req, res) => {
    try {
        // Check if there are already services in the database
        const count = await Service.countDocuments();

        if (count > 0) {
            return res.status(400).json({
                success: false,
                message: "Services already exist in the database"
            });
        }

        // Get all categories to reference in services
        const categories = await Category.find();

        if (categories.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No categories found. Please seed categories first."
            });
        }

        // Sample services data
        const sampleServices = [
            {
                title: "Swedish Massage",
                description: "A classic relaxation massage using long, flowing strokes to reduce tension and promote well-being.",
                duration: 60,
                price: 80,
                categoryId: categories.find(c => c.name.includes("Massage"))._id,
                images: [],
                isPopular: true,
                status: "active"
            },
            {
                title: "Deep Tissue Massage",
                description: "Targets the deeper layers of muscle and connective tissue to release chronic tension and pain.",
                duration: 60,
                price: 90,
                categoryId: categories.find(c => c.name.includes("Massage"))._id,
                images: [],
                isPopular: true,
                status: "active"
            },
            {
                title: "Hot Stone Massage",
                description: "Incorporates heated stones that help to relax muscles and improve circulation.",
                duration: 75,
                price: 100,
                categoryId: categories.find(c => c.name.includes("Massage"))._id,
                images: [],
                status: "active"
            },
            {
                title: "Classic Facial",
                description: "A purifying treatment that includes cleansing, exfoliation, extraction, and hydration for all skin types.",
                duration: 45,
                price: 65,
                categoryId: categories.find(c => c.name.includes("Facial"))._id,
                images: [],
                isPopular: true,
                status: "active"
            },
            {
                title: "Anti-Aging Facial",
                description: "Specialized treatment focusing on reducing fine lines and boosting collagen production.",
                duration: 60,
                price: 85,
                categoryId: categories.find(c => c.name.includes("Facial"))._id,
                images: [],
                status: "active"
            },
            {
                title: "Manicure",
                description: "Professional nail shaping, cuticle care, and polish application for beautiful hands.",
                duration: 30,
                price: 35,
                categoryId: categories.find(c => c.name.includes("Nail"))._id,
                images: [],
                status: "active"
            },
            {
                title: "Pedicure",
                description: "Luxurious foot treatment including soak, exfoliation, nail care, and polish.",
                duration: 45,
                price: 45,
                categoryId: categories.find(c => c.name.includes("Nail"))._id,
                images: [],
                isPopular: true,
                status: "active"
            },
            {
                title: "Body Scrub",
                description: "Full body exfoliation to remove dead skin cells and leave skin smooth and glowing.",
                duration: 45,
                price: 70,
                categoryId: categories.find(c => c.name.includes("Body"))._id,
                images: [],
                status: "active"
            },
            {
                title: "Aromatherapy Wrap",
                description: "Nourishing body wrap with essential oils to detoxify and hydrate the skin.",
                duration: 60,
                price: 90,
                categoryId: categories.find(c => c.name.includes("Body"))._id,
                images: [],
                status: "active"
            }
        ];

        // Create services with appropriate error handling for categories
        const servicesToCreate = [];

        for (const service of sampleServices) {
            // If specified category doesn't exist, use the first available category
            if (!service.categoryId) {
                service.categoryId = categories[0]._id;
            }
            servicesToCreate.push(service);
        }

        // Use insertMany to efficiently create multiple services
        const createdServices = await Service.insertMany(servicesToCreate);

        res.status(201).json({
            success: true,
            message: "Sample services seeded successfully",
            count: createdServices.length,
            data: createdServices
        });
    } catch (error) {
        console.error("Error seeding services:", error);
        res.status(500).json({
            success: false,
            message: "Failed to seed services",
            error: error.message
        });
    }
}; 