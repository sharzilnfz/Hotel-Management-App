import SeoSettings from '../../models/settings/seoSettings.model.js';

/**
 * Get SEO settings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with SEO settings
 */
export const getSeoSettings = async (req, res) => {
  try {
    const seoSettings = await SeoSettings.getSeoSettings();
    
    return res.status(200).json({
      success: true,
      data: seoSettings
    });
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch SEO settings',
      error: error.message
    });
  }
};

/**
 * Update SEO settings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated SEO settings
 */
export const updateSeoSettings = async (req, res) => {
  try {
    const { metaTitle, metaDescription, ogImage, googleAnalyticsId } = req.body;
    
    // Validate the required fields
    if (!metaTitle) {
      return res.status(400).json({
        success: false,
        message: 'Meta title is required'
      });
    }
    
    const updatedSettings = await SeoSettings.updateSeoSettings({
      metaTitle,
      metaDescription,
      ogImage,
      googleAnalyticsId
    });
    
    return res.status(200).json({
      success: true,
      message: 'SEO settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    console.error('Error updating SEO settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update SEO settings',
      error: error.message
    });
  }
};
