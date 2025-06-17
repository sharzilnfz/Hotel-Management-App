import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { startOfDay, addDays, format } from 'date-fns';
import mongose_connect from '../db/connection.js';
import Availability from '../models/availability/availability.model.js';

dotenv.config();

// Helper function to generate random availability data for a service
const generateAvailabilityData = (serviceType, serviceId, name, capacity, days = 30) => {
    const today = startOfDay(new Date());
    const records = [];

    for (let i = 0; i < days; i++) {
        const date = addDays(today, i);
        const available = Math.floor(Math.random() * (capacity + 1));

        records.push({
            serviceType,
            serviceId,
            serviceName: name,
            date,
            total: capacity,
            available,
            bookings: capacity - available,
            updatedBy: 'system'
        });
    }

    return records;
};

const seedAvailabilityData = async () => {
    try {
        await mongose_connect();
        console.log('MongoDB connected successfully');

        // Clear existing data
        await Availability.deleteMany({});
        console.log('Cleared existing availability data');

        // Generate data for rooms
        const rooms = [
            { id: 1, name: "Deluxe King Room", capacity: 15 },
            { id: 2, name: "Executive Suite", capacity: 10 },
            { id: 3, name: "Standard Twin Room", capacity: 20 },
            { id: 4, name: "Family Suite", capacity: 8 },
            { id: 5, name: "Ocean View Room", capacity: 12 }
        ];

        // Generate data for spa services
        const spaServices = [
            { id: 1, name: "Swedish Massage", capacity: 5 },
            { id: 2, name: "Deep Tissue Massage", capacity: 3 },
            { id: 3, name: "Hot Stone Therapy", capacity: 2 },
            { id: 4, name: "Facial Treatment", capacity: 4 },
            { id: 5, name: "Body Scrub", capacity: 3 }
        ];

        // Generate data for restaurant sections
        const restaurantSections = [
            { id: 1, name: "Main Dining", capacity: 20 },
            { id: 2, name: "Outdoor Terrace", capacity: 15 },
            { id: 3, name: "Private Dining Room", capacity: 2 },
            { id: 4, name: "Bar Seating", capacity: 10 },
            { id: 5, name: "Lounge Area", capacity: 8 }
        ];

        // Generate data for spa specialists
        const spaSpecialists = [
            { id: 1, name: "Emily Wilson", capacity: 8 },
            { id: 2, name: "Michael Chen", capacity: 8 },
            { id: 3, name: "Sophia Rodriguez", capacity: 6 },
            { id: 4, name: "Olivia Johnson", capacity: 7 },
            { id: 5, name: "Thomas Martin", capacity: 5 }
        ];

        let allRecords = [];

        // Generate records for each service type
        for (const room of rooms) {
            const roomRecords = generateAvailabilityData('room', room.id, room.name, room.capacity);
            allRecords = [...allRecords, ...roomRecords];
        }

        for (const service of spaServices) {
            const serviceRecords = generateAvailabilityData('spa', service.id, service.name, service.capacity);
            allRecords = [...allRecords, ...serviceRecords];
        }

        for (const section of restaurantSections) {
            const sectionRecords = generateAvailabilityData('restaurant', section.id, section.name, section.capacity);
            allRecords = [...allRecords, ...sectionRecords];
        }

        for (const specialist of spaSpecialists) {
            const specialistRecords = generateAvailabilityData('specialist', specialist.id, specialist.name, specialist.capacity);
            allRecords = [...allRecords, ...specialistRecords];
        }

        // Insert all records
        await Availability.insertMany(allRecords);
        console.log(`Added ${allRecords.length} availability records`);

        console.log('Availability data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding availability data:', error);
        process.exit(1);
    }
};

seedAvailabilityData(); 