// API service for room bookings
const API_BASE_URL = 'http://localhost:4000/api';

interface BookingFilters {
  status?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  search?: string;
}

interface Guest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality?: string;
  idNumber?: string;
}

interface SelectedExtra {
  name: string;
  price: number;
  quantity: number;
}

interface BookingUpdateData {
  status?: string;
  paymentStatus?: string;
  specialRequests?: string;
  notes?: string;
}

interface BookingCreateData {
  roomId: string;
  primaryGuest: Guest;
  additionalGuests?: Guest[];
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  roomQuantity?: number;
  selectedExtras?: SelectedExtra[];
  discountApplied?: {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
  };
  paymentMethod: 'pay_now' | 'pay_at_hotel' | 'partial';
  specialRequests?: string;
  breakfastIncluded?: boolean;
  source?: 'website' | 'app' | 'phone' | 'walk_in' | 'admin';
}

export const bookingService = {
  // Get all bookings (admin endpoint)
  async getAllBookings(filters?: BookingFilters) {
    const token = localStorage.getItem('authToken');

    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.dateRange?.from) {
      params.append('checkInStart', filters.dateRange.from.toISOString());
    }
    if (filters?.dateRange?.to) {
      params.append('checkInEnd', filters.dateRange.to.toISOString());
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const url = `${API_BASE_URL}/room-bookings${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    console.log('Making API request to:', url);
    console.log('Auth token present:', !!token);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add auth header only if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      headers,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);

      // If it's an auth error, try without auth (in case the endpoint allows it)
      if (response.status === 401 || response.status === 403) {
        console.log('Auth failed, trying without authentication...');
        const noAuthResponse = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (noAuthResponse.ok) {
          const data = await noAuthResponse.json();
          console.log('API Response (no auth):', data);
          return data;
        }
      }

      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data;
  },

  // Get booking by ID
  async getBookingById(id: string) {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/room-bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Get booking by booking ID (public endpoint)
  async getBookingByBookingId(bookingId: string) {
    const response = await fetch(
      `${API_BASE_URL}/room-bookings/booking/${bookingId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Update booking
  async updateBooking(id: string, updateData: BookingUpdateData) {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/room-bookings/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Cancel booking
  async cancelBooking(id: string, reason?: string) {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/room-bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cancellationReason: reason }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Get booking statistics
  async getBookingStats() {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/room-bookings/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Create booking (public endpoint)
  async createBooking(bookingData: BookingCreateData) {
    const response = await fetch(`${API_BASE_URL}/room-bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
