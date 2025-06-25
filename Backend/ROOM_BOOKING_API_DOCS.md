# Room Booking System API Documentation

This document provides comprehensive information about the Room Booking API endpoints.

## Base URL

```
http://localhost:YOUR_PORT/api/room-bookings
```

## Endpoints

### 1. Create Room Booking

**POST** `/api/room-bookings`

Creates a new room booking. This is a public endpoint.

**Request Body:**

```json
{
  "roomId": "64fb7a7b3d2a9c9f09b33f12",
  "primaryGuest": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "nationality": "US",
    "idNumber": "12345678"
  },
  "additionalGuests": [
    {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@example.com",
      "phone": "+1234567891"
    }
  ],
  "checkInDate": "2025-07-01",
  "checkOutDate": "2025-07-05",
  "numberOfGuests": 2,
  "roomQuantity": 1,
  "selectedExtras": [
    {
      "name": "Airport Transfer",
      "price": 50,
      "quantity": 2
    }
  ],
  "discountApplied": {
    "code": "SUMMER2025",
    "type": "percentage",
    "value": 10
  },
  "paymentMethod": "pay_now",
  "specialRequests": "Late check-in requested",
  "source": "website"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Room booking created successfully",
  "data": {
    "bookingId": "RB-202507-0001",
    "roomId": "64fb7a7b3d2a9c9f09b33f12",
    "roomName": "Deluxe Suite",
    "roomType": "deluxe",
    "primaryGuest": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890"
    },
    "checkInDate": "2025-07-01T00:00:00.000Z",
    "checkOutDate": "2025-07-05T00:00:00.000Z",
    "numberOfNights": 4,
    "totalAmount": 1890,
    "status": "pending",
    "createdAt": "2025-06-25T10:30:00.000Z"
  }
}
```

### 2. Get All Room Bookings (Admin)

**GET** `/api/room-bookings`

Retrieves all room bookings with filtering and pagination options.

**Headers:**

```
Authorization: Bearer your-auth-token
```

**Query Parameters:**

- `status` - Filter by booking status (pending, confirmed, checked_in, checked_out, cancelled, no_show)
- `roomId` - Filter by room ID
- `checkInDate` - Filter bookings starting from this date
- `checkOutDate` - Filter bookings ending before this date
- `guestEmail` - Filter by guest email (partial match)
- `paymentStatus` - Filter by payment status
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order: asc/desc (default: desc)

**Example:**

```
GET /api/room-bookings?status=confirmed&page=1&limit=5
```

### 3. Get Room Booking by ID (Admin)

**GET** `/api/room-bookings/:id`

**Headers:**

```
Authorization: Bearer your-auth-token
```

### 4. Get Room Booking by Booking ID (Public)

**GET** `/api/room-bookings/booking/:bookingId`

Public endpoint to retrieve booking details using the booking ID.

**Example:**

```
GET /api/room-bookings/booking/RB-202507-0001
```

### 5. Check Room Availability (Public)

**GET** `/api/room-bookings/availability`

Check room availability for specific dates.

**Query Parameters:**

- `roomId` (required) - Room ID to check
- `checkInDate` (required) - Check-in date (YYYY-MM-DD)
- `checkOutDate` (required) - Check-out date (YYYY-MM-DD)
- `roomQuantity` - Number of rooms requested (default: 1)

**Example:**

```
GET /api/room-bookings/availability?roomId=64fb7a7b3d2a9c9f09b33f12&checkInDate=2025-07-01&checkOutDate=2025-07-05&roomQuantity=2
```

**Response:**

```json
{
  "success": true,
  "data": {
    "roomId": "64fb7a7b3d2a9c9f09b33f12",
    "totalRooms": 10,
    "availableRooms": 7,
    "requestedQuantity": 2,
    "isAvailable": true,
    "checkInDate": "2025-07-01",
    "checkOutDate": "2025-07-05"
  }
}
```

### 6. Update Room Booking (Admin)

**PUT** `/api/room-bookings/:id`

**Headers:**

```
Authorization: Bearer your-auth-token
```

**Request Body:** (partial update supported)

```json
{
  "status": "confirmed",
  "paymentStatus": "paid",
  "specialRequests": "Updated special requests"
}
```

### 7. Cancel Room Booking (Admin)

**PATCH** `/api/room-bookings/:id/cancel`

**Headers:**

```
Authorization: Bearer your-auth-token
```

### 8. Delete Room Booking (Admin)

**DELETE** `/api/room-bookings/:id`

**Headers:**

```
Authorization: Bearer your-auth-token
```

### 9. Get Booking Statistics (Admin)

**GET** `/api/room-bookings/stats`

Get booking statistics and analytics.

**Headers:**

```
Authorization: Bearer your-auth-token
```

**Query Parameters:**

- `startDate` - Start date for statistics
- `endDate` - End date for statistics

**Response:**

```json
{
  "success": true,
  "data": {
    "totalBookings": 150,
    "statusBreakdown": [
      { "_id": "confirmed", "count": 80 },
      { "_id": "pending", "count": 25 },
      { "_id": "cancelled", "count": 45 }
    ],
    "revenue": {
      "totalRevenue": 125000,
      "averageBookingValue": 833.33
    },
    "roomTypeBreakdown": [
      { "_id": "deluxe", "count": 60 },
      { "_id": "standard", "count": 90 }
    ]
  }
}
```

## Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Booking Status Flow

1. **pending** - Initial booking status
2. **confirmed** - Booking confirmed by admin or payment received
3. **checked_in** - Guest has checked in
4. **checked_out** - Guest has checked out
5. **cancelled** - Booking cancelled
6. **no_show** - Guest didn't show up

## Payment Status Options

- **pending** - Payment not yet processed
- **paid** - Full payment received
- **partial** - Partial payment received
- **failed** - Payment failed
- **refunded** - Payment refunded

## Payment Methods

- **pay_now** - Pay immediately
- **pay_at_hotel** - Pay at hotel during check-in
- **partial** - Partial payment now, rest later

## Testing the API

You can test the API using tools like Postman, cURL, or any HTTP client. Here are some example cURL commands:

### Create a booking:

```bash
curl -X POST http://localhost:3000/api/room-bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "64fb7a7b3d2a9c9f09b33f12",
    "primaryGuest": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890"
    },
    "checkInDate": "2025-07-01",
    "checkOutDate": "2025-07-05",
    "numberOfGuests": 2,
    "paymentMethod": "pay_now"
  }'
```

### Check availability:

```bash
curl "http://localhost:3000/api/room-bookings/availability?roomId=64fb7a7b3d2a9c9f09b33f12&checkInDate=2025-07-01&checkOutDate=2025-07-05"
```

### Get all bookings (with auth):

```bash
curl -H "Authorization: Bearer your-token" \
  "http://localhost:3000/api/room-bookings?page=1&limit=10"
```

## Notes

1. All dates should be in ISO format (YYYY-MM-DD or full ISO string)
2. The booking ID is automatically generated with format: RB-YYYYMM-XXXX
3. Room availability is automatically managed when bookings are created, updated, or cancelled
4. The system prevents double-booking by checking for overlapping reservations
5. Guest capacity validation ensures bookings don't exceed room capacity
