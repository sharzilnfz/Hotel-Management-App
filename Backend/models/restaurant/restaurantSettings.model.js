import mongoose from 'mongoose';

const restaurantSettingsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    headChef: {
      type: String,
      required: [true, 'Head chef name is required'],
      trim: true,
    },
    cuisineType: {
      type: String,
      required: [true, 'Cuisine type is required'],
      trim: true,
    },
    openingHours: {
      type: String,
      required: [true, 'Opening hours are required'],
      trim: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const RestaurantSettings = mongoose.model(
  'RestaurantSettings',
  restaurantSettingsSchema
);

export default RestaurantSettings;
