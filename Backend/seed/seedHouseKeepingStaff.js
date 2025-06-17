import mongoose from 'mongoose';
import HouseKeepingStaff from '../models/house-keeping/staff.model.js';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import mongose_connect from '../db/connection.js';

// Load environment variables
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

// Sample staff data
const staffData = [
    {
        name: "John Smith",
        email: "john.smith@parkside.com",
        phone: "5551234567",
        position: "Manager",
        joinDate: new Date("2022-01-15"),
        assignedAreas: ["2nd Floor", "3rd Floor"],
        status: "Active",
        performance: 4.5,
        tasksDone: 85,
        tasksAssigned: 90,
        tasksInProgress: 5,
        address: "123 Main St, City",
        notes: "Team lead with excellent management skills"
    },
    {
        name: "Maria Garcia",
        email: "maria.garcia@parkside.com",
        phone: "5552345678",
        position: "Supervisor",
        joinDate: new Date("2022-03-10"),
        assignedAreas: ["1st Floor", "Lobby"],
        status: "Active",
        performance: 4.8,
        tasksDone: 120,
        tasksAssigned: 125,
        tasksInProgress: 5,
        address: "456 Oak Ave, City",
        notes: "Excellent at training new staff"
    },
    {
        name: "David Lee",
        email: "david.lee@parkside.com",
        phone: "5553456789",
        position: "Room Attendant",
        joinDate: new Date("2022-05-20"),
        assignedAreas: ["4th Floor"],
        status: "Active",
        performance: 4.2,
        tasksDone: 200,
        tasksAssigned: 220,
        tasksInProgress: 3,
        address: "789 Pine St, City",
        notes: "Very thorough and detail-oriented"
    },
    {
        name: "Sarah Johnson",
        email: "sarah.johnson@parkside.com",
        phone: "5554567890",
        position: "Laundry Attendant",
        joinDate: new Date("2022-07-15"),
        assignedAreas: ["Laundry Room"],
        status: "Active",
        performance: 4.0,
        tasksDone: 150,
        tasksAssigned: 160,
        tasksInProgress: 2,
        address: "101 Maple Dr, City",
        notes: "Efficient and organized"
    },
    {
        name: "Michael Brown",
        email: "michael.brown@parkside.com",
        phone: "5555678901",
        position: "Public Area Cleaner",
        joinDate: new Date("2022-09-05"),
        assignedAreas: ["Lobby", "Restaurant", "Pool Area"],
        status: "Active",
        performance: 4.3,
        tasksDone: 180,
        tasksAssigned: 190,
        tasksInProgress: 4,
        address: "202 Elm St, City",
        notes: "Good at handling multiple areas"
    },
];

// Connect to MongoDB
const seedDatabase = async () => {
    try {
        await mongose_connect();
        console.log('Connected to MongoDB...');

        // Delete existing staff data
        await HouseKeepingStaff.deleteMany({});
        console.log('Deleted existing staff data');

        // Insert new staff data
        const createdStaff = await HouseKeepingStaff.insertMany(staffData);
        console.log(`Inserted ${createdStaff.length} staff members`);

        console.log('Seed complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase(); 