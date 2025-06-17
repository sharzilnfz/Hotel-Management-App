import mongoose from 'mongoose';

// Schema for platform visibility settings
const platformVisibilitySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  enabled: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['web', 'app', 'feature'],
    default: 'feature'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Static method to toggle platform visibility status
platformVisibilitySchema.statics.togglePlatformVisibility = async function(platformKey, status) {
  // Find the platform, create if it doesn't exist
  const platform = await this.findOne({ key: platformKey });
  
  if (platform) {
    // If status is explicitly provided, use it, otherwise toggle
    platform.enabled = status !== undefined ? status : !platform.enabled;
    platform.updatedAt = new Date();
    await platform.save();
    return platform;
  } else {
    // Create new platform with the specified status
    return await this.create({ 
      key: platformKey, 
      enabled: status !== undefined ? status : true,
      category: getCategoryFromKey(platformKey)
    });
  }
};

// Static method to get all platform visibility settings (or initialize with defaults)
platformVisibilitySchema.statics.getAllPlatformVisibilities = async function() {
  let platforms = await this.find();
  
  // If no platforms, initialize with defaults
  if (platforms.length === 0) {
    const defaultPlatforms = [
      { key: 'loyaltyProgramWeb', enabled: true, category: 'web' },
      { key: 'loyaltyProgramApp', enabled: true, category: 'app' },
      { key: 'restaurantFeaturesWeb', enabled: true, category: 'web' },
      { key: 'restaurantFeaturesApp', enabled: true, category: 'app' },
      { key: 'eventAddonsWeb', enabled: true, category: 'web' },
      { key: 'eventAddonsApp', enabled: true, category: 'app' }
    ];
    
    await this.insertMany(defaultPlatforms);
    platforms = await this.find();
  }
  
  return platforms;
};

// Static method to get platforms by category
platformVisibilitySchema.statics.getPlatformsByCategory = async function(category) {
  return await this.find({ category });
};

// Helper function to determine category from platform key
function getCategoryFromKey(key) {
  if (key.endsWith('Web')) {
    return 'web';
  } else if (key.endsWith('App')) {
    return 'app';
  } else {
    return 'feature';
  }
}

const PlatformVisibility = mongoose.model('PlatformVisibility', platformVisibilitySchema);

export default PlatformVisibility;
