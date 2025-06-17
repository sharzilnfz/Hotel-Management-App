import mongoose from 'mongoose';

const appearanceSettingsSchema = new mongoose.Schema({
    colors: [
        {
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            },
            category: {
                type: String,
                required: true,
                enum: ['Brand', 'UI', 'Accent', 'Custom', 'Imported']
            }
        }
    ],
    fonts: [
        {
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            family: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true,
                enum: ['Sans-serif', 'Serif', 'Monospace', 'Display', 'Handwriting', 'Custom']
            },
            previewText: {
                type: String,
                default: "Experience luxury accommodations"
            }
        }
    ],
}, { timestamps: true });

const AppearanceSettings = mongoose.model('AppearanceSettings', appearanceSettingsSchema);

export default AppearanceSettings;
