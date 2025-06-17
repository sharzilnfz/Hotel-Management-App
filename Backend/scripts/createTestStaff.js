import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import HouseKeepingStaff from '../models/house-keeping/staff.model.js';
import dotenv from 'dotenv';
import mongose_connect from '../db/connection.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/staff');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create a sample avatar (a simple colored rectangle)
const createSampleAvatar = () => {
    const avatarPath = path.join(uploadsDir, 'sample-avatar.png');

    console.log('Creating sample avatar at:', avatarPath);

    // If we already have a sample avatar, return its path
    if (fs.existsSync(avatarPath)) {
        return 'uploads/staff/sample-avatar.png';
    }

    // Otherwise, copy a placeholder image or create a simple one
    try {
        // Create a simple image (this is a minimal PNG file that shows as a colored square)
        const pngData = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x20,
            0x08, 0x02, 0x00, 0x00, 0x00, 0xFC, 0x18, 0xED, 0xA3, 0x00, 0x00, 0x00,
            0x0C, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0xED, 0xC1, 0x01, 0x0D, 0x00,
            0x00, 0x00, 0xC2, 0xA0, 0xF7, 0x4F, 0x6D, 0x0E, 0x37, 0xA0, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xBE, 0x0C, 0x21, 0x00, 0x00, 0x01,
            0x9A, 0x60, 0xE1, 0xD5, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
            0xAE, 0x42, 0x60, 0x82
        ]);

        fs.writeFileSync(avatarPath, pngData);
        console.log('Sample avatar created successfully');
        return 'uploads/staff/sample-avatar.png';
    } catch (err) {
        console.error('Error creating sample avatar:', err);
        return null;
    }
};

const createTestStaff = async () => {
    try {
        await mongose_connect();
        console.log('Connected to MongoDB...');

        // Create a sample avatar
        const avatarPath = createSampleAvatar();

        // Create a test staff member with an avatar
        const testStaff = {
            name: "Test Staff With Avatar",
            email: "test.avatar@example.com",
            phone: "5551234567",
            position: "Manager",
            joinDate: new Date(),
            assignedAreas: ["1st Floor", "Lobby"],
            status: "Active",
            avatar: avatarPath,
            performance: 4.5,
            tasksDone: 25,
            tasksAssigned: 30,
            tasksInProgress: 5,
            address: "123 Test Street",
            notes: "This is a test staff member with an avatar"
        };

        // Check if the test staff already exists
        const existingStaff = await HouseKeepingStaff.findOne({ email: testStaff.email });
        if (existingStaff) {
            console.log('Test staff already exists, updating...');
            const updatedStaff = await HouseKeepingStaff.findByIdAndUpdate(
                existingStaff._id,
                { ...testStaff },
                { new: true }
            );
            console.log('Test staff updated:', updatedStaff);
        } else {
            console.log('Creating new test staff...');
            const newStaff = await HouseKeepingStaff.create(testStaff);
            console.log('Test staff created:', newStaff);
        }

        console.log('Done!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating test staff:', error);
        process.exit(1);
    }
};

createTestStaff(); 