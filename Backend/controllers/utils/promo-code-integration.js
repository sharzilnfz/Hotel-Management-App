// Helper functions for integrating promo codes with booking systems
// This file provides utility functions that can be imported and used in other controllers

import PromoCode from '../../models/promo-code/promo-code.model.js';

/**
 * Validate and apply a promo code to a booking
 * @param {string} promoCodeStr - The promo code string
 * @param {string} serviceType - Type of service (e.g., 'room', 'spa', 'event', 'restaurant')
 * @param {number} orderAmount - Original order amount
 * @param {string} customerId - Customer ID (optional)
 * @returns {object} - Validation result with discount calculation
 */
export const validateAndApplyPromoCode = async (
  promoCodeStr,
  serviceType,
  orderAmount,
  customerId = null
) => {
  try {
    // Find the promo code
    const promoCode = await PromoCode.findOne({
      code: promoCodeStr.toUpperCase(),
    });

    if (!promoCode) {
      return {
        success: false,
        error: 'Invalid promo code',
        discountAmount: 0,
        finalAmount: orderAmount,
      };
    }

    // Check if promo code is valid
    const validationResult = promoCode.isValid();
    if (!validationResult.valid) {
      return {
        success: false,
        error: validationResult.reason,
        discountAmount: 0,
        finalAmount: orderAmount,
      };
    }

    // Check if service is applicable
    if (serviceType && promoCode.applicableServices.length > 0) {
      const isApplicable = promoCode.applicableServices.some((service) => {
        return (
          service === serviceType ||
          service.startsWith('all_') ||
          serviceType.includes(service) ||
          service === `all_${serviceType}s` || // e.g., all_rooms
          service === 'all_services'
        );
      });

      if (!isApplicable) {
        return {
          success: false,
          error: 'Promo code is not applicable to this service',
          discountAmount: 0,
          finalAmount: orderAmount,
        };
      }
    }

    // Check minimum purchase amount
    if (promoCode.minPurchase && orderAmount) {
      const minAmount = parseFloat(promoCode.minPurchase.replace('$', ''));
      if (orderAmount < minAmount) {
        return {
          success: false,
          error: `Minimum purchase amount of $${minAmount} required`,
          discountAmount: 0,
          finalAmount: orderAmount,
        };
      }
    }

    // Calculate discount
    const discountAmount = promoCode.calculateDiscount(orderAmount);
    const finalAmount = Math.max(0, orderAmount - discountAmount);

    return {
      success: true,
      promoCode: {
        id: promoCode._id,
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
      },
      discountAmount,
      finalAmount,
      originalAmount: orderAmount,
    };
  } catch (error) {
    console.error('Error validating promo code:', error);
    return {
      success: false,
      error: 'Failed to validate promo code',
      discountAmount: 0,
      finalAmount: orderAmount,
    };
  }
};

/**
 * Apply promo code after successful booking (increment usage count)
 * @param {string} promoCodeStr - The promo code string
 * @param {string} customerId - Customer ID (optional)
 * @returns {object} - Result of applying the promo code
 */
export const applyPromoCodeUsage = async (promoCodeStr, customerId = null) => {
  try {
    const promoCode = await PromoCode.findOne({
      code: promoCodeStr.toUpperCase(),
    });

    if (!promoCode) {
      return { success: false, error: 'Promo code not found' };
    }

    // Increment usage count
    promoCode.usedCount += 1;
    promoCode.usageCount += 1; // Backward compatibility
    await promoCode.save();

    return {
      success: true,
      message: 'Promo code applied successfully',
      usageCount: promoCode.usedCount,
    };
  } catch (error) {
    console.error('Error applying promo code usage:', error);
    return { success: false, error: 'Failed to apply promo code usage' };
  }
};

/**
 * Example of how to integrate promo code validation in a booking controller
 * This is an example function that shows how to use the promo code utilities
 *
 * @param {object} bookingData - Booking data including promo code
 * @returns {object} - Booking result with applied discount
 */
export const exampleBookingWithPromoCode = async (bookingData) => {
  const {
    serviceType,
    originalAmount,
    promoCode: promoCodeStr,
    customerId,
    ...otherBookingData
  } = bookingData;

  let finalBookingData = {
    ...otherBookingData,
    originalAmount,
    discountAmount: 0,
    finalAmount: originalAmount,
    promoCodeApplied: null,
  };

  // If promo code is provided, validate and apply it
  if (promoCodeStr) {
    const promoResult = await validateAndApplyPromoCode(
      promoCodeStr,
      serviceType,
      originalAmount,
      customerId
    );

    if (promoResult.success) {
      finalBookingData.discountAmount = promoResult.discountAmount;
      finalBookingData.finalAmount = promoResult.finalAmount;
      finalBookingData.promoCodeApplied = promoResult.promoCode;

      // After successful booking, increment promo code usage
      await applyPromoCodeUsage(promoCodeStr, customerId);
    } else {
      // Return error if promo code validation fails
      return {
        success: false,
        error: promoResult.error,
        bookingData: finalBookingData,
      };
    }
  }

  return {
    success: true,
    bookingData: finalBookingData,
  };
};

// Usage examples for different service types:

/**
 * Room booking with promo code
 */
export const roomBookingWithPromoCode = async (bookingData) => {
  return await exampleBookingWithPromoCode({
    ...bookingData,
    serviceType: 'room',
  });
};

/**
 * Event booking with promo code
 */
export const eventBookingWithPromoCode = async (bookingData) => {
  return await exampleBookingWithPromoCode({
    ...bookingData,
    serviceType: 'event',
  });
};

/**
 * Spa service booking with promo code
 */
export const spaBookingWithPromoCode = async (bookingData) => {
  return await exampleBookingWithPromoCode({
    ...bookingData,
    serviceType: 'spa',
  });
};

/**
 * Restaurant order with promo code
 */
export const restaurantOrderWithPromoCode = async (orderData) => {
  return await exampleBookingWithPromoCode({
    ...orderData,
    serviceType: 'restaurant',
  });
};
