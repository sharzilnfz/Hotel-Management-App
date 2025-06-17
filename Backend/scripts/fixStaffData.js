import mongoose from 'mongoose';
import HouseKeepingStaff from '../models/house-keeping/staff.model.js';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import mongose_connect from '../db/connection.js';

// Load environment variables
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const fixStaffData = async () => {
    try {
        await mongose_connect();
        console.log('Connected to MongoDB...');

        // Get all staff
        const allStaff = await HouseKeepingStaff.find();
        console.log(`Found ${allStaff.length} staff members to fix`);

        let fixedCount = 0;

        // Process each staff member
        for (const staff of allStaff) {
            let needsUpdate = false;

            // Fix assignedAreas if it's a string array with JSON strings
            if (staff.assignedAreas && Array.isArray(staff.assignedAreas)) {
                try {
                    // Check if the first item is a JSON string
                    if (typeof staff.assignedAreas[0] === 'string' &&
                        staff.assignedAreas[0].startsWith('[')) {
                        // Parse the JSON string
                        staff.assignedAreas = JSON.parse(staff.assignedAreas[0]);
                        console.log(`Fixed assignedAreas for ${staff.name}:`, staff.assignedAreas);
                        needsUpdate = true;
                    }
                } catch (error) {
                    console.error(`Error parsing assignedAreas for ${staff.name}:`, error);
                    staff.assignedAreas = [];
                    needsUpdate = true;
                }
            }

            // Update the staff member if changes were made
            if (needsUpdate) {
                await HouseKeepingStaff.findByIdAndUpdate(staff._id, {
                    assignedAreas: staff.assignedAreas
                });
                fixedCount++;
            }
        }

        console.log(`Fixed ${fixedCount} staff members`);
        process.exit(0);
    } catch (error) {
        console.error('Error fixing staff data:', error);
        process.exit(1);
    }
};

fixStaffData(); 