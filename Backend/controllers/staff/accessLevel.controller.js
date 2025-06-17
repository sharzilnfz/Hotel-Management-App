import AccessLevel from "../../models/staff/accessLevel.model.js";

// Get all access levels
export const getAllAccessLevels = async (req, res) => {
    try {
        const accessLevels = await AccessLevel.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: accessLevels.length,
            data: accessLevels,
        });
    } catch (error) {
        console.error("Error fetching access levels:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch access levels",
            error: error.message,
        });
    }
};

// Get a single access level by ID
export const getAccessLevelById = async (req, res) => {
    try {
        const accessLevel = await AccessLevel.findById(req.params.id);

        if (!accessLevel) {
            return res.status(404).json({
                success: false,
                message: "Access level not found",
            });
        }

        res.status(200).json({
            success: true,
            data: accessLevel,
        });
    } catch (error) {
        console.error("Error fetching access level:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch access level",
            error: error.message,
        });
    }
};

// Create a new access level
export const createAccessLevel = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Access level name is required",
            });
        }

        // Check if access level already exists
        const existingAccessLevel = await AccessLevel.findOne({ name });
        if (existingAccessLevel) {
            return res.status(400).json({
                success: false,
                message: "An access level with this name already exists",
            });
        }

        const accessLevel = await AccessLevel.create({
            name,
            description,
            permissions: permissions || [],
        });

        res.status(201).json({
            success: true,
            message: "Access level created successfully",
            data: accessLevel,
        });
    } catch (error) {
        console.error("Error creating access level:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create access level",
            error: error.message,
        });
    }
};

// Update an access level
export const updateAccessLevel = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Access level name is required",
            });
        }

        // Check if access level exists
        const existingAccessLevel = await AccessLevel.findById(req.params.id);
        if (!existingAccessLevel) {
            return res.status(404).json({
                success: false,
                message: "Access level not found",
            });
        }

        // Check if name is taken by another access level
        if (name !== existingAccessLevel.name) {
            const nameExists = await AccessLevel.findOne({ name });
            if (nameExists) {
                return res.status(400).json({
                    success: false,
                    message: "An access level with this name already exists",
                });
            }
        }

        const accessLevel = await AccessLevel.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                permissions: permissions || existingAccessLevel.permissions,
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Access level updated successfully",
            data: accessLevel,
        });
    } catch (error) {
        console.error("Error updating access level:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update access level",
            error: error.message,
        });
    }
};

// Delete an access level
export const deleteAccessLevel = async (req, res) => {
    try {
        const accessLevel = await AccessLevel.findByIdAndDelete(req.params.id);

        if (!accessLevel) {
            return res.status(404).json({
                success: false,
                message: "Access level not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Access level deleted successfully",
            data: {},
        });
    } catch (error) {
        console.error("Error deleting access level:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete access level",
            error: error.message,
        });
    }
}; 