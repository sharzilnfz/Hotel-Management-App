import LoyaltySettings from '../../models/loyalty/settings.model.js';

// Get loyalty program settings
export const getSettings = async (req, res) => {
    try {
        const settings = await LoyaltySettings.getSettings();

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error("Error fetching loyalty settings:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch loyalty settings",
            error: error.message
        });
    }
};

// Update loyalty program settings
export const updateSettings = async (req, res) => {
    try {
        const {
            pointsExpiration,
            pointsPerDollar,
            welcomeBonus,
            birthdayBonus,
            promoCodesApplicable,
            discountAvailable
        } = req.body;

        // Get the current settings
        const settings = await LoyaltySettings.getSettings();

        // Update only the fields that are provided
        if (pointsExpiration !== undefined) settings.pointsExpiration = pointsExpiration;
        if (pointsPerDollar !== undefined) settings.pointsPerDollar = pointsPerDollar;
        if (welcomeBonus !== undefined) settings.welcomeBonus = welcomeBonus;
        if (birthdayBonus !== undefined) settings.birthdayBonus = birthdayBonus;
        if (promoCodesApplicable !== undefined) {
            // Convert string 'yes'/'no' to boolean if needed
            if (typeof promoCodesApplicable === 'string') {
                settings.promoCodesApplicable = promoCodesApplicable.toLowerCase() === 'yes';
            } else {
                settings.promoCodesApplicable = promoCodesApplicable;
            }
        }
        if (discountAvailable !== undefined) {
            // Convert string 'yes'/'no' to boolean if needed
            if (typeof discountAvailable === 'string') {
                settings.discountAvailable = discountAvailable.toLowerCase() === 'yes';
            } else {
                settings.discountAvailable = discountAvailable;
            }
        }

        // Save the updated settings
        await settings.save();

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error("Error updating loyalty settings:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update loyalty settings",
            error: error.message
        });
    }
}; 