import mongoose from 'mongoose';

const supplySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Supply name is required'],
            trim: true,
            unique: true
        },
        currentStock: {
            type: Number,
            required: [true, 'Current stock is required'],
            min: [0, 'Stock cannot be negative']
        },
        minStock: {
            type: Number,
            required: [true, 'Minimum stock level is required'],
            min: [0, 'Minimum stock cannot be negative']
        },
        unit: {
            type: String,
            required: [true, 'Unit of measurement is required'],
            trim: true
        },
        lastOrdered: {
            type: Date,
            default: Date.now
        },
        orderHistory: [{
            quantity: Number,
            orderedAt: {
                type: Date,
                default: Date.now
            },
            receivedAt: Date
        }]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for supply status
supplySchema.virtual('status').get(function() {
    return this.currentStock < this.minStock ? 'low' : 'adequate';
});

// Virtual for checking if supply needs reordering
supplySchema.virtual('needsReorder').get(function() {
    return this.currentStock < this.minStock;
});

const HouseKeepingSupply = mongoose.model('HouseKeepingSupply', supplySchema);

export default HouseKeepingSupply; 