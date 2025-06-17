import AppearanceSettings from '../../models/settings/appearanceSettings.model.js';

// Get all appearance settings
export const getAppearanceSettings = async (req, res) => {
    try {
        const settings = await AppearanceSettings.findOne();

        // If no settings exist, create default settings
        if (!settings) {
            const defaultSettings = await AppearanceSettings.create({
                colors: [
                    { id: 1, name: "Primary", value: "#0F4C81", category: "Brand" },
                    { id: 2, name: "Secondary", value: "#C19A6B", category: "Brand" },
                    { id: 3, name: "Accent", value: "#E5D3B3", category: "Brand" },
                    { id: 4, name: "Dark", value: "#2C3E50", category: "UI" },
                    { id: 5, name: "Light", value: "#F5F5F5", category: "UI" }
                ],
                fonts: [
                    { id: 1, name: "Inter", family: "Inter, sans-serif", type: "Sans-serif", previewText: "Experience luxury accommodations" },
                    { id: 2, name: "Playfair Display", family: "Playfair Display, serif", type: "Serif", previewText: "Experience luxury accommodations" }
                ]
            });

            return res.status(200).json({
                success: true,
                message: 'Default appearance settings created',
                data: defaultSettings
            });
        }

        return res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error fetching appearance settings:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching appearance settings',
            error: error.message
        });
    }
};

// Update colors
export const updateColors = async (req, res) => {
    try {
        const { colors } = req.body;

        if (!colors || !Array.isArray(colors)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid colors data'
            });
        }

        let settings = await AppearanceSettings.findOne();

        if (!settings) {
            settings = await AppearanceSettings.create({
                colors: colors,
                fonts: []
            });
        } else {
            settings.colors = colors;
            await settings.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Colors updated successfully',
            data: { colors: settings.colors }
        });
    } catch (error) {
        console.error('Error updating colors:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating colors',
            error: error.message
        });
    }
};

// Add a color
export const addColor = async (req, res) => {
    try {
        const { name, value, category } = req.body;

        if (!name || !value || !category) {
            return res.status(400).json({
                success: false,
                message: 'Name, value, and category are required'
            });
        }

        let settings = await AppearanceSettings.findOne();

        if (!settings) {
            settings = await AppearanceSettings.create({
                colors: [],
                fonts: []
            });
        }

        // Find the next available ID
        const nextId = settings.colors.length > 0
            ? Math.max(...settings.colors.map(color => color.id)) + 1
            : 1;

        const newColor = {
            id: nextId,
            name,
            value,
            category
        };

        settings.colors.push(newColor);
        await settings.save();

        return res.status(201).json({
            success: true,
            message: 'Color added successfully',
            data: { color: newColor }
        });
    } catch (error) {
        console.error('Error adding color:', error);
        return res.status(500).json({
            success: false,
            message: 'Error adding color',
            error: error.message
        });
    }
};

// Delete a color
export const deleteColor = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Color ID is required'
            });
        }

        const settings = await AppearanceSettings.findOne();

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: 'Appearance settings not found'
            });
        }

        const colorIndex = settings.colors.findIndex(color => color.id === parseInt(id));

        if (colorIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Color not found'
            });
        }

        settings.colors.splice(colorIndex, 1);
        await settings.save();

        return res.status(200).json({
            success: true,
            message: 'Color deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting color:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting color',
            error: error.message
        });
    }
};

// Update fonts
export const updateFonts = async (req, res) => {
    try {
        const { fonts } = req.body;

        if (!fonts || !Array.isArray(fonts)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid fonts data'
            });
        }

        let settings = await AppearanceSettings.findOne();

        if (!settings) {
            settings = await AppearanceSettings.create({
                colors: [],
                fonts: fonts
            });
        } else {
            settings.fonts = fonts;
            await settings.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Fonts updated successfully',
            data: { fonts: settings.fonts }
        });
    } catch (error) {
        console.error('Error updating fonts:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating fonts',
            error: error.message
        });
    }
};

// Add a font
export const addFont = async (req, res) => {
    try {
        const { name, family, type, previewText } = req.body;

        if (!name || !family || !type) {
            return res.status(400).json({
                success: false,
                message: 'Name, family, and type are required'
            });
        }

        let settings = await AppearanceSettings.findOne();

        if (!settings) {
            settings = await AppearanceSettings.create({
                colors: [],
                fonts: []
            });
        }

        // Find the next available ID
        const nextId = settings.fonts.length > 0
            ? Math.max(...settings.fonts.map(font => font.id)) + 1
            : 1;

        const newFont = {
            id: nextId,
            name,
            family,
            type,
            previewText: previewText || "Experience luxury accommodations"
        };

        settings.fonts.push(newFont);
        await settings.save();

        return res.status(201).json({
            success: true,
            message: 'Font added successfully',
            data: { font: newFont }
        });
    } catch (error) {
        console.error('Error adding font:', error);
        return res.status(500).json({
            success: false,
            message: 'Error adding font',
            error: error.message
        });
    }
};

// Delete a font
export const deleteFont = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Font ID is required'
            });
        }

        const settings = await AppearanceSettings.findOne();

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: 'Appearance settings not found'
            });
        }

        const fontIndex = settings.fonts.findIndex(font => font.id === parseInt(id));

        if (fontIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Font not found'
            });
        }

        settings.fonts.splice(fontIndex, 1);
        await settings.save();

        return res.status(200).json({
            success: true,
            message: 'Font deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting font:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting font',
            error: error.message
        });
    }
};

// Import colors
export const importColors = async (req, res) => {
    try {
        const { colors } = req.body;

        if (!colors || !Array.isArray(colors)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid colors data'
            });
        }

        let settings = await AppearanceSettings.findOne();

        if (!settings) {
            settings = await AppearanceSettings.create({
                colors: [],
                fonts: []
            });
        }

        // Find the next available ID
        const nextId = settings.colors.length > 0
            ? Math.max(...settings.colors.map(color => color.id)) + 1
            : 1;

        // Add new colors with unique IDs
        const newColors = colors.map((color, index) => ({
            id: nextId + index,
            name: color.name,
            value: color.value,
            category: color.category || 'Imported'
        }));

        settings.colors = [...settings.colors, ...newColors];
        await settings.save();

        return res.status(201).json({
            success: true,
            message: `${newColors.length} colors imported successfully`,
            data: {
                colors: settings.colors,
                addedColors: newColors
            }
        });
    } catch (error) {
        console.error('Error importing colors:', error);
        return res.status(500).json({
            success: false,
            message: 'Error importing colors',
            error: error.message
        });
    }
};

// Upload font
export const uploadFont = async (req, res) => {
    try {
        // This would normally handle file upload to a storage service
        // For now, we'll just simulate adding a font entry based on the file name

        const fileName = req.body.fileName || 'Uploaded Font';
        let settings = await AppearanceSettings.findOne();

        if (!settings) {
            settings = await AppearanceSettings.create({
                colors: [],
                fonts: []
            });
        }

        // Find the next available ID
        const nextId = settings.fonts.length > 0
            ? Math.max(...settings.fonts.map(font => font.id)) + 1
            : 1;

        const newFont = {
            id: nextId,
            name: fileName,
            family: `${fileName}, sans-serif`,
            type: 'Custom',
            previewText: 'Experience luxury accommodations'
        };

        settings.fonts.push(newFont);
        await settings.save();

        return res.status(201).json({
            success: true,
            message: 'Font uploaded successfully',
            data: { font: newFont }
        });
    } catch (error) {
        console.error('Error uploading font:', error);
        return res.status(500).json({
            success: false,
            message: 'Error uploading font',
            error: error.message
        });
    }
};
