import MenuCategory from "../../models/restaurant/menuCategory.model.js";

// Create a new menu category
export const createMenuCategory = async (req, res) => {
    try {
        const { name, description, sortOrder, isActive } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({ 
                success: false,
                message: "Category name is required" 
            });
        }

        // Check if category already exists
        const existingCategory = await MenuCategory.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') } 
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category with this name already exists"
            });
        }

        // Create new category
        const newCategory = new MenuCategory({
            name: name.trim(),
            description: description?.trim() || "",
            sortOrder: sortOrder || 0,
            isActive: isActive !== undefined ? isActive : true
        });

        await newCategory.save();

        res.status(201).json({
            success: true,
            data: newCategory,
            message: "Menu category created successfully"
        });
    } catch (error) {
        console.error("Error creating menu category:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create menu category",
            error: error.message
        });
    }
};

// Get all menu categories
export const getAllMenuCategories = async (req, res) => {
    try {
        const { active } = req.query;
        
        let filter = {};
        if (active !== undefined) {
            filter.isActive = active === 'true';
        }

        const categories = await MenuCategory.find(filter).sort({ sortOrder: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error("Error fetching menu categories:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch menu categories",
            error: error.message
        });
    }
};

// Get menu category by ID
export const getMenuCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await MenuCategory.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Menu category not found"
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error("Error fetching menu category:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch menu category",
            error: error.message
        });
    }
};

// Update menu category
export const updateMenuCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, sortOrder, isActive } = req.body;

        // Find the category first
        const category = await MenuCategory.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Menu category not found"
            });
        }

        // Check if new name already exists (excluding current category)
        if (name && name.trim() !== category.name) {
            const existingCategory = await MenuCategory.findOne({ 
                name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
                _id: { $ne: id }
            });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Category with this name already exists"
                });
            }
        }

        // Update fields
        if (name) category.name = name.trim();
        if (description !== undefined) category.description = description.trim();
        if (sortOrder !== undefined) category.sortOrder = sortOrder;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        res.status(200).json({
            success: true,
            data: category,
            message: "Menu category updated successfully"
        });
    } catch (error) {
        console.error("Error updating menu category:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update menu category",
            error: error.message
        });
    }
};

// Delete menu category
export const deleteMenuCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await MenuCategory.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Menu category not found"
            });
        }

        // Check if category is being used by any menu items
        const MenuItem = (await import("../../models/restaurant/menuItem.model.js")).default;
        const menuItemsCount = await MenuItem.countDocuments({ category: id });

        if (menuItemsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It is being used by ${menuItemsCount} menu item(s). Please reassign or delete those menu items first.`
            });
        }

        await MenuCategory.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Menu category deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting menu category:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete menu category",
            error: error.message
        });
    }
}; 