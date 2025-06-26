
/**
 * Generate a random confirmation code
 * @param prefix Prefix for the code (e.g., R for Room, S for Spa)
 * @returns A random alphanumeric confirmation code
 */
export function generateConfirmationCode(prefix: string = "BK"): string {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

/**
 * Format a price with currency
 * @param price Price number
 * @param currency Currency symbol
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = "$"): string {
  return `${currency}${price.toFixed(2)}`;
}

/**
 * Format a date in a readable format
 * @param date Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a time in a readable format
 * @param time Time string (HH:MM format)
 * @returns Formatted time string
 */
export function formatTime(time: string): string {
  // Support both formats like "09:00" and "09:00 AM"
  if (time.includes(" ")) {
    return time; // Already formatted with AM/PM
  }
  
  const [hours, minutes] = time.split(":");
  const hoursNum = parseInt(hours);
  const period = hoursNum >= 12 ? "PM" : "AM";
  const hours12 = hoursNum % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
}

/**
 * Generate a random number of loyalty points based on booking amount
 * @param amount Booking amount
 * @returns Loyalty points earned
 */
export function calculateLoyaltyPoints(amount: number): number {
  // Basic formula: 1 point per $1 spent, rounded to nearest integer
  return Math.round(amount);
}

/**
 * Calculate discount based on promo code type and value
 * @param subtotal Booking subtotal
 * @param promoType Type of promo (percentage or fixed)
 * @param promoValue Value of the promo
 * @returns Discount amount
 */
export function calculateDiscount(subtotal: number, promoType: string, promoValue: number): number {
  if (promoType === "percentage") {
    return Math.round((subtotal * promoValue) / 100);
  } else {
    return Math.min(promoValue, subtotal); // Can't discount more than the subtotal
  }
}

/**
 * Check if a date is in the past
 * @param date Date to check
 * @returns Boolean indicating if the date is in the past
 */
export function isDateInPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if a date range is valid
 * @param checkIn Check-in date
 * @param checkOut Check-out date
 * @returns Boolean indicating if the date range is valid
 */
export function isValidDateRange(checkIn: Date, checkOut: Date): boolean {
  return checkIn < checkOut && !isDateInPast(checkIn);
}

/**
 * Get available time slots for a given date
 * @param date Date to check
 * @returns Array of available time slots
 */
export function getAvailableTimeSlots(date: Date): string[] {
  // This is a mock function - in a real app, this would query a backend
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
  ];
  
  // Simulate some slots being already booked
  const today = new Date();
  if (date.getDate() === today.getDate() && 
      date.getMonth() === today.getMonth() && 
      date.getFullYear() === today.getFullYear()) {
    
    // Remove some slots for today to simulate they're already booked
    return timeSlots.filter((_, index) => index % 3 !== 0);
  }
  
  // For future dates, randomly mark some slots as booked
  return timeSlots.filter(() => Math.random() > 0.3);
}
