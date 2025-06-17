import HouseKeepingSupply from '../../models/house-keeping/supply.model.js';

// Get all supplies
export const getAllSupplies = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        // Filter by status if provided
        if (status) {
            if (status === 'low') {
                query = { $expr: { $lt: ["$currentStock", "$minStock"] } };
            } else if (status === 'adequate') {
                query = { $expr: { $gte: ["$currentStock", "$minStock"] } };
            }
        }

        const supplies = await HouseKeepingSupply.find(query).sort({ name: 1 });

        // Format dates to match frontend format
        const formattedSupplies = supplies.map(supply => {
            const formattedSupply = supply.toObject();
            if (supply.lastOrdered) {
                formattedSupply.lastOrdered = supply.lastOrdered.toISOString().split('T')[0];
            }
            return formattedSupply;
        });

        res.status(200).json({
            status: 'success',
            results: formattedSupplies.length,
            data: {
                supplies: formattedSupplies
            }
        });
    } catch (error) {
        console.error('Error getting supplies:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get a single supply
export const getSupply = async (req, res) => {
    try {
        const supply = await HouseKeepingSupply.findById(req.params.id);

        if (!supply) {
            return res.status(404).json({
                status: 'error',
                message: 'Supply not found'
            });
        }

        // Format date
        const formattedSupply = supply.toObject();
        if (supply.lastOrdered) {
            formattedSupply.lastOrdered = supply.lastOrdered.toISOString().split('T')[0];
        }

        res.status(200).json({
            status: 'success',
            data: {
                supply: formattedSupply
            }
        });
    } catch (error) {
        console.error('Error getting supply:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Create a new supply
export const createSupply = async (req, res) => {
    try {
        console.log('Backend - Create supply request received with body:', JSON.stringify(req.body, null, 2));

        // Check if the required fields are present
        if (!req.body.name || !req.body.currentStock || !req.body.minStock || !req.body.unit) {
            console.log('Backend - Missing required fields in request body');
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields. Please provide name, currentStock, minStock, and unit'
            });
        }

        const newSupply = await HouseKeepingSupply.create(req.body);
        console.log('Backend - Supply created successfully:', JSON.stringify(newSupply, null, 2));

        // Format date for response
        const formattedSupply = newSupply.toObject();
        if (newSupply.lastOrdered) {
            formattedSupply.lastOrdered = newSupply.lastOrdered.toISOString().split('T')[0];
        }

        console.log('Backend - Formatted supply to return:', JSON.stringify(formattedSupply, null, 2));

        res.status(201).json({
            status: 'success',
            data: {
                supply: formattedSupply
            }
        });
    } catch (error) {
        console.error('Backend - Error creating supply:', error);
        console.error('Backend - Error name:', error.name);
        console.error('Backend - Error message:', error.message);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(val => val.message);
            console.error('Backend - Validation errors:', errors);
            return res.status(400).json({
                status: 'error',
                message: errors.join(', ')
            });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            console.error('Backend - Duplicate key error');
            return res.status(400).json({
                status: 'error',
                message: 'A supply with this name already exists'
            });
        }

        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update a supply
export const updateSupply = async (req, res) => {
    try {
        console.log('Update supply request received:', req.params.id, req.body);

        const updatedSupply = await HouseKeepingSupply.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedSupply) {
            return res.status(404).json({
                status: 'error',
                message: 'Supply not found'
            });
        }

        // Format date for response
        const formattedSupply = updatedSupply.toObject();
        if (updatedSupply.lastOrdered) {
            formattedSupply.lastOrdered = updatedSupply.lastOrdered.toISOString().split('T')[0];
        }

        console.log('Supply updated:', formattedSupply);

        res.status(200).json({
            status: 'success',
            data: {
                supply: formattedSupply
            }
        });
    } catch (error) {
        console.error('Error updating supply:', error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete a supply
export const deleteSupply = async (req, res) => {
    try {
        const deletedSupply = await HouseKeepingSupply.findByIdAndDelete(req.params.id);

        if (!deletedSupply) {
            return res.status(404).json({
                status: 'error',
                message: 'Supply not found'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        console.error('Error deleting supply:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Order a supply
export const orderSupply = async (req, res) => {
    try {
        console.log('Order supply request received:', req.params.id, req.body);

        const { quantity = 100 } = req.body;

        // Find the supply
        const supply = await HouseKeepingSupply.findById(req.params.id);

        if (!supply) {
            return res.status(404).json({
                status: 'error',
                message: 'Supply not found'
            });
        }

        // Update the supply with the new order
        const updatedSupply = await HouseKeepingSupply.findByIdAndUpdate(
            req.params.id,
            {
                lastOrdered: new Date(),
                $push: {
                    orderHistory: {
                        quantity,
                        orderedAt: new Date()
                    }
                }
            },
            { new: true, runValidators: true }
        );

        // Format date for response
        const formattedSupply = updatedSupply.toObject();
        if (updatedSupply.lastOrdered) {
            formattedSupply.lastOrdered = updatedSupply.lastOrdered.toISOString().split('T')[0];
        }

        console.log('Supply ordered:', formattedSupply);

        res.status(200).json({
            status: 'success',
            data: {
                supply: formattedSupply
            }
        });
    } catch (error) {
        console.error('Error ordering supply:', error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update supply stock
export const updateStock = async (req, res) => {
    try {
        console.log('Update stock request received:', req.params.id, req.body);

        const { amount } = req.body;

        if (amount === undefined) {
            return res.status(400).json({
                status: 'error',
                message: 'Amount is required'
            });
        }

        // Find the supply
        const supply = await HouseKeepingSupply.findById(req.params.id);

        if (!supply) {
            return res.status(404).json({
                status: 'error',
                message: 'Supply not found'
            });
        }

        // Calculate new stock (prevent negative stock)
        const newStock = Math.max(0, supply.currentStock + amount);

        // Update the supply with the new stock
        const updatedSupply = await HouseKeepingSupply.findByIdAndUpdate(
            req.params.id,
            { currentStock: newStock },
            { new: true, runValidators: true }
        );

        // Format date for response
        const formattedSupply = updatedSupply.toObject();
        if (updatedSupply.lastOrdered) {
            formattedSupply.lastOrdered = updatedSupply.lastOrdered.toISOString().split('T')[0];
        }

        console.log('Supply stock updated:', formattedSupply);

        res.status(200).json({
            status: 'success',
            data: {
                supply: formattedSupply
            }
        });
    } catch (error) {
        console.error('Error updating supply stock:', error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
}; 