import mongoose from 'mongoose';
import RoomBooking from '../models/rooms/room-booking.model.js';
import Room from '../models/rooms/room.model.js';

// Test data setup script for room booking system
async function setupTestData() {
  try {
    console.log('Setting up test data for room booking system...');

    // Clear existing test data
    await RoomBooking.deleteMany({});
    console.log('Cleared existing bookings');

    // Find or create a test room
    let testRoom = await Room.findOne({ name: 'Test Suite' });

    if (!testRoom) {
      testRoom = await Room.create({
        name: 'Test Suite',
        type: 'deluxe',
        category: 'double',
        bedType: 'king',
        capacity: 4,
        price: 350,
        totalRooms: 10,
        availableRooms: 10,
        description: 'A luxurious test suite for booking system testing',
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Room Service'],
        extras: [
          { name: 'Airport Transfer', price: 50 },
          { name: 'Spa Package', price: 100 },
          { name: 'Late Checkout', price: 25 },
        ],
        isRefundable: true,
        breakfastIncluded: true,
        active: true,
        publishWebsite: true,
        publishApp: true,
      });
      console.log('Created test room:', testRoom.name);
    } else {
      console.log('Using existing test room:', testRoom.name);
    }

    // Create sample bookings
    const sampleBookings = [
      {
        roomId: testRoom._id,
        roomName: testRoom.name,
        roomType: testRoom.type,
        primaryGuest: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          nationality: 'US',
          idNumber: 'ID123456',
        },
        additionalGuests: [
          {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            phone: '+1234567891',
          },
        ],
        checkInDate: new Date('2025-07-01'),
        checkOutDate: new Date('2025-07-05'),
        numberOfGuests: 2,
        roomQuantity: 1,
        basePrice: 1400, // 4 nights * 350
        selectedExtras: [{ name: 'Airport Transfer', price: 50, quantity: 2 }],
        extrasTotal: 100,
        subtotal: 1500,
        taxes: 150,
        totalAmount: 1650,
        paymentMethod: 'pay_now',
        status: 'confirmed',
        paymentStatus: 'paid',
        specialRequests: 'Late check-in requested',
        source: 'website',
      },
      {
        roomId: testRoom._id,
        roomName: testRoom.name,
        roomType: testRoom.type,
        primaryGuest: {
          firstName: 'Alice',
          lastName: 'Smith',
          email: 'alice.smith@example.com',
          phone: '+1987654321',
          nationality: 'CA',
        },
        checkInDate: new Date('2025-07-10'),
        checkOutDate: new Date('2025-07-12'),
        numberOfGuests: 1,
        roomQuantity: 1,
        basePrice: 700, // 2 nights * 350
        extrasTotal: 0,
        subtotal: 700,
        taxes: 70,
        totalAmount: 770,
        paymentMethod: 'pay_at_hotel',
        status: 'pending',
        paymentStatus: 'pending',
        source: 'app',
      },
      {
        roomId: testRoom._id,
        roomName: testRoom.name,
        roomType: testRoom.type,
        primaryGuest: {
          firstName: 'Bob',
          lastName: 'Wilson',
          email: 'bob.wilson@example.com',
          phone: '+1555666777',
        },
        checkInDate: new Date('2025-06-15'),
        checkOutDate: new Date('2025-06-18'),
        numberOfGuests: 3,
        roomQuantity: 1,
        basePrice: 1050, // 3 nights * 350
        selectedExtras: [{ name: 'Spa Package', price: 100, quantity: 1 }],
        extrasTotal: 100,
        subtotal: 1150,
        taxes: 115,
        totalAmount: 1265,
        paymentMethod: 'pay_now',
        status: 'checked_out',
        paymentStatus: 'paid',
        source: 'website',
      },
    ];

    // Create bookings
    const createdBookings = await RoomBooking.insertMany(sampleBookings);
    console.log(`Created ${createdBookings.length} sample bookings`);

    // Update room available count based on active bookings
    const activeBookings = await RoomBooking.find({
      roomId: testRoom._id,
      status: { $nin: ['cancelled', 'checked_out'] },
    });

    const bookedRooms = activeBookings.reduce(
      (sum, booking) => sum + booking.roomQuantity,
      0
    );
    await Room.findByIdAndUpdate(testRoom._id, {
      availableRooms: testRoom.totalRooms - bookedRooms,
    });

    console.log('Test data setup completed successfully!');
    console.log(`Test Room ID: ${testRoom._id}`);
    console.log(`Created ${createdBookings.length} bookings`);
    console.log(
      `Room availability: ${testRoom.totalRooms - bookedRooms}/${
        testRoom.totalRooms
      }`
    );

    return {
      testRoom,
      bookings: createdBookings,
    };
  } catch (error) {
    console.error('Error setting up test data:', error);
    throw error;
  }
}

// Test API endpoints
async function testBookingEndpoints() {
  try {
    console.log('\nTesting Room Booking API endpoints...');

    // Test 1: Check room availability
    console.log('\n1. Testing room availability check...');
    const testRoom = await Room.findOne({ name: 'Test Suite' });
    if (testRoom) {
      console.log(`Room found: ${testRoom.name} (ID: ${testRoom._id})`);
      console.log(
        `Available rooms: ${testRoom.availableRooms}/${testRoom.totalRooms}`
      );
    }

    // Test 2: Get all bookings count
    console.log('\n2. Testing booking retrieval...');
    const allBookings = await RoomBooking.find({});
    console.log(`Total bookings in database: ${allBookings.length}`);

    // Test 3: Get bookings by status
    const confirmedBookings = await RoomBooking.find({ status: 'confirmed' });
    const pendingBookings = await RoomBooking.find({ status: 'pending' });
    console.log(`Confirmed bookings: ${confirmedBookings.length}`);
    console.log(`Pending bookings: ${pendingBookings.length}`);

    // Test 4: Get booking by booking ID
    if (allBookings.length > 0) {
      const firstBooking = allBookings[0];
      console.log(
        `\n3. Testing booking lookup by booking ID: ${firstBooking.bookingId}`
      );
      console.log(
        `Guest: ${firstBooking.primaryGuest.firstName} ${firstBooking.primaryGuest.lastName}`
      );
      console.log(`Status: ${firstBooking.status}`);
      console.log(`Total: $${firstBooking.totalAmount}`);
    }

    console.log('\nAPI endpoints test completed!');
  } catch (error) {
    console.error('Error testing endpoints:', error);
  }
}

// Main execution
async function main() {
  try {
    // Connect to MongoDB (assuming connection is already established)
    if (mongoose.connection.readyState !== 1) {
      console.log(
        'MongoDB connection not ready. Please ensure the server is running.'
      );
      return;
    }

    await setupTestData();
    await testBookingEndpoints();

    console.log('\n=== Setup Complete ===');
    console.log('You can now test the booking API endpoints using:');
    console.log('- GET /api/room-bookings/availability');
    console.log('- POST /api/room-bookings');
    console.log('- GET /api/room-bookings (with auth)');
    console.log('- GET /api/room-bookings/booking/:bookingId');
    console.log(
      '\nCheck ROOM_BOOKING_API_DOCS.md for detailed API documentation.'
    );
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

export { setupTestData, testBookingEndpoints };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
