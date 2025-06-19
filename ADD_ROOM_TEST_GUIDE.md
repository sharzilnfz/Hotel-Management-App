# Add Room Functionality Test Guide

## 🧪 Testing the Add Room Feature

### Prerequisites

1. **Backend server running**: `npm run dev` in Backend folder
2. **Frontend server running**: `npm run dev` in Admin Dashboard folder
3. **MongoDB connected**: Check server logs for connection success

### Step 1: Test Backend API Directly

#### Test Room Creation Endpoint

```bash
# Test basic room creation
curl -X POST http://localhost:4000/api/rooms \
-H "Content-Type: application/json" \
-d '{
  "name": "Test Suite",
  "type": "Suite",
  "category": "luxury",
  "bedType": "King",
  "capacity": 2,
  "price": 299.99,
  "totalRooms": 5,
  "description": "A luxurious test suite for testing purposes",
  "isRefundable": true,
  "refundPolicy": "Full refund up to 48 hours before check-in",
  "breakfastIncluded": true,
  "checkInTime": "15:00",
  "checkOutTime": "11:00",
  "amenities": ["wifi", "tv", "ac"],
  "extras": [{"name": "Late checkout", "price": 25.00}],
  "payNow": true,
  "payAtHotel": true,
  "discount": {
    "name": "Early Bird",
    "type": "percentage",
    "value": 10,
    "capacity": 0,
    "active": false,
    "publishWebsite": true,
    "publishApp": true
  },
  "cancellationPolicy": "flexible",
  "publishWebsite": true,
  "publishApp": true,
  "active": true
}'
```

#### Expected Response:

```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "_id": "...",
    "name": "Test Suite"
    // ... other room data
  }
}
```

### Step 2: Test Frontend Form

#### Access the Add Room Page

1. Navigate to: `http://localhost:5173/admin/rooms/add`
2. Ensure AuthGuard allows access (should work with mock auth)

#### Fill Out the Form

1. **Basic Info**:

   - Name: "Deluxe Ocean View Suite"
   - Type: "Suite"
   - Category: "luxury"
   - Bed Type: "King"

2. **Pricing & Capacity**:

   - Capacity: 4
   - Price: 450.00
   - Total Rooms: 3

3. **Description**: "Stunning ocean view suite with premium amenities"

4. **Options**:

   - ✅ Refundable
   - ✅ Breakfast Included
   - ✅ Pay Now
   - ✅ Pay at Hotel

5. **Times**:

   - Check-in: 15:00
   - Check-out: 11:00

6. **Amenities**: Select multiple amenities

7. **Add some extras**:

   - Name: "Airport Transfer", Price: 75.00
   - Name: "Spa Package", Price: 120.00

8. **Images**: Upload some test images

### Step 3: Submit and Verify

#### Submit the Form

1. Click "Save Room" button
2. Watch browser console for any errors
3. Check server console for request details

#### Expected Success Flow:

1. Form validates successfully
2. Data is sent to backend with proper format
3. Success toast appears
4. Navigation back to rooms list
5. New room appears in the list

#### Expected Error Handling:

1. Validation errors show on form
2. Server errors display in toast
3. Form remains filled on error

### Step 4: Verify Database

#### Check MongoDB

```javascript
// In MongoDB Compass or shell
db.rooms.find({ name: 'Deluxe Ocean View Suite' });
```

#### Verify File Upload

1. Check `Backend/uploads/rooms/` folder
2. Images should be saved with unique names
3. Room record should contain image filenames

### Step 5: Test Edge Cases

#### Invalid Data

- Submit form with missing required fields
- Try negative prices
- Upload non-image files

#### Large Data

- Upload multiple large images
- Create room with many amenities
- Long descriptions

### Step 6: Frontend Integration Tests

#### Test RoomService Functions

```typescript
// In browser console or test file
import { createRoom } from '@/services/roomService';

const testRoom = {
  name: 'Test Room via Service',
  type: 'Standard',
  category: 'economy',
  bedType: 'Double',
  capacity: 2,
  price: 150.0,
  totalRooms: 10,
  description: 'Test room created via service',
  isRefundable: true,
  breakfastIncluded: false,
  checkInTime: '14:00',
  checkOutTime: '12:00',
  amenities: ['wifi'],
  extras: [],
  payNow: true,
  payAtHotel: false,
  discount: {
    name: '',
    type: 'percentage',
    value: 0,
    capacity: 0,
    active: false,
    publishWebsite: true,
    publishApp: true,
  },
  cancellationPolicy: 'moderate',
  publishWebsite: true,
  publishApp: true,
  active: true,
};

createRoom(testRoom).then(console.log).catch(console.error);
```

## 🐛 Common Issues & Solutions

### Backend Issues

1. **Multer Upload Errors**

   - Check file permissions on uploads folder
   - Verify file types are allowed
   - Check file size limits

2. **MongoDB Connection**

   - Verify MONGO_URI in .env
   - Check network connectivity
   - Ensure database exists

3. **CORS Issues**
   - Check server.js CORS configuration
   - Verify frontend URL is allowed

### Frontend Issues

1. **Form Validation**

   - Check Zod schema matches backend expectations
   - Verify all required fields are included

2. **File Upload**

   - Ensure FormData is properly constructed
   - Check Content-Type header

3. **Navigation Issues**
   - Verify React Router setup
   - Check protected route configuration

### Network Issues

1. **API Connection**
   - Verify backend is running on port 4000
   - Check frontend API_URL configuration
   - Test with browser dev tools Network tab

## ✅ Success Criteria

- [ ] Backend accepts room data via POST /api/rooms
- [ ] Images upload successfully to uploads/rooms folder
- [ ] Room data saves to MongoDB with all fields
- [ ] Frontend form validates properly
- [ ] Success/error messages display correctly
- [ ] Navigation works after successful creation
- [ ] AuthGuard protects the route
- [ ] File uploads work with drag & drop
- [ ] All form fields save correctly

## 📋 Test Checklist

### Backend API Tests

- [ ] POST /api/rooms creates room
- [ ] GET /api/rooms returns all rooms
- [ ] GET /api/rooms/:id returns specific room
- [ ] PUT /api/rooms/:id updates room
- [ ] DELETE /api/rooms/:id deletes room
- [ ] File upload handles multiple images
- [ ] Authentication middleware works

### Frontend Tests

- [ ] Form loads without errors
- [ ] All input types work correctly
- [ ] Form validation displays errors
- [ ] File upload interface works
- [ ] Image preview displays
- [ ] Submit button calls API
- [ ] Success handling works
- [ ] Error handling works
- [ ] AuthGuard allows access

### Integration Tests

- [ ] End-to-end room creation works
- [ ] Data consistency between frontend/backend
- [ ] File uploads save correctly
- [ ] Room appears in rooms list after creation

## 🔧 Debugging Tips

1. **Enable detailed logging**:

   ```javascript
   // In roomService.ts
   console.log('Form data being sent:', formData);

   // In room.controller.js
   console.log('Received data:', req.body);
   ```

2. **Check network requests**:

   - Open browser dev tools
   - Go to Network tab
   - Monitor API calls

3. **Verify file structure**:

   ```bash
   # Check uploads folder
   ls -la Backend/uploads/rooms/

   # Check permissions
   chmod 755 Backend/uploads/rooms/
   ```

4. **MongoDB debugging**:
   ```javascript
   // Check recent rooms
   db.rooms.find().sort({ _id: -1 }).limit(5);
   ```

This comprehensive test guide will help you verify that your Add Room functionality is working correctly from frontend to backend!
