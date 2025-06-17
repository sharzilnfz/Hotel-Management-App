import LoyaltyReward from '../../models/loyalty/reward.model.js';
import mongoose from 'mongoose';

// Get all rewards
export const getAllRewards = async (req, res) => {
    try {
        const { category, status, search } = req.query;

        const filter = {};

        // Apply filters
        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        }

        // Search in name and description
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const rewards = await LoyaltyReward.find(filter).sort({ pointsCost: 1 });

        res.status(200).json({
            success: true,
            count: rewards.length,
            data: rewards
        });
    } catch (error) {
        console.error("Error fetching loyalty rewards:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch loyalty rewards",
            error: error.message
        });
    }
};

// Get reward by id
export const getRewardById = async (req, res) => {
    try {
        const reward = await LoyaltyReward.findById(req.params.id);

        if (!reward) {
            return res.status(404).json({
                success: false,
                message: "Loyalty reward not found"
            });
        }

        res.status(200).json({
            success: true,
            data: reward
        });
    } catch (error) {
        console.error("Error fetching loyalty reward:", error);

        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                success: false,
                message: "Invalid reward ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to fetch loyalty reward",
            error: error.message
        });
    }
};

// Create new reward
export const createReward = async (req, res) => {
    try {
        const { name, pointsCost, description, category, status } = req.body;

        // Check if required fields are provided
        if (!name || pointsCost === undefined || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: name, pointsCost, description, category"
            });
        }

        // Check if reward with the same name already exists
        const existingReward = await LoyaltyReward.findOne({ name });
        if (existingReward) {
            return res.status(400).json({
                success: false,
                message: "A reward with this name already exists"
            });
        }

        // Create new reward
        const reward = await LoyaltyReward.create({
            name,
            pointsCost,
            description,
            category,
            status: status || 'Active'
        });

        res.status(201).json({
            success: true,
            data: reward
        });
    } catch (error) {
        console.error("Error creating loyalty reward:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create loyalty reward",
            error: error.message
        });
    }
};

// Update reward
export const updateReward = async (req, res) => {
    try {
        const { name, pointsCost, description, category, status } = req.body;

        // Check if reward with new name already exists (excluding current reward)
        if (name) {
            const existingReward = await LoyaltyReward.findOne({
                name,
                _id: { $ne: req.params.id }
            });

            if (existingReward) {
                return res.status(400).json({
                    success: false,
                    message: "A reward with this name already exists"
                });
            }
        }

        // Prepare update data
        const updateData = {};
        if (name) updateData.name = name;
        if (pointsCost !== undefined) updateData.pointsCost = pointsCost;
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        if (status) updateData.status = status;

        // Update reward
        const reward = await LoyaltyReward.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!reward) {
            return res.status(404).json({
                success: false,
                message: "Loyalty reward not found"
            });
        }

        res.status(200).json({
            success: true,
            data: reward
        });
    } catch (error) {
        console.error("Error updating loyalty reward:", error);

        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                success: false,
                message: "Invalid reward ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update loyalty reward",
            error: error.message
        });
    }
};

// Delete reward
export const deleteReward = async (req, res) => {
    try {
        const reward = await LoyaltyReward.findByIdAndDelete(req.params.id);

        if (!reward) {
            return res.status(404).json({
                success: false,
                message: "Loyalty reward not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Loyalty reward deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting loyalty reward:", error);

        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                success: false,
                message: "Invalid reward ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to delete loyalty reward",
            error: error.message
        });
    }
}; 