import mongoose from 'mongoose';

// Schema for SEO settings
const seoSettingsSchema = new mongoose.Schema({
  metaTitle: {
    type: String,
    default: "Parkside Plaza Hotel | Luxury Stay in New York"
  },
  metaDescription: {
    type: String,
    default: "Experience luxury accommodations at Parkside Plaza Hotel in the heart of New York City. Book your stay today for the best rates guaranteed."
  },
  ogImage: {
    type: String,
    default: ""
  },
  googleAnalyticsId: {
    type: String,
    default: ""
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Static method to get SEO settings or create with defaults if none exist
seoSettingsSchema.statics.getSeoSettings = async function() {
  const settings = await this.findOne();
  
  if (settings) {
    return settings;
  } else {
    // Create default settings if none exist
    return await this.create({});
  }
};

// Static method to update SEO settings
seoSettingsSchema.statics.updateSeoSettings = async function(settingsData) {
  // Find existing settings, or create if not exist
  const existingSettings = await this.findOne();
  
  if (existingSettings) {
    // Update existing settings
    Object.assign(existingSettings, settingsData, { updatedAt: new Date() });
    await existingSettings.save();
    return existingSettings;
  } else {
    // Create new settings with provided data
    return await this.create({
      ...settingsData,
      updatedAt: new Date()
    });
  }
};

const SeoSettings = mongoose.model('SeoSettings', seoSettingsSchema);

export default SeoSettings;
