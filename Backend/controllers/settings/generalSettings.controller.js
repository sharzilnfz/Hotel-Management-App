import GeneralSettings from '../../models/settings/generalSettings.model.js';

/**
 * Get general settings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with settings
 */
export const getGeneralSettings = async (req, res) => {
  try {
    const settings = await GeneralSettings.getSettings();
    
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching general settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch general settings',
      error: error.message
    });
  }
};

/**
 * Update general settings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated settings
 */
export const updateGeneralSettings = async (req, res) => {
  try {
    const {
      hotelName,
      email,
      phone,
      address,
      timezone,
      currency,
      checkInTime,
      checkOutTime
    } = req.body;

    // Get the current settings or create if not exists
    let settings = await GeneralSettings.getSettings();
    
    // Update the settings
    settings.hotelName = hotelName || settings.hotelName;
    settings.email = email || settings.email;
    settings.phone = phone || settings.phone;
    settings.address = address || settings.address;
    settings.timezone = timezone || settings.timezone;
    settings.currency = currency || settings.currency;
    settings.checkInTime = checkInTime || settings.checkInTime;
    settings.checkOutTime = checkOutTime || settings.checkOutTime;
    settings.updatedAt = new Date();
    
    // Save the updated settings
    await settings.save();
    
    return res.status(200).json({
      success: true,
      message: 'General settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating general settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update general settings',
      error: error.message
    });
  }
};
