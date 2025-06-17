import Currency from '../../models/settings/currenciesSettings.model.js';

/**
 * Get all currencies with their status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with currencies
 */
export const getAllCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.getAllCurrencies();
    
    // Convert to object with currency code as key and enabled status as value
    const currenciesObj = {};
    currencies.forEach(currency => {
      currenciesObj[currency.code] = currency.enabled;
    });
    
    return res.status(200).json({
      success: true,
      data: {
        currencies: currenciesObj,
        defaultCurrency: 'USD' // Hardcoded for now, could be made dynamic
      }
    });
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch currencies',
      error: error.message
    });
  }
};

/**
 * Toggle a currency's enabled status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated currency
 */
export const toggleCurrency = async (req, res) => {
  try {
    const { currencyCode } = req.params;
    
    // Toggle the currency (or create if it doesn't exist)
    const currency = await Currency.toggleCurrency(currencyCode);
    
    // Get all currencies to return the complete list
    const currencies = await Currency.getAllCurrencies();
    const currenciesObj = {};
    currencies.forEach(curr => {
      currenciesObj[curr.code] = curr.enabled;
    });
    
    return res.status(200).json({
      success: true,
      message: `Currency ${currencyCode} has been ${currency.enabled ? 'enabled' : 'disabled'}`,
      data: {
        currencies: currenciesObj,
        defaultCurrency: 'USD' // Could be dynamic
      }
    });
  } catch (error) {
    console.error('Error toggling currency:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle currency',
      error: error.message
    });
  }
};

/**
 * Update multiple currencies at once
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated currencies
 */
export const updateCurrencies = async (req, res) => {
  try {
    const { currencies } = req.body;
    
    if (!currencies || typeof currencies !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid currencies data'
      });
    }
    
    // Update each currency
    const updatePromises = Object.entries(currencies).map(([code, enabled]) => 
      Currency.toggleCurrency(code, Boolean(enabled))
    );
    
    await Promise.all(updatePromises);
    
    // Get all currencies after update
    const updatedCurrencies = await Currency.getAllCurrencies();
    const currenciesObj = {};
    updatedCurrencies.forEach(currency => {
      currenciesObj[currency.code] = currency.enabled;
    });
    
    return res.status(200).json({
      success: true,
      message: 'Currencies updated successfully',
      data: {
        currencies: currenciesObj,
        defaultCurrency: 'USD' // Could be dynamic
      }
    });
  } catch (error) {
    console.error('Error updating currencies:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update currencies',
      error: error.message
    });
  }
};
