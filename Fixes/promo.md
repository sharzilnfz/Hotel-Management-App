# 🔧 **Complete Developer Guide: How the Promo Code System Works**

## System Architecture Overview

The promo code system follows a clean layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                         │
│  React Components → Service Layer → HTTP Requests          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend Layer                          │
│  Routes → Middleware → Controllers → Models → Database     │
└─────────────────────────────────────────────────────────────┘
```

## 📁 **Backend Implementation**

### 1. **Database Model** (`Backend/models/promo-code/promo-code.model.js`)

The model defines the promo code schema with validation, middleware, and instance methods:

```javascript
import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Code is required'],
    unique: true,
    trim: true,
    minlength: 3,
    uppercase: true, // Automatically converts to uppercase
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Discount type is required'],
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value must be positive'],
  },
  // ... other fields ...
});

// Pre-save middleware to sync fields and update timestamps
promoCodeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  // Ensure code is uppercase
  if (this.code) {
    this.code = this.code.toUpperCase();
  }

  // Sync new and old field names for backward compatibility
  if (this.discountType && !this.type) {
    this.type = this.discountType === 'percentage' ? 'Percentage' : 'Fixed';
  }

  next();
});

// Instance method to check if promo code is valid
promoCodeSchema.methods.isValid = function () {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

  // Check status
  if (this.status !== 'Active') {
    return { valid: false, reason: 'Promo code is not active' };
  }

  // Check date range
  if (now < this.validFrom || now > this.validUntil) {
    return { valid: false, reason: 'Promo code has expired or not yet valid' };
  }

  // Check time range
  if (currentTime < this.validFromTime || currentTime > this.validToTime) {
    return { valid: false, reason: 'Promo code is not valid at this time' };
  }

  // Check usage limit
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, reason: 'Promo code usage limit reached' };
  }

  return { valid: true };
};

// Instance method to calculate discount
promoCodeSchema.methods.calculateDiscount = function (originalAmount) {
  if (this.discountType === 'percentage') {
    let discountAmount = (originalAmount * this.discountValue) / 100;

    // Apply max discount cap if set
    if (this.maxDiscountCap) {
      const maxCap = parseFloat(this.maxDiscountCap.replace('$', ''));
      discountAmount = Math.min(discountAmount, maxCap);
    }

    return discountAmount;
  } else {
    // Fixed discount
    return Math.min(this.discountValue, originalAmount);
  }
};

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);
export default PromoCode;
```

### 2. **Controller Logic** (`Backend/controllers/promo-code/promo-code.controller.js`)

The controller handles all business logic for promo code operations:

```javascript
import PromoCode from '../../models/promo-code/promo-code.model.js';

// Create a new promo code
export const createPromoCode = async (req, res) => {
  try {
    const formattedData = formatPromoCodeData(req.body);
    const newPromoCode = await PromoCode.create(formattedData);

    res.status(201).json({
      status: 'success',
      data: { promoCode: newPromoCode },
    });
  } catch (error) {
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

// Validate a promo code (public endpoint for booking)
export const validatePromoCode = async (req, res) => {
  try {
    const { code, serviceType, orderAmount, customerId } = req.body;

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

    if (!promoCode) {
      return res.status(404).json({
        status: 'error',
        message: 'Invalid promo code',
      });
    }

    // Check if promo code is valid
    const validationResult = promoCode.isValid();

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
    }

    // Calculate discount
    let discountAmount = 0;
    if (orderAmount) {
      // Calculate based on discount type
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
          discountType: promoCode.discountType,
          discountValue: promoCode.discountValue,
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

// Helper function to format promo code data
const formatPromoCodeData = (data) => {
  const formattedData = {
    ...data,
    validFrom: new Date(data.validFrom),
    validTo: new Date(data.validTo),
    validUntil: new Date(data.validTo || data.validUntil),
  };

  // Extract numeric value from discount string
  let discountValue = 0;
  let discountType = 'percentage';

  if (data.discount) {
    if (data.discount.includes('%')) {
      discountValue = parseFloat(data.discount.replace('%', ''));
      discountType = 'percentage';
    } else if (data.discount.includes('$')) {
      discountValue = parseFloat(data.discount.replace('$', ''));
      discountType = 'fixed';
    }
  }

  formattedData.discountType = discountType;
  formattedData.discountValue = discountValue;

  // Set usage limit if capacity is provided
  if (data.capacity && !isNaN(data.capacity)) {
    formattedData.usageLimit = parseInt(data.capacity);
  }

  return formattedData;
};
```

### 3. **Routes Configuration** (`Backend/routes/promo-code/promo-code.routes.js`)

Routes define the API endpoints with proper middleware:

```javascript
import express from 'express';
import * as promoCodeController from '../../controllers/promo-code/promo-code.controller.js';
import { verifyToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Public routes for validating and applying promo codes (used during booking)
router.post('/promo-codes/validate', promoCodeController.validatePromoCode);
router.post('/promo-codes/apply', promoCodeController.applyPromoCode);

// Protected admin routes (require authentication)
router
  .route('/promo-codes')
  .get(verifyToken, promoCodeController.getAllPromoCodes)
  .post(verifyToken, promoCodeController.createPromoCode);

router
  .route('/promo-codes/:id')
  .get(verifyToken, promoCodeController.getPromoCode)
  .patch(verifyToken, promoCodeController.updatePromoCode)
  .delete(verifyToken, promoCodeController.deletePromoCode);

export default router;
```

### 4. **Integration Utilities** (`Backend/controllers/utils/promo-code-integration.js`)

Utility functions for seamless integration with booking systems:

```javascript
import PromoCode from '../../models/promo-code/promo-code.model.js';

/**
 * Validate and apply a promo code to a booking
 * This is the main function used by other controllers
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

    // Check service applicability
    if (serviceType && promoCode.applicableServices.length > 0) {
      const isApplicable = promoCode.applicableServices.some((service) => {
        return (
          service === serviceType ||
          service.startsWith('all_') ||
          serviceType.includes(service) ||
          service === `all_${serviceType}s`
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

    // Calculate discount using the model method
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
 * Example integration in booking controller
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
```

## 🎨 **Frontend Implementation**

### 1. **Service Layer** (`Admin Dashboard/src/services/promoCodeService.ts`)

The service layer handles all API communications:

```typescript
import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

export interface PromoCode {
  _id?: string;
  id?: string;
  code: string;
  discount: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  type: 'Percentage' | 'Fixed';
  validFrom: string;
  validTo: string;
  validFromTime: string;
  validToTime: string;
  status: 'Active' | 'Expired' | 'Scheduled' | 'Inactive';
  usageCount: number;
  usageLimit?: number;
  applicableServices: string[];
  minPurchase?: string;
  maxDiscountCap?: string;
  newCustomersOnly: boolean;
  maxUsesPerCustomer?: string;
}

class PromoCodeService {
  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      // Add authorization header when implementing proper auth
    };
  }

  async getAllPromoCodes(status?: string): Promise<PromoCode[]> {
    try {
      const params = status ? { status } : {};
      const response = await axios.get(`${API_BASE_URL}/promo-codes`, {
        headers: this.getAuthHeaders(),
        params,
      });

      if (response.data.status === 'success') {
        return response.data.data.promoCodes.map((code: PromoCode) => ({
          ...code,
          id: code._id,
        }));
      }
      throw new Error('Failed to fetch promo codes');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to fetch promo codes'
      );
    }
  }

  async createPromoCode(data: CreatePromoCodeData): Promise<PromoCode> {
    try {
      const response = await axios.post(`${API_BASE_URL}/promo-codes`, data, {
        headers: this.getAuthHeaders(),
      });

      if (response.data.status === 'success') {
        return {
          ...response.data.data.promoCode,
          id: response.data.data.promoCode._id,
        };
      }
      throw new Error('Failed to create promo code');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to create promo code'
      );
    }
  }

  async validatePromoCode(
    data: ValidatePromoCodeData
  ): Promise<ValidationResult> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/promo-codes/validate`,
        data
      );

      if (response.data.status === 'success') {
        return {
          valid: true,
          ...response.data.data,
        };
      }
      throw new Error('Failed to validate promo code');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return {
        valid: false,
        message:
          axiosError.response?.data?.message || 'Failed to validate promo code',
      };
    }
  }

  // ... other methods (update, delete, etc.)
}

const promoCodeService = new PromoCodeService();
export default promoCodeService;
```

### 2. **React Components** (`Admin Dashboard/src/components/Admin/PromoCode/`)

#### **Complete Component** (`PromoCodeContent.tsx`)

This single component handles the entire promo code management interface, including:

- Table view of all promo codes
- Create/Edit forms with full validation
- Delete confirmation dialogs
- Search and filtering functionality

**Key Features:**

- **Complete CRUD Interface**: All operations in one component
- **Form Validation**: Uses Zod schema for client-side validation
- **Real-time Updates**: Refreshes data after operations
- **Error Handling**: Comprehensive error messages
- **Loading States**: Shows loading indicators during operations
- **Responsive Design**: Works on different screen sizes
- **Service Integration**: Uses the service layer for API calls

```tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import promoCodeService, { type PromoCode } from '@/services/promoCodeService';

const PromoCodeContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch promo codes from the API
  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const codes = await promoCodeService.getAllPromoCodes();
      setPromoCodes(codes);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to fetch promo codes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreatePromoCodeData) => {
    try {
      setLoading(true);
      await promoCodeService.createPromoCode(data);
      toast({
        title: 'Success',
        description: 'Promo code created successfully',
      });
      await fetchPromoCodes(); // Refresh the list
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to create promo code',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<CreatePromoCodeData>
  ) => {
    try {
      setLoading(true);
      await promoCodeService.updatePromoCode(id, data);
      toast({
        title: 'Success',
        description: 'Promo code updated successfully',
      });
      await fetchPromoCodes(); // Refresh the list
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update promo code',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await promoCodeService.deletePromoCode(id);
      toast({
        title: 'Success',
        description: 'Promo code deleted successfully',
      });
      await fetchPromoCodes(); // Refresh the list
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to delete promo code',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter promo codes based on search query
  const filteredPromoCodes = promoCodes.filter(
    (code) =>
      code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Promo Codes</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Promo Code
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4" />
        <Input
          placeholder="Search promo codes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Promo Codes Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Valid Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPromoCodes.map((promoCode) => (
              <TableRow key={promoCode.id}>
                <TableCell className="font-medium">{promoCode.code}</TableCell>
                <TableCell>{promoCode.discount}</TableCell>
                <TableCell>
                  {format(parseISO(promoCode.validFrom), 'MMM dd, yyyy')} -
                  {format(parseISO(promoCode.validTo), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      promoCode.status === 'Active' ? 'default' : 'secondary'
                    }
                  >
                    {promoCode.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {promoCode.usageCount || 0}
                  {promoCode.usageLimit ? ` / ${promoCode.usageLimit}` : ''}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPromoCode(promoCode);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPromoCode(promoCode);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit/Delete Dialogs */}
      {/* ... Dialog components for CRUD operations ... */}
    </div>
  );
};

export default PromoCodeContent;
```

## 🎯 **Simplified Component Architecture**

The promo code system uses a **single-component architecture** for the frontend:

### **Why One Component?**

1. **Simplicity**: All related functionality in one place
2. **State Management**: Easier to share state between table, forms, and dialogs
3. **Maintainability**: Fewer files to manage and debug
4. **Performance**: No unnecessary component re-renders
5. **Developer Experience**: Everything related to promo codes is in one file

### **Component Structure:**

```
PromoCodeContent.tsx
├── State Management (promoCodes, loading, dialogs)
├── API Integration (fetch, create, update, delete)
├── Table View (display promo codes)
├── Search & Filter (real-time filtering)
├── Add Dialog (create new promo codes)
├── Edit Dialog (modify existing promo codes)
└── Delete Dialog (confirmation for deletion)
```

### **Benefits of This Approach:**

- **Single Source of Truth**: All promo code data managed in one component
- **Consistent UI**: All modals and forms follow the same design patterns
- **Easy Testing**: One component to test all functionality
- **Quick Development**: No need to manage props between components
- **Better Performance**: No prop drilling or unnecessary re-renders

## Support

For questions or issues with the promo code system, please refer to the main project documentation or contact the development team.
