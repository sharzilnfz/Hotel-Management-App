import PromoCode from '../../models/promo-code/promo-code.model.js';

// Get all promo codes
export const getAllPromoCodes = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        // Filter by status if provided
        if (status) {
            query.status = status;
        }

        const promoCodes = await PromoCode.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: promoCodes.length,
            data: {
                promoCodes
            }
        });
    } catch (error) {
        console.error('Error getting promo codes:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get a single promo code
export const getPromoCode = async (req, res) => {
    try {
        const promoCode = await PromoCode.findById(req.params.id);

        if (!promoCode) {
            return res.status(404).json({
                status: 'error',
                message: 'Promo code not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                promoCode
            }
        });
    } catch (error) {
        console.error('Error getting promo code:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Create a new promo code
export const createPromoCode = async (req, res) => {
    try {
        const formattedData = formatPromoCodeData(req.body);
        const newPromoCode = await PromoCode.create(formattedData);

        res.status(201).json({
            status: 'success',
            data: {
                promoCode: newPromoCode
            }
        });
    } catch (error) {
        console.error('Error creating promo code:', error);

        // Handle duplicate key error (code must be unique)
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'A promo code with this code already exists'
            });
        }

        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update a promo code
export const updatePromoCode = async (req, res) => {
    try {
        const formattedData = formatPromoCodeData(req.body);
        const updatedPromoCode = await PromoCode.findByIdAndUpdate(
            req.params.id,
            formattedData,
            { new: true, runValidators: true }
        );

        if (!updatedPromoCode) {
            return res.status(404).json({
                status: 'error',
                message: 'Promo code not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                promoCode: updatedPromoCode
            }
        });
    } catch (error) {
        console.error('Error updating promo code:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'A promo code with this code already exists'
            });
        }

        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete a promo code
export const deletePromoCode = async (req, res) => {
    try {
        const promoCode = await PromoCode.findByIdAndDelete(req.params.id);

        if (!promoCode) {
            return res.status(404).json({
                status: 'error',
                message: 'Promo code not found'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        console.error('Error deleting promo code:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Helper function to format promo code data
const formatPromoCodeData = (data) => {
    // Format dates and combine with times
    const formattedData = {
        ...data,
        validFrom: new Date(data.validFrom),
        validTo: new Date(data.validTo)
    };

    // Format discount properly based on type
    if (data.type === 'Percentage' && !data.discount.includes('%')) {
        formattedData.discount = `${data.discount}%`;
    } else if (data.type === 'Fixed' && !data.discount.includes('$')) {
        formattedData.discount = `$${data.discount}`;
    }

    return formattedData;
}; 