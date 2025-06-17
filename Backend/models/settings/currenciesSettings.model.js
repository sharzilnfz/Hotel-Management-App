import mongoose from 'mongoose';

// Schema for individual currencies
const currencySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  enabled: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Static method to toggle currency status
currencySchema.statics.toggleCurrency = async function(currencyCode, status) {
  // Find the currency, create if it doesn't exist
  const currency = await this.findOne({ code: currencyCode });
  
  if (currency) {
    // If status is explicitly provided, use it, otherwise toggle
    currency.enabled = status !== undefined ? status : !currency.enabled;
    currency.updatedAt = new Date();
    await currency.save();
    return currency;
  } else {
    // Create new currency with the specified status
    return await this.create({ 
      code: currencyCode, 
      enabled: status !== undefined ? status : true 
    });
  }
};

// Static method to get all currencies (or initialize with USD)
currencySchema.statics.getAllCurrencies = async function() {
  let currencies = await this.find();
  
  // If no currencies, initialize with USD enabled
  if (currencies.length === 0) {
    await this.create({ code: 'USD', enabled: true });
    currencies = await this.find();
  }
  
  return currencies;
};

// Static method to get enabled currencies
currencySchema.statics.getEnabledCurrencies = async function() {
  return await this.find({ enabled: true });
};

const Currency = mongoose.model('Currency', currencySchema);

export default Currency;
