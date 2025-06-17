import Availability from '../../models/availability/availability.model.js';
import Room from '../../models/rooms/room.model.js';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, parseISO, format } from 'date-fns';
import mongoose from 'mongoose';

// Get all services of a given type (using mock data for non-room types)
export const getAllServices = async (req, res) => {
    try {
        const { serviceType } = req.params;

        if (!['room', 'spa', 'restaurant', 'specialist'].includes(serviceType)) {
            return res.status(400).json({ message: 'Invalid service type' });
        }

        // Get real data for rooms
        if (serviceType === 'room') {
            const rooms = await Room.find({ active: true });
            const services = rooms.map(room => ({
                id: room._id,
                name: room.name,
                capacity: room.totalRooms
            }));
            
            return res.status(200).json({
                success: true,
                data: services
            });
        }
        
        // Use static data for other service types
        let services = [];
        switch (serviceType) {
            case 'spa':
                services = [
                    { id: 1, name: "Swedish Massage", capacity: 5 },
                    { id: 2, name: "Deep Tissue Massage", capacity: 3 },
                    { id: 3, name: "Hot Stone Therapy", capacity: 2 },
                    { id: 4, name: "Facial Treatment", capacity: 4 },
                    { id: 5, name: "Body Scrub", capacity: 3 }
                ];
                break;
            case 'restaurant':
                services = [
                    { id: 1, name: "Main Dining", capacity: 20 },
                    { id: 2, name: "Outdoor Terrace", capacity: 15 },
                    { id: 3, name: "Private Dining Room", capacity: 2 },
                    { id: 4, name: "Bar Seating", capacity: 10 },
                    { id: 5, name: "Lounge Area", capacity: 8 }
                ];
                break;
            case 'specialist':
                services = [
                    { id: 1, name: "Emily Wilson", capacity: 8, role: "Senior Massage Therapist" },
                    { id: 2, name: "Michael Chen", capacity: 8, role: "Massage Therapist" },
                    { id: 3, name: "Sophia Rodriguez", capacity: 6, role: "Wellness Specialist" },
                    { id: 4, name: "Olivia Johnson", capacity: 7, role: "Esthetician" },
                    { id: 5, name: "Thomas Martin", capacity: 5, role: "Body Treatment Specialist" }
                ];
                break;
        }

        res.status(200).json({
            success: true,
            data: services
        });
    } catch (error) {
        console.error(`Error fetching ${req.params.serviceType} services:`, error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch services',
            error: error.message
        });
    }
};

// Get availability for a specific service by ID and month
export const getAvailabilityByMonth = async (req, res) => {
    try {
        const { serviceType, serviceId } = req.params;
        const { month, year } = req.query;

        if (!serviceId || !month || !year) {
            return res.status(400).json({
                success: false,
                message: 'Service ID, month, and year are required'
            });
        }

        // Create date range for the month
        const startDate = startOfMonth(new Date(parseInt(year), parseInt(month) - 1, 1));
        const endDate = endOfMonth(startDate);

        // Get service details based on serviceType and serviceId
        let service = null;
        let capacity = 0;
        
        if (serviceType === 'room') {
            // For rooms, get actual data from the database
            try {
                const room = await Room.findById(serviceId);
                if (room) {
                    service = { 
                        id: room._id, 
                        name: room.name, 
                        capacity: room.totalRooms 
                    };
                    capacity = room.totalRooms;
                } else {
                    return res.status(404).json({
                        success: false,
                        message: 'Room not found'
                    });
                }
            } catch (error) {
                console.error("Error finding room:", error);
                return res.status(500).json({
                    success: false,
                    message: 'Error finding room',
                    error: error.message
                });
            }
        } else {
            // For other service types, use mock data
            switch (serviceType) {
                case 'spa':
                    service = { id: parseInt(serviceId), name: `Spa Service ${serviceId}`, capacity: 5 };
                    capacity = 5;
                    break;
                case 'restaurant':
                    service = { id: parseInt(serviceId), name: `Restaurant Section ${serviceId}`, capacity: 20 };
                    capacity = 20;
                    break;
                case 'specialist':
                    service = { id: parseInt(serviceId), name: `Specialist ${serviceId}`, capacity: 8 };
                    capacity = 8;
                    break;
            }
        }

        // If serviceId is a MongoDB ObjectId for rooms, we need to query differently
        const queryServiceId = serviceType === 'room' ? serviceId : parseInt(serviceId);

        // Get availability data for the month
        const availabilityData = await Availability.find({
            serviceType,
            serviceId: queryServiceId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        // Format the response
        const formattedData = {};
        availabilityData.forEach(record => {
            const dateKey = format(record.date, 'yyyy-MM-dd');
            formattedData[dateKey] = {
                date: record.date,
                available: record.available,
                total: record.total,
                bookings: record.bookings
            };
        });

        res.status(200).json({
            success: true,
            data: {
                service,
                availability: formattedData
            }
        });
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch availability data',
            error: error.message
        });
    }
};

// Update availability for a specific date
export const updateAvailability = async (req, res) => {
    try {
        const { serviceType, serviceId } = req.params;
        const { date, available } = req.body;

        if (!serviceId || !date || available === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Service ID, date, and available count are required'
            });
        }

        // Get service details and total capacity
        let service = null;
        let total = 0;

        if (serviceType === 'room') {
            // For rooms, get actual data from the database
            try {
                const room = await Room.findById(serviceId);
                if (room) {
                    service = { 
                        id: room._id, 
                        name: room.name, 
                        capacity: room.totalRooms 
                    };
                    total = room.totalRooms;
                    
                    // Calculate bookings based on available rooms
                    const bookings = total - parseInt(available);
                    
                    // Update availableRooms in the room based on total - bookings
                    await Room.findByIdAndUpdate(serviceId, { 
                        availableRooms: parseInt(available)
                    });
                } else {
                    return res.status(404).json({
                        success: false,
                        message: 'Room not found'
                    });
                }
            } catch (error) {
                console.error("Error finding room:", error);
                return res.status(500).json({
                    success: false,
                    message: 'Error finding room',
                    error: error.message
                });
            }
        } else {
            // For other service types, use mock data
            switch (serviceType) {
                case 'spa':
                    service = { id: parseInt(serviceId), name: `Spa Service ${serviceId}`, capacity: 5 };
                    total = 5;
                    break;
                case 'restaurant':
                    service = { id: parseInt(serviceId), name: `Restaurant Section ${serviceId}`, capacity: 20 };
                    total = 20;
                    break;
                case 'specialist':
                    service = { id: parseInt(serviceId), name: `Specialist ${serviceId}`, capacity: 8 };
                    total = 8;
                    break;
            }
        }

        const parsedDate = parseISO(date);
        const dateStart = startOfDay(parsedDate);
        const dateEnd = endOfDay(parsedDate);

        // If serviceId is a MongoDB ObjectId for rooms, we need to query differently
        const queryServiceId = serviceType === 'room' ? serviceId : parseInt(serviceId);

        // Find if there's an existing record for this date
        let availabilityRecord = await Availability.findOne({
            serviceType,
            serviceId: queryServiceId,
            date: { $gte: dateStart, $lte: dateEnd }
        });

        const updatedAvailable = Math.max(0, Math.min(total, parseInt(available)));
        const bookings = total - updatedAvailable;

        if (availabilityRecord) {
            // Update existing record
            availabilityRecord.available = updatedAvailable;
            availabilityRecord.bookings = bookings;
            availabilityRecord.updatedBy = req.user?.name || 'admin';
            await availabilityRecord.save();
        } else {
            // Create new record
            availabilityRecord = await Availability.create({
                serviceType,
                serviceId: queryServiceId,
                serviceName: service.name,
                date: dateStart,
                total,
                available: updatedAvailable,
                bookings: bookings,
                updatedBy: req.user?.name || 'admin'
            });
        }

        res.status(200).json({
            success: true,
            data: availabilityRecord
        });
    } catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update availability',
            error: error.message
        });
    }
};

// Bulk update availability
export const bulkUpdateAvailability = async (req, res) => {
    try {
        const { serviceType, serviceId } = req.params;
        const { dates, available, reset } = req.body;

        if (!serviceId || !dates || (available === undefined && !reset)) {
            return res.status(400).json({
                success: false,
                message: 'Service ID, dates, and either available count or reset flag are required'
            });
        }

        // Get service details based on serviceType and serviceId
        let service = null;
        let total = 0;

        if (serviceType === 'room') {
            // For rooms, get actual data from the database
            try {
                const room = await Room.findById(serviceId);
                if (room) {
                    service = { 
                        id: room._id, 
                        name: room.name, 
                        capacity: room.totalRooms 
                    };
                    total = room.totalRooms;
                    
                    // Calculate the new available rooms value
                    const updatedAvailable = reset ? total : Math.max(0, Math.min(total, parseInt(available)));
                    
                    // Update availableRooms in the room
                    await Room.findByIdAndUpdate(serviceId, { 
                        availableRooms: updatedAvailable
                    });
                } else {
                    return res.status(404).json({
                        success: false,
                        message: 'Room not found'
                    });
                }
            } catch (error) {
                console.error("Error finding room:", error);
                return res.status(500).json({
                    success: false,
                    message: 'Error finding room',
                    error: error.message
                });
            }
        } else {
            // For other service types, use mock data
            switch (serviceType) {
                case 'spa':
                    service = { id: parseInt(serviceId), name: `Spa Service ${serviceId}`, capacity: 5 };
                    total = 5;
                    break;
                case 'restaurant':
                    service = { id: parseInt(serviceId), name: `Restaurant Section ${serviceId}`, capacity: 20 };
                    total = 20;
                    break;
                case 'specialist':
                    service = { id: parseInt(serviceId), name: `Specialist ${serviceId}`, capacity: 8 };
                    total = 8;
                    break;
            }
        }

        // If serviceId is a MongoDB ObjectId for rooms, we need to query differently
        const queryServiceId = serviceType === 'room' ? serviceId : parseInt(serviceId);

        const results = [];

        // Process each date
        for (const dateString of dates) {
            const parsedDate = parseISO(dateString);
            const dateStart = startOfDay(parsedDate);
            const dateEnd = endOfDay(parsedDate);

            // Find if there's an existing record for this date
            let availabilityRecord = await Availability.findOne({
                serviceType,
                serviceId: queryServiceId,
                date: { $gte: dateStart, $lte: dateEnd }
            });

            const updatedAvailable = reset ? total : Math.max(0, Math.min(total, parseInt(available)));
            const bookings = total - updatedAvailable;

            if (availabilityRecord) {
                // Update existing record
                availabilityRecord.available = updatedAvailable;
                availabilityRecord.bookings = bookings;
                availabilityRecord.updatedBy = req.user?.name || 'admin';
                await availabilityRecord.save();
                results.push(availabilityRecord);
            } else {
                // Create new record
                const newRecord = await Availability.create({
                    serviceType,
                    serviceId: queryServiceId,
                    serviceName: service.name,
                    date: dateStart,
                    total,
                    available: updatedAvailable,
                    bookings: bookings,
                    updatedBy: req.user?.name || 'admin'
                });
                results.push(newRecord);
            }
        }

        res.status(200).json({
            success: true,
            message: `Updated availability for ${results.length} dates`,
            data: results
        });
    } catch (error) {
        console.error('Error in bulk update availability:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update availability',
            error: error.message
        });
    }
};

// Block an entire day (set availability to 0)
export const blockDay = async (req, res) => {
    try {
        const { serviceType, serviceId } = req.params;
        const { date } = req.body;

        if (!serviceId || !date) {
            return res.status(400).json({
                success: false,
                message: 'Service ID and date are required'
            });
        }

        // If it's a room, update availableRooms to 0
        if (serviceType === 'room') {
            try {
                await Room.findByIdAndUpdate(serviceId, { 
                    availableRooms: 0 
                });
            } catch (error) {
                console.error("Error updating room availability:", error);
            }
        }

        // Set available to 0 using updateAvailability
        req.body.available = 0;
        return updateAvailability(req, res);
    } catch (error) {
        console.error('Error blocking day:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to block day',
            error: error.message
        });
    }
};

// Get all availabilities across all service types (NEW FUNCTION)
export const getAllAvailabilities = async (req, res) => {
    try {
        const { 
            serviceType, 
            startDate, 
            endDate, 
            page = 1, 
            limit = 100,
            sortBy = 'date',
            sortOrder = 'asc'
        } = req.query;

        // Build query filter
        const filter = {};
        
        if (serviceType && ['room', 'spa', 'restaurant', 'specialist'].includes(serviceType)) {
            filter.serviceType = serviceType;
        }

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) {
                filter.date.$gte = startOfDay(parseISO(startDate));
            }
            if (endDate) {
                filter.date.$lte = endOfDay(parseISO(endDate));
            }
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Get total count for pagination
        const totalCount = await Availability.countDocuments(filter);
        
        // Get availability data
        const availabilities = await Availability.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Group by service type for easier frontend consumption
        const groupedData = {
            room: [],
            spa: [],
            restaurant: [],
            specialist: []
        };

        availabilities.forEach(record => {
            if (groupedData[record.serviceType]) {
                groupedData[record.serviceType].push({
                    id: record._id,
                    serviceId: record.serviceId,
                    serviceName: record.serviceName,
                    date: format(record.date, 'yyyy-MM-dd'),
                    available: record.available,
                    total: record.total,
                    bookings: record.bookings,
                    updatedBy: record.updatedBy,
                    updatedAt: record.updatedAt
                });
            }
        });

        // Calculate statistics
        const stats = {
            totalRecords: totalCount,
            totalPages: Math.ceil(totalCount / parseInt(limit)),
            currentPage: parseInt(page),
            recordsPerPage: parseInt(limit),
            hasNextPage: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
            hasPrevPage: parseInt(page) > 1
        };

        // Summary statistics by service type
        const summary = {};
        for (const [serviceType, records] of Object.entries(groupedData)) {
            if (records.length > 0) {
                summary[serviceType] = {
                    totalServices: [...new Set(records.map(r => r.serviceId))].length,
                    totalAvailable: records.reduce((sum, r) => sum + r.available, 0),
                    totalCapacity: records.reduce((sum, r) => sum + r.total, 0),
                    totalBookings: records.reduce((sum, r) => sum + r.bookings, 0),
                    averageOccupancy: records.length > 0 
                        ? ((records.reduce((sum, r) => sum + r.bookings, 0) / records.reduce((sum, r) => sum + r.total, 0)) * 100).toFixed(2)
                        : 0
                };
            }
        }

        res.status(200).json({
            success: true,
            data: {
                availabilities: groupedData,
                summary,
                pagination: stats,
                filters: {
                    serviceType: serviceType || 'all',
                    startDate: startDate || null,
                    endDate: endDate || null
                }
            }
        });
    } catch (error) {
        console.error('Error fetching all availabilities:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch availabilities',
            error: error.message
        });
    }
}; 