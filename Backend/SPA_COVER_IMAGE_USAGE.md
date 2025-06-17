# Spa Page Cover Image Documentation

This document explains how to use the new spa page cover image functionality that has been added to your backend.

## What Was Added

1. **Database Schema Update**: Added `coverImage` field to the spa page content model
2. **New API Endpoint**: Added a dedicated endpoint for uploading spa cover images
3. **Automatic Content Update**: The cover image is automatically linked to your spa page content

## API Endpoints

### 1. Get Spa Page Content (including cover image)
```
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

### 2. Upload Spa Cover Image (Dedicated Route)
```
POST /api/content/spa/cover-image
Content-Type: multipart/form-data
```

**Request:**
- Form field name: `image`
- Supported formats: JPEG, PNG, WEBP
- Max file size: 5MB

**Response:**
```json
{
  "success": true,
  "message": "Spa cover image uploaded and updated successfully",
  "data": {
    "url": "/uploads/content/image-1234567890-123456789.jpg",
    "spaContent": {
      "_id": "...",
      "title": "Spa & Wellness",
      "coverImage": "/uploads/content/image-1234567890-123456789.jpg",
      "..."
    }
  }
}
```

### 3. Update Spa Page Content (Manual Method)
```
PUT /api/content/spa
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Spa & Wellness",
  "description": "Your spa description...",
  "coverImage": "/uploads/content/image-1234567890-123456789.jpg",
  "services": [...]
}
```

### 4. General Image Upload (Alternative Method)
```
POST /api/content/upload-image
Content-Type: multipart/form-data
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "/uploads/content/image-1234567890-123456789.jpg"
  }
}
```

## Frontend Implementation Examples

### React/JavaScript Example

```javascript
// 1. Upload Cover Image
const uploadSpaCoverImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch('/api/content/spa/cover-image', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Cover image uploaded:', result.data.url);
      // The spa content is automatically updated
      return result.data;
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// 2. Get Spa Page Content
const getSpaPageContent = async () => {
  try {
    const response = await fetch('/api/content/spa');
    const result = await response.json();
    
    if (result.success) {
      const spaContent = result.data;
      console.log('Cover image URL:', spaContent.coverImage);
      return spaContent;
    }
  } catch (error) {
    console.error('Failed to fetch spa content:', error);
  }
};

// 3. Display Cover Image in Your Component
const SpaPage = () => {
  const [spaContent, setSpaContent] = useState(null);

  useEffect(() => {
    getSpaPageContent().then(setSpaContent);
  }, []);

  return (
    <div>
      {spaContent?.coverImage && (
        <div className="spa-banner">
          <img 
            src={`http://localhost:4000${spaContent.coverImage}`} 
            alt="Spa Cover" 
            className="cover-image"
          />
          <div className="banner-content">
            <h1>{spaContent.title}</h1>
            <p>{spaContent.description}</p>
          </div>
        </div>
      )}
      
      {/* Your spa services content */}
      <div className="spa-services">
        {/* ... */}
      </div>
    </div>
  );
};
```

### HTML Form Example

```html
<!-- Simple form to upload cover image -->
<form id="coverImageForm" enctype="multipart/form-data">
  <input type="file" name="image" accept="image/*" required>
  <button type="submit">Upload Cover Image</button>
</form>

<script>
document.getElementById('coverImageForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  try {
    const response = await fetch('/api/content/spa/cover-image', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Cover image uploaded successfully!');
      console.log('Image URL:', result.data.url);
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
});
</script>
```

## File Storage

- **Storage Location**: `public/uploads/content/`
- **URL Access**: `http://localhost:4000/uploads/content/filename.jpg`
- **Filename Format**: `image-[timestamp]-[random].ext`

## Usage Workflow

1. **Upload Cover Image**: Use the dedicated `/api/content/spa/cover-image` endpoint
2. **Automatic Update**: The spa page content is automatically updated with the new cover image URL
3. **Fetch Content**: Get the spa page content which now includes the cover image URL
4. **Display**: Use the cover image URL in your frontend to display the banner

## Benefits

- **Dedicated Endpoint**: Easy to upload spa cover images specifically
- **Automatic Linking**: No need to manually update the spa content after upload
- **Consistent Storage**: All content images are stored in the same location
- **URL Generation**: Automatic URL generation for easy access

Your spa page cover image functionality is now ready to use! 