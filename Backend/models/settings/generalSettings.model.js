import mongoose from 'mongoose';

const generalSettingsSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
    trim: true,
    default: "Parkside Plaza Hotel"
  },
  email: {
    type: String,
    required: true,
    trim: true,
    default: "info@parksideplaza.com"
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    default: "+1 (555) 123-4567"
  },
  address: {
    type: String,
    required: true,
    trim: true,
    default: "123 Park Avenue, New York, NY 10001"
  },
  timezone: {
    type: String,
    required: true,
    default: "America/New_York"
  },
  currency: {
    type: String,
    required: true,
    default: "USD"
  },
  checkInTime: {
    type: String,
    required: true,
    default: "15:00"
  },
  checkOutTime: {
    type: String,
    required: true,
    default: "11:00"
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// There should only be one settings document
generalSettingsSchema.statics.getSettings = async function() {
  const settings = await this.findOne();
  if (settings) {
    return settings;
  }
  
  // If no settings exist, create default settings
  return await this.create({});
};

const GeneralSettings = mongoose.model('GeneralSettings', generalSettingsSchema);

export default GeneralSettings;
