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
  validUntil?: string;
  validFromTime: string;
  validToTime: string;
  status: 'Active' | 'Expired' | 'Scheduled' | 'Inactive';
  usageCount: number;
  usedCount?: number;
  usageLimit?: number;
  capacity?: string;
  applicableServices: string[];
  minPurchase?: string;
  maxDiscountCap?: string;
  newCustomersOnly: boolean;
  maxUsesPerCustomer?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePromoCodeData {
  code: string;
  discount: string;
  type: 'Percentage' | 'Fixed';
  validFrom: string;
  validTo: string;
  validFromTime: string;
  validToTime: string;
  status: 'Active' | 'Expired' | 'Scheduled' | 'Inactive';
  capacity?: string;
  applicableServices: string[];
  minPurchase?: string;
  maxDiscountCap?: string;
  newCustomersOnly: boolean;
  maxUsesPerCustomer?: string;
}

export interface ValidatePromoCodeData {
  code: string;
  serviceType?: string;
  orderAmount?: number;
  customerId?: string;
}

export interface ValidationResult {
  valid: boolean;
  promoCode?: {
    code: string;
    discountType: string;
    discountValue: number;
    discount: string;
    type: string;
  };
  discountAmount?: number;
  finalAmount?: number;
  message?: string;
}

class PromoCodeService {
  private getAuthHeaders() {
    // Add authentication headers if needed
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
      console.error('Error fetching promo codes:', error);
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to fetch promo codes'
      );
    }
  }

  async getPromoCode(id: string): Promise<PromoCode> {
    try {
      const response = await axios.get(`${API_BASE_URL}/promo-codes/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (response.data.status === 'success') {
        return {
          ...response.data.data.promoCode,
          id: response.data.data.promoCode._id,
        };
      }
      throw new Error('Failed to fetch promo code');
    } catch (error) {
      console.error('Error fetching promo code:', error);
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to fetch promo code'
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
      console.error('Error creating promo code:', error);
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to create promo code'
      );
    }
  }

  async updatePromoCode(
    id: string,
    data: Partial<CreatePromoCodeData>
  ): Promise<PromoCode> {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/promo-codes/${id}`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (response.data.status === 'success') {
        return {
          ...response.data.data.promoCode,
          id: response.data.data.promoCode._id,
        };
      }
      throw new Error('Failed to update promo code');
    } catch (error) {
      console.error('Error updating promo code:', error);
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to update promo code'
      );
    }
  }

  async deletePromoCode(id: string): Promise<void> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/promo-codes/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (response.data.status !== 'success' && response.status !== 204) {
        throw new Error('Failed to delete promo code');
      }
    } catch (error) {
      console.error('Error deleting promo code:', error);
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to delete promo code'
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
      console.error('Error validating promo code:', error);
      const axiosError = error as AxiosError<{ message?: string }>;
      return {
        valid: false,
        message:
          axiosError.response?.data?.message || 'Failed to validate promo code',
      };
    }
  }

  async applyPromoCode(code: string, customerId?: string): Promise<PromoCode> {
    try {
      const response = await axios.post(`${API_BASE_URL}/promo-codes/apply`, {
        code,
        customerId,
      });

      if (response.data.status === 'success') {
        return {
          ...response.data.data.promoCode,
          id: response.data.data.promoCode._id,
        };
      }
      throw new Error('Failed to apply promo code');
    } catch (error) {
      console.error('Error applying promo code:', error);
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to apply promo code'
      );
    }
  }
}

const promoCodeService = new PromoCodeService();
export default promoCodeService;
