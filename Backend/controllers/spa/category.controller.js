import Category from "../../models/spa/category.model.js";

// Create a new category
export const createCategory = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        // Check if category with same name already exists
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "A category with this name already exists"
            });
        }

        // Create new category
        const category = new Category({
            name,
            description,
            status: status || "active",
            serviceCount: 0
        });

        await category.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: error.message
        });
    }
};

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message
        });
    }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch category",
            error: error.message
        });
    }
};

// Update a category
export const updateCategory = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        // Check if category exists
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Check if name is being changed and if new name already exists
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: req.params.id }
            });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: "A category with this name already exists"
                });
            }
        }

        // Update category
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description, status },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update category",
            error: error.message
        });
    }
};

// Delete a category
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Here you would typically check if the category is being used
        // by any services or specialists before deleting
        if (category.serviceCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete category that is associated with services",
                serviceCount: category.serviceCount
            });
        }

        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete category",
            error: error.message
        });
    }
};

// Seed initial categories
export const seedCategories = async (req, res) => {
    try {
        // Check if categories already exist
        const count = await Category.countDocuments();
        if (count > 0) {
            return res.status(400).json({
                success: false,
                message: "Categories already exist in the database"
            });
        }

        // Initial categories from frontend
        const initialCategories = [
            { name: "Massage", description: "Different types of massage therapies", serviceCount: 3, status: "active" },
            { name: "Facial", description: "Facial treatments for all skin types", serviceCount: 2, status: "active" },
            { name: "Body Treatment", description: "Full body treatments and wraps", serviceCount: 1, status: "active" },
            { name: "Therapy", description: "Special therapeutic treatments", serviceCount: 1, status: "active" }
        ];

        // Insert categories
        await Category.insertMany(initialCategories);

        res.status(201).json({
            success: true,
            message: "Initial categories seeded successfully",
            count: initialCategories.length
        });
    } catch (error) {
        console.error("Error seeding categories:", error);
        res.status(500).json({
            success: false,
            message: "Failed to seed categories",
            error: error.message
        });
    }
};

// Update service count
export const updateServiceCount = async (req, res) => {
    try {
        const { id } = req.params;
        const { increment } = req.body;

        if (increment === undefined) {
            return res.status(400).json({
                success: false,
                message: "Increment value is required"
            });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Calculate new service count, ensuring it doesn't go below 0
        const newServiceCount = Math.max(0, category.serviceCount + increment);

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { serviceCount: newServiceCount },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Service count updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        console.error("Error updating service count:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update service count",
            error: error.message
        });
    }
}; 