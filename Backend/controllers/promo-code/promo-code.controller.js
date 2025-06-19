import PromoCode from '../../models/promo-code/promo-code.model.js';

// Get all promo codes
export const getAllPromoCodes = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const promoCodes = await PromoCode.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: promoCodes.length,
      data: {
        promoCodes,
      },
    });
  } catch (error) {
    console.error('Error getting promo codes:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get a single promo code
export const getPromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);

    if (!promoCode) {
      return res.status(404).json({
        status: 'error',
        message: 'Promo code not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        promoCode,
      },
    });
  } catch (error) {
    console.error('Error getting promo code:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Create a new promo code
export const createPromoCode = async (req, res) => {
  try {
    const formattedData = formatPromoCodeData(req.body);
    const newPromoCode = await PromoCode.create(formattedData);

    res.status(201).json({
      status: 'success',
      data: {
        promoCode: newPromoCode,
      },
    });
  } catch (error) {
    console.error('Error creating promo code:', error);

    // Handle duplicate key error (code must be unique)
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'A promo code with this code already exists',
      });
    }

    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Update a promo code
export const updatePromoCode = async (req, res) => {
  try {
    const formattedData = formatPromoCodeData(req.body);
    const updatedPromoCode = await PromoCode.findByIdAndUpdate(
      req.params.id,
      formattedData,
      { new: true, runValidators: true }
    );

    if (!updatedPromoCode) {
      return res.status(404).json({
        status: 'error',
        message: 'Promo code not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        promoCode: updatedPromoCode,
      },
    });
  } catch (error) {
    console.error('Error updating promo code:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'A promo code with this code already exists',
      });
    }

    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Delete a promo code
export const deletePromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);

    if (!promoCode) {
      return res.status(404).json({
        status: 'error',
        message: 'Promo code not found',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Validate a promo code (public endpoint for booking)
export const validatePromoCode = async (req, res) => {
  try {
    const { code, serviceType, orderAmount, customerId } = req.body;
    console.log('Validating promo code:', {
      code,
      serviceType,
      orderAmount,
      customerId,
    });

    if (!code) {
      return res.status(400).json({
        status: 'error',
        message: 'Promo code is required',
      });
    }

    // Find the promo code (case-insensitive search)
    const promoCode = await PromoCode.findOne({
      code: { $regex: new RegExp(`^${code}$`, 'i') },
    });

    console.log('Found promo code:', promoCode ? 'Yes' : 'No');
    if (promoCode) {
      console.log('Promo code details:', {
        code: promoCode.code,
        status: promoCode.status,
        validFrom: promoCode.validFrom,
        validTo: promoCode.validTo,
      });
    }

    if (!promoCode) {
      return res.status(404).json({
        status: 'error',
        message: 'Invalid promo code',
      });
    }

    // Check if promo code is valid
    const validationResult = promoCode.isValid();
    console.log('Validation result:', validationResult);

    if (!validationResult.valid) {
      return res.status(400).json({
        status: 'error',
        message: validationResult.reason,
      });
    }

    // Check if service is applicable
    if (serviceType && promoCode.applicableServices.length > 0) {
      const isApplicable = promoCode.applicableServices.some((service) => {
        return (
          service === serviceType ||
          service.startsWith('all_') ||
          serviceType.includes(service)
        );
      });

      if (!isApplicable) {
        return res.status(400).json({
          status: 'error',
          message: 'Promo code is not applicable to this service',
        });
      }
    }

    // Check minimum purchase amount
    if (promoCode.minPurchase && orderAmount) {
      const minAmount = parseFloat(promoCode.minPurchase.replace('$', ''));
      if (orderAmount < minAmount) {
        return res.status(400).json({
          status: 'error',
          message: `Minimum purchase amount of $${minAmount} required`,
        });
      }
    } // Calculate discount if order amount provided
    let discountAmount = 0;
    if (orderAmount) {
      // Use fallback calculation since method might not exist on old documents
      if (promoCode.type === 'Percentage') {
        const percentage = parseFloat(promoCode.discount.replace('%', ''));
        discountAmount = (orderAmount * percentage) / 100;

        // Apply max discount cap if set
        if (promoCode.maxDiscountCap) {
          const maxCap = parseFloat(promoCode.maxDiscountCap.replace('$', ''));
          discountAmount = Math.min(discountAmount, maxCap);
        }
      } else {
        discountAmount = parseFloat(promoCode.discount.replace('$', ''));
        discountAmount = Math.min(discountAmount, orderAmount);
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        promoCode: {
          code: promoCode.code,
          discountType:
            promoCode.discountType ||
            (promoCode.type === 'Percentage' ? 'percentage' : 'fixed'),
          discountValue:
            promoCode.discountValue ||
            parseFloat(promoCode.discount.replace(/[%$]/g, '')),
          discount: promoCode.discount,
          type: promoCode.type,
        },
        discountAmount,
        finalAmount: orderAmount ? orderAmount - discountAmount : null,
      },
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Apply promo code and increment usage count
export const applyPromoCode = async (req, res) => {
  try {
    const { code, customerId } = req.body;

    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
    });

    if (!promoCode) {
      return res.status(404).json({
        status: 'error',
        message: 'Invalid promo code',
      });
    }

    // Increment usage count
    promoCode.usedCount += 1;
    promoCode.usageCount += 1; // Backward compatibility
    await promoCode.save();

    res.status(200).json({
      status: 'success',
      message: 'Promo code applied successfully',
      data: {
        promoCode,
      },
    });
  } catch (error) {
    console.error('Error applying promo code:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Helper function to format promo code data
const formatPromoCodeData = (data) => {
  // Format dates and combine with times
  const formattedData = {
    ...data,
    validFrom: new Date(data.validFrom),
    validTo: new Date(data.validTo),
    validUntil: new Date(data.validTo || data.validUntil), // Support both field names
  };

  // Extract numeric value from discount string for new fields
  let discountValue = 0;
  let discountType = 'percentage';

  if (data.discount) {
    if (data.discount.includes('%')) {
      discountValue = parseFloat(data.discount.replace('%', ''));
      discountType = 'percentage';
    } else if (data.discount.includes('$')) {
      discountValue = parseFloat(data.discount.replace('$', ''));
      discountType = 'fixed';
    } else {
      discountValue = parseFloat(data.discount);
      discountType = data.type === 'Fixed' ? 'fixed' : 'percentage';
    }
  }

  // Set new field names
  formattedData.discountType = discountType;
  formattedData.discountValue = discountValue;

  // Format discount properly based on type for backward compatibility
  if (data.type === 'Percentage' && !data.discount.includes('%')) {
    formattedData.discount = `${data.discount}%`;
  } else if (data.type === 'Fixed' && !data.discount.includes('$')) {
    formattedData.discount = `$${data.discount}`;
  }

  // Set usage limit if capacity is provided
  if (data.capacity && !isNaN(data.capacity)) {
    formattedData.usageLimit = parseInt(data.capacity);
  }

  return formattedData;
};
