import LoyaltyTier from '../../models/loyalty/tier.model.js';
import mongoose from 'mongoose';

// Get all tiers
export const getAllTiers = async (req, res) => {
    try {
        const tiers = await LoyaltyTier.find().sort({ pointsRequired: 1 });
        res.status(200).json({
            success: true,
            count: tiers.length,
            data: tiers
        });
    } catch (error) {
        console.error("Error fetching loyalty tiers:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch loyalty tiers",
            error: error.message
        });
    }
};

// Get tier by id
export const getTierById = async (req, res) => {
    try {
        const tier = await LoyaltyTier.findById(req.params.id);
        if (!tier) {
            return res.status(404).json({
                success: false,
                message: "Loyalty tier not found"
            });
        }
        res.status(200).json({
            success: true,
            data: tier
        });
    } catch (error) {
        console.error("Error fetching loyalty tier:", error);
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                success: false,
                message: "Invalid tier ID format"
            });
        }
        res.status(500).json({
            success: false,
            message: "Failed to fetch loyalty tier",
            error: error.message
        });
    }
};

// Create new tier
export const createTier = async (req, res) => {
    try {
        const { name, pointsRequired, benefits, color } = req.body;

        // Check if required fields are provided
        if (!name || pointsRequired === undefined || !benefits) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: name, pointsRequired, benefits"
            });
        }

        // Check if tier with the same name already exists
        const existingTier = await LoyaltyTier.findOne({ name });
        if (existingTier) {
            return res.status(400).json({
                success: false,
                message: "A tier with this name already exists"
            });
        }

        // Create new tier
        const tier = await LoyaltyTier.create({
            name,
            pointsRequired,
            benefits: Array.isArray(benefits) ? benefits : [benefits],
            color
        });

        res.status(201).json({
            success: true,
            data: tier
        });
    } catch (error) {
        console.error("Error creating loyalty tier:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create loyalty tier",
            error: error.message
        });
    }
};

// Update tier
export const updateTier = async (req, res) => {
    try {
        const { name, pointsRequired, benefits, color } = req.body;

        // Check if tier with new name already exists (excluding current tier)
        if (name) {
            const existingTier = await LoyaltyTier.findOne({
                name,
                _id: { $ne: req.params.id }
            });

            if (existingTier) {
                return res.status(400).json({
                    success: false,
                    message: "A tier with this name already exists"
                });
            }
        }

        // Process benefits if provided
        let processedBenefits;
        if (benefits) {
            processedBenefits = Array.isArray(benefits) ? benefits : [benefits];
        }

        // Prepare update data
        const updateData = {};
        if (name) updateData.name = name;
        if (pointsRequired !== undefined) updateData.pointsRequired = pointsRequired;
        if (benefits) updateData.benefits = processedBenefits;
        if (color) updateData.color = color;

        // Update tier
        const tier = await LoyaltyTier.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!tier) {
            return res.status(404).json({
                success: false,
                message: "Loyalty tier not found"
            });
        }

        res.status(200).json({
            success: true,
            data: tier
        });
    } catch (error) {
        console.error("Error updating loyalty tier:", error);
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                success: false,
                message: "Invalid tier ID format"
            });
        }
        res.status(500).json({
            success: false,
            message: "Failed to update loyalty tier",
            error: error.message
        });
    }
};

// Delete tier
export const deleteTier = async (req, res) => {
    try {
        const tier = await LoyaltyTier.findByIdAndDelete(req.params.id);

        if (!tier) {
            return res.status(404).json({
                success: false,
                message: "Loyalty tier not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Loyalty tier deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting loyalty tier:", error);
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                success: false,
                message: "Invalid tier ID format"
            });
        }
        res.status(500).json({
            success: false,
            message: "Failed to delete loyalty tier",
            error: error.message
        });
    }
}; 