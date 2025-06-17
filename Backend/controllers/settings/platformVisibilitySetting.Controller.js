import PlatformVisibility from '../../models/settings/platformVisibilitySettings.model.js';

/**
 * Get all platform visibility settings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with platform visibility settings
 */
export const getAllPlatformVisibilities = async (req, res) => {
  try {
    const platforms = await PlatformVisibility.getAllPlatformVisibilities();
    
    // Convert to object with platform key as key and enabled status as value
    const platformsObj = {};
    platforms.forEach(platform => {
      platformsObj[platform.key] = platform.enabled;
    });
    
    return res.status(200).json({
      success: true,
      data: {
        platforms: platformsObj
      }
    });
  } catch (error) {
    console.error('Error fetching platform visibility settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch platform visibility settings',
      error: error.message
    });
  }
};

/**
 * Toggle a platform's visibility status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated platform visibility
 */
export const togglePlatformVisibility = async (req, res) => {
  try {
    const { platformKey } = req.params;
    
    // Toggle the platform visibility (or create if it doesn't exist)
    const platform = await PlatformVisibility.togglePlatformVisibility(platformKey);
    
    // Get all platforms to return the complete list
    const platforms = await PlatformVisibility.getAllPlatformVisibilities();
    const platformsObj = {};
    platforms.forEach(plat => {
      platformsObj[plat.key] = plat.enabled;
    });
    
    return res.status(200).json({
      success: true,
      message: `Platform ${platformKey} has been ${platform.enabled ? 'enabled' : 'disabled'}`,
      data: {
        platforms: platformsObj
      }
    });
  } catch (error) {
    console.error('Error toggling platform visibility:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle platform visibility',
      error: error.message
    });
  }
};

/**
 * Update multiple platform visibility settings at once
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated platform visibility settings
 */
export const updatePlatformVisibilities = async (req, res) => {
  try {
    const { platforms } = req.body;
    
    if (!platforms || typeof platforms !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid platform visibility data'
      });
    }
    
    // Update each platform
    const updatePromises = Object.entries(platforms).map(([key, enabled]) => 
      PlatformVisibility.togglePlatformVisibility(key, Boolean(enabled))
    );
    
    await Promise.all(updatePromises);
    
    // Get all platforms after update
    const platformsFromDb = await PlatformVisibility.getAllPlatformVisibilities();
    const platformsObj = {};
    platformsFromDb.forEach(platform => {
      platformsObj[platform.key] = platform.enabled;
    });
    
    return res.status(200).json({
      success: true,
      message: 'Platform visibility settings updated successfully',
      data: {
        platforms: platformsObj
      }
    });
  } catch (error) {
    console.error('Error updating platform visibility settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update platform visibility settings',
      error: error.message
    });
  }
};
