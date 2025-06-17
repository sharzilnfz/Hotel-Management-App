# Page Cover Images Documentation

This document explains how to use the cover image functionality for all major pages in your hotel management system.

## Pages with Cover Image Support

✅ **Spa Page** - `/api/content/spa/cover-image`  
✅ **Rooms Page** - `/api/content/rooms/cover-image`  
✅ **Events Page** - `/api/content/events/cover-image`  
✅ **Meeting Hall Page** - `/api/content/meeting-hall/cover-image`  
✅ **Restaurant Page** - Already had cover image support

## What Was Added

1. **Database Schema Updates**: Added `coverImage` fields to spa, rooms, events, and meeting hall page content models
2. **New Meeting Hall Content System**: Created complete content management for meeting hall pages
3. **Dedicated API Endpoints**: Added specific endpoints for uploading cover images for each page type
4. **Automatic Content Update**: Cover images are automatically linked to their respective page content

## API Endpoints Overview

### Get Page Content (including cover images)
```
GET /api/content/spa          # Spa page content
GET /api/content/rooms        # Rooms page content  
GET /api/content/events       # Events page content
GET /api/content/meeting-hall # Meeting hall page content
GET /api/content/restaurant   # Restaurant page content (existing)
```

### Upload Cover Images (Dedicated Routes)
```
POST /api/content/spa/cover-image          # Upload spa cover image
POST /api/content/rooms/cover-image        # Upload rooms cover image
POST /api/content/events/cover-image       # Upload events cover image
POST /api/content/meeting-hall/cover-image # Upload meeting hall cover image
```

### Update Page Content (Manual Method)
```
PUT /api/content/spa          # Update spa content
PUT /api/content/rooms        # Update rooms content
PUT /api/content/events       # Update events content
PUT /api/content/meeting-hall # Update meeting hall content
```

## Detailed API Documentation

### 1. Spa Page

#### Get Spa Content
```http
GET /api/content/spa
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Spa & Wellness",
    "description": "Indulge in a world of relaxation...",
    "coverImage": "/uploads/content/image-1234567890-123456789.jpg",
    "services": [...],
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Upload Spa Cover Image
```http
POST /api/content/spa/cover-image
Content-Type: multipart/form-data
Form field: image
```

### 2. Rooms Page

#### Get Rooms Content
```http
GET /api/content/rooms
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "header": {
      "title": "Luxurious Rooms & Suites",
      "description": "Experience the ultimate in comfort..."
    },
    "coverImage": "/uploads/content/image-1234567890-123456789.jpg",
    "categories": [...],
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Upload Rooms Cover Image
```http
POST /api/content/rooms/cover-image
Content-Type: multipart/form-data
Form field: image
```

### 3. Events Page

#### Get Events Content
```http
GET /api/content/events
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Events & Celebrations",
    "description": "Host extraordinary events...",
    "coverImage": "/uploads/content/image-1234567890-123456789.jpg",
    "featuredEvents": [...],
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Upload Events Cover Image
```http
POST /api/content/events/cover-image
Content-Type: multipart/form-data
Form field: image
```

### 4. Meeting Hall Page

#### Get Meeting Hall Content
```http
GET /api/content/meeting-hall
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Meeting Halls & Conference Rooms",
    "description": "Host successful meetings...",
    "coverImage": "/uploads/content/image-1234567890-123456789.jpg",
    "features": [...],
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Upload Meeting Hall Cover Image
```http
POST /api/content/meeting-hall/cover-image
Content-Type: multipart/form-data
Form field: image
```

## Frontend Implementation Examples

### React Component for Any Page

```javascript
const PageWithCoverImage = ({ pageType }) => {
  const [pageContent, setPageContent] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get page content
  const getPageContent = async () => {
    try {
      const response = await fetch(`/api/content/${pageType}`);
      const result = await response.json();
      
      if (result.success) {
        setPageContent(result.data);
        return result.data;
      }
    } catch (error) {
      console.error(`Failed to fetch ${pageType} content:`, error);
    }
  };

  // Upload cover image
  const uploadCoverImage = async (imageFile) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(`/api/content/${pageType}/cover-image`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Cover image uploaded:', result.data.url);
        // Refresh page content
        await getPageContent();
        return result.data;
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    getPageContent();
  }, [pageType]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadCoverImage(file);
    }
  };

  return (
    <div>
      {/* Cover Image Banner */}
      {pageContent?.coverImage && (
        <div className="page-banner">
          <img 
            src={`http://localhost:4000${pageContent.coverImage}`} 
            alt={`${pageType} Cover`} 
            className="cover-image"
          />
          <div className="banner-content">
            <h1>{pageContent.title || pageContent.header?.title}</h1>
            <p>{pageContent.description || pageContent.header?.description}</p>
          </div>
        </div>
      )}

      {/* Upload Interface */}
      <div className="upload-section">
        <h3>Upload Cover Image</h3>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={isUploading}
        />
        {isUploading && <p>Uploading...</p>}
      </div>

      {/* Page Content */}
      <div className="page-content">
        {/* Your page-specific content here */}
      </div>
    </div>
  );
};

// Usage examples:
// <PageWithCoverImage pageType="spa" />
// <PageWithCoverImage pageType="rooms" />
// <PageWithCoverImage pageType="events" />
// <PageWithCoverImage pageType="meeting-hall" />
```

### Batch Upload Multiple Cover Images

```javascript
const uploadAllCoverImages = async (imageFiles) => {
  const pages = ['spa', 'rooms', 'events', 'meeting-hall'];
  const uploadPromises = [];

  pages.forEach((pageType, index) => {
    if (imageFiles[index]) {
      const formData = new FormData();
      formData.append('image', imageFiles[index]);
      
      uploadPromises.push(
        fetch(`/api/content/${pageType}/cover-image`, {
          method: 'POST',
          body: formData
        }).then(res => res.json())
      );
    }
  });

  try {
    const results = await Promise.all(uploadPromises);
    console.log('All uploads completed:', results);
    return results;
  } catch (error) {
    console.error('Batch upload failed:', error);
  }
};
```

### Get All Page Content

```javascript
const getAllPageContent = async () => {
  try {
    const response = await fetch('/api/content');
    const result = await response.json();
    
    if (result.success) {
      const { 
        homePage, 
        roomsPage, 
        spaPage, 
        restaurantPage, 
        eventsPage, 
        meetingHallPage,
        navigation, 
        footer 
      } = result.data;
      
      return {
        homePage,
        roomsPage,
        spaPage,
        restaurantPage,
        eventsPage,
        meetingHallPage,
        navigation,
        footer
      };
    }
  } catch (error) {
    console.error('Failed to fetch all content:', error);
  }
};
```

## CSS Example for Cover Images

```css
.page-banner {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
  padding: 2rem;
}

.banner-content h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.banner-content p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.upload-section {
  padding: 1rem;
  border: 2px dashed #ddd;
  text-align: center;
  margin: 1rem 0;
}

.upload-section input[type="file"] {
  margin-top: 0.5rem;
}
```

## File Specifications

- **Supported Formats**: JPEG, PNG, WEBP
- **Max File Size**: 5MB per image
- **Storage Location**: `public/uploads/content/`
- **URL Pattern**: `/uploads/content/image-[timestamp]-[random].[ext]`
- **Filename Pattern**: `image-[timestamp]-[random number].[extension]`

## Database Schema Overview

Each page content model now includes:

```javascript
coverImage: {
    type: String,
    default: ""
}
```

## Benefits

✅ **Dedicated Endpoints**: Easy management for each page type  
✅ **Automatic Updates**: No manual linking required  
✅ **Consistent Storage**: All images in one location  
✅ **Type Safety**: File validation and size limits  
✅ **URL Generation**: Automatic URL creation  
✅ **Unified System**: Same pattern across all pages  

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common error scenarios:
- No file uploaded
- Invalid file type
- File too large
- Database connection issues
- File system permissions

Your complete cover image system is now ready for spa, rooms, events, and meeting hall pages! 