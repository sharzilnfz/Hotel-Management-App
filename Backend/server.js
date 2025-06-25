import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import mongose_connect from './db/connection.js';
import availabilityRoutes from './routes/availability/availability.routes.js';
import contentRoutes from './routes/content-management/content.routes.js';
import eventRoutes from './routes/events/event.routes.js';
import houseKeepingScheduleRoutes from './routes/house-keeping/schedule.routes.js';
import houseKeepingStaffRoutes from './routes/house-keeping/staff.routes.js';
import houseKeepingSupplyRoutes from './routes/house-keeping/supply.routes.js';
import houseKeepingTaskRoutes from './routes/house-keeping/task.routes.js';
import loyaltyRoutes from './routes/loyalty/loyalty.routes.js';
import meetingHallRoutes from './routes/meeting-hall/meeting-hall.routes.js';
import promoCodeRoutes from './routes/promo-code/promo-code.routes.js';
import menuCategoryRoutes from './routes/restaurant/menuCategory.routes.js';
import menuItemRoutes from './routes/restaurant/menuItem.routes.js';
import restaurantSettingsRoutes from './routes/restaurant/restaurantSettings.routes.js';
import tableRoutes from './routes/restaurant/table.routes.js';
import roomBookingRoutes from './routes/rooms/room-booking.routes.js';
import roomRoutes from './routes/rooms/room.routes.js';
import appearanceSettingsRoutes from './routes/settings/appearanceSettings.routes.js';
import currenciesRoutes from './routes/settings/currenciesSettings.routes.js';
import generalSettingsRoutes from './routes/settings/generalSettings.routes.js';
import notificationsRoutes from './routes/settings/notificationsSettings.routes.js';
import platformVisibilityRoutes from './routes/settings/platformVisibilitySettings.routes.js';
import seoSettingsRoutes from './routes/settings/seoSettings.routes.js';
import categoryRoutes from './routes/spa/category.routes.js';
import serviceRoutes from './routes/spa/service.routes.js';
import specialistRoutes from './routes/spa/specialist.routes.js';
import accessLevelRoutes from './routes/staff/accessLevel.routes.js';
import departmentRoutes from './routes/staff/department.routes.js';
import roleRoutes from './routes/staff/role.routes.js';
import staffRoutes from './routes/staff/staff.routes.js';
import userRoutes from './routes/user/user.routes.js';
import stripeRoutes from './routes/utils/stripeRoutes.js';

// Load environment variables
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in environment variables');
  process.exit(1);
}

dotenv.config();

// Create Express App
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:8081',
      'http://localhost:8080',
      'http://localhost:3000',
      'http://localhost:4000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);
app.use(express.json());

// Log all requests and their bodies for debugging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Static File Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, 'uploads');
const publicUploadPath = path.join(__dirname, 'public', 'uploads');
console.log('Static files directory:', uploadPath);
console.log('Public uploads directory:', publicUploadPath);

// Define upload directories
const uploadsDir = path.join(__dirname, 'uploads');
const contentUploadsDir = path.join(__dirname, 'uploads', 'content');
const publicUploadsDir = path.join(__dirname, 'public', 'uploads');
const publicContentUploadsDir = path.join(
  __dirname,
  'public',
  'uploads',
  'content'
);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(contentUploadsDir)) {
  fs.mkdirSync(contentUploadsDir, { recursive: true });
}

if (!fs.existsSync(publicUploadsDir)) {
  fs.mkdirSync(publicUploadsDir, { recursive: true });
}

if (!fs.existsSync(publicContentUploadsDir)) {
  fs.mkdirSync(publicContentUploadsDir, { recursive: true });
}

// Add middleware to log static file requests and serve from both upload directories
app.use('/uploads', (req, res, next) => {
  console.log(`[STATIC] Requested: ${req.url}`);
  next();
});

// Serve files from public/uploads directory (for content management uploads like hero images)
app.use('/uploads', express.static(publicUploadPath));

// Serve files from uploads directory (for other uploads)
app.use('/uploads', express.static(uploadPath));

// Add a test endpoint to check if uploads are accessible
app.get('/test-uploads', (req, res) => {
  // List files in both upload directories
  const files = fs.existsSync(uploadPath) ? fs.readdirSync(uploadPath) : [];
  const publicFiles = fs.existsSync(publicUploadPath)
    ? fs.readdirSync(publicUploadPath)
    : [];
  res.json({
    message: 'Upload directories contents',
    uploads: {
      files,
      path: uploadPath,
    },
    publicUploads: {
      files: publicFiles,
      path: publicUploadPath,
    },
  });
});

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/room-bookings', roomBookingRoutes);
app.use('/api/specialists', specialistRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/spa/services', serviceRoutes);
app.use('/api/restaurant/tables', tableRoutes);
app.use('/api/restaurant/menu-items', menuItemRoutes);
app.use('/api/restaurant/menu-categories', menuCategoryRoutes);
app.use('/api/restaurant/settings', restaurantSettingsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/access-levels', accessLevelRoutes);
app.use('/api/house-keeping/staff', houseKeepingStaffRoutes);
app.use('/api/house-keeping/tasks', houseKeepingTaskRoutes);
app.use('/api/house-keeping/supplies', houseKeepingSupplyRoutes);
app.use('/api/house-keeping/schedules', houseKeepingScheduleRoutes);
app.use('/api/meeting-hall', meetingHallRoutes);
app.use('/api', promoCodeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/general-settings', generalSettingsRoutes);
app.use('/api/currencies', currenciesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/platform-visibility', platformVisibilityRoutes);
app.use('/api/seo-settings', seoSettingsRoutes);
app.use('/api/appearance-settings', appearanceSettingsRoutes);
app.use('/api/stripe', stripeRoutes);

// Test route
app.get('/', async (req, res) => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    for (const collection of collections) {
      console.log(collection.name + '--------');
    }
    res.send('Hello World');
  } catch (err) {
    console.error('Failed to list collections:', err);
    res.status(500).json({ error: 'Could not fetch collections' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongose_connect();
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 4000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
