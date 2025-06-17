import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the uploads directory path
const uploadsDir = path.join(__dirname, '../uploads/content');

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory:', uploadsDir);
} else {
    console.log('Uploads directory already exists:', uploadsDir);
} 