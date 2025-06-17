import { useState, useEffect, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Minus, Calendar as CalendarIcon } from "lucide-react";
import { format, addMonths, subMonths, parseISO, isSameDay, addDays, subDays, isBefore, isAfter, eachDayOfInterval } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

// Types for availability tracking
type ServiceType = "room" | "spa" | "restaurant" | "specialist";
type AvailabilityRecord = {
  date: Date;
  available: number;
  total: number;
  bookings: number;
};

type AvailabilityMap = Record<string, AvailabilityRecord>;

interface AvailabilityCalendarProps {
  serviceType: ServiceType;
  initialCapacity: number;
  name: string;
  serviceId?: string; // Optional since we're keeping the original design that doesn't use serviceId
}

// Use environment variable or fallback for API URL
const API_URL = "http://localhost:4000/api";

const AvailabilityCalendar = ({ serviceType, initialCapacity, name, serviceId }: AvailabilityCalendarProps) => {
  // Set initial date state using a dynamic current date instead of hardcoded value
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(() => new Date());
  const [availabilityData, setAvailabilityData] = useState<AvailabilityMap>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [selectedDateAvailability, setSelectedDateAvailability] = useState<AvailabilityRecord>({
    date: new Date(),
    available: initialCapacity,
    total: initialCapacity,
    bookings: 0
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [isDateRangeMode, setIsDateRangeMode] = useState<boolean>(false);
  const [bulkUpdateAction, setBulkUpdateAction] = useState<string>("block");
  const [customAvailability, setCustomAvailability] = useState<string>(initialCapacity.toString());
  const [directAvailabilityInput, setDirectAvailabilityInput] = useState<string>(initialCapacity.toString());

  // Get date key in yyyy-MM-dd format
  const getDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

  // Fetch availability data for the current month
  const fetchAvailabilityData = useCallback(async () => {
    // If serviceId is not provided, use mock data
    if (!serviceId) {
      generateMockData();
      return;
    }

    try {
      setIsLoading(true);
      const monthNumber = month.getMonth() + 1; // JavaScript months are 0-indexed
      const yearNumber = month.getFullYear();

      const response = await axios.get(`${API_URL}/availability/${serviceType}/${serviceId}`, {
        params: { month: monthNumber, year: yearNumber }
      });

      if (response.data.success) {
        setAvailabilityData(response.data.data.availability || {});
      } else {
        console.error('Error in response:', response.data);
        // Use mock data with full availability instead of random availability
        generateMockData();
      }
    } catch (error) {
      console.error('Error fetching availability data:', error);
      // Use mock data with full availability instead of random availability
      generateMockData();
    } finally {
      setIsLoading(false);
    }
  }, [month, serviceId, serviceType, initialCapacity]);

  // Generate mock data for the current month
  const generateMockData = useCallback(() => {
    const mockData: AvailabilityMap = {};
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(month.getFullYear(), month.getMonth(), day);
      const key = getDateKey(currentDate);

      // Set all rooms as available instead of random values
      mockData[key] = {
        date: currentDate,
        available: initialCapacity,
        total: initialCapacity,
        bookings: 0
      };
    }

    setAvailabilityData(mockData);
  }, [month, initialCapacity]);

  // Get availability for a specific date
  const getAvailability = useCallback((day: Date): AvailabilityRecord => {
    const key = getDateKey(day);

    if (availabilityData[key]) {
      return availabilityData[key];
    }

    // Return default values if no data exists for this date - all rooms available
    return {
      date: day,
      available: initialCapacity,
      total: initialCapacity,
      bookings: 0
    };
  }, [availabilityData, initialCapacity]);

  // Effect to fetch data when month changes or when initialCapacity or serviceId changes
  useEffect(() => {
    fetchAvailabilityData();
  }, [fetchAvailabilityData]);

  // Force synchronization between selectedDate and selectedDateAvailability
  useEffect(() => {
    // Update the details panel whenever selectedDate changes
    const availability = getAvailability(selectedDate);

    setSelectedDateAvailability({
      date: new Date(selectedDate.getTime()),
      total: availability.total,
      available: availability.available,
      bookings: availability.bookings
    });
    
    // Update the direct input field to match the selected date availability
    setDirectAvailabilityInput(availability.available.toString());
  }, [selectedDate, getAvailability]);

  // Update the selected date availability when selectedDate or availability data changes
  useEffect(() => {
    // Only update if availabilityData changes and it affects the current selected date
    const currentDateKey = getDateKey(selectedDate);
    if (availabilityData[currentDateKey]) {
      const currentAvailability = availabilityData[currentDateKey];
      setSelectedDateAvailability({
        date: new Date(selectedDate.getTime()),
        total: currentAvailability.total,
        available: currentAvailability.available,
        bookings: currentAvailability.bookings
      });
      
      // Update the direct input field
      setDirectAvailabilityInput(currentAvailability.available.toString());
    }
  }, [availabilityData, selectedDate]);

  // Update local state for + and - buttons
  const updateLocalCount = (change: number) => {
    const newAvailable = selectedDateAvailability.available + change;

    // Ensure we can't go below 0 or above total
    const updatedAvailable = Math.max(0, Math.min(initialCapacity, newAvailable));

    // Only update local UI state, don't send to server
    setSelectedDateAvailability(prev => ({
      ...prev,
      available: updatedAvailable,
      bookings: prev.total - updatedAvailable
    }));
    
    // Update the direct input field to match
    setDirectAvailabilityInput(updatedAvailable.toString());
  };

  // Only update server when explicitly submitting
  const submitAvailabilityUpdate = async () => {
    // If serviceId is not provided, just update local state
    if (!serviceId) {
      return;
    }

    try {
      setIsUpdating(true);
      const dateKey = getDateKey(selectedDate);

      const response = await axios.put(`${API_URL}/availability/${serviceType}/${serviceId}`, {
        date: dateKey,
        available: selectedDateAvailability.available
      });

      if (response.data.success) {
        // Update the availabilityData state to match what's now in selectedDateAvailability
        const key = getDateKey(selectedDate);
        setAvailabilityData(prev => ({
          ...prev,
          [key]: selectedDateAvailability
        }));
      } else {
        console.error('Error in response:', response.data);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Block an entire day
  const handleBlockDay = async () => {
    // Update the local state first
    setSelectedDateAvailability(prev => ({
      ...prev,
      available: 0,
      bookings: prev.total
    }));

    // If serviceId is not provided, just update local state
    if (!serviceId) {
      return;
    }

    try {
      setIsUpdating(true);
      const dateKey = getDateKey(selectedDate);

      const response = await axios.put(`${API_URL}/availability/${serviceType}/${serviceId}/block`, {
        date: dateKey
      });

      if (response.data.success) {
        // Update the local data map
        const key = getDateKey(selectedDate);
        setAvailabilityData(prev => ({
          ...prev,
          [key]: {
            ...prev[key] || getAvailability(selectedDate),
            available: 0,
            bookings: initialCapacity
          }
        }));
      } else {
        console.error('Error in response:', response.data);
      }
    } catch (error) {
      console.error('Error blocking day:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Reset to default capacity
  const handleResetAvailability = async () => {
    // Update the local state first
    setSelectedDateAvailability(prev => ({
      ...prev,
      available: initialCapacity,
      bookings: 0
    }));

    // If serviceId is not provided, just update local state
    if (!serviceId) {
      return;
    }

    try {
      setIsUpdating(true);
      const dateKey = getDateKey(selectedDate);

      const response = await axios.put(`${API_URL}/availability/${serviceType}/${serviceId}/bulk`, {
        dates: [dateKey],
        reset: true
      });

      if (response.data.success) {
        // Update the local data map
        const key = getDateKey(selectedDate);
        setAvailabilityData(prev => ({
          ...prev,
          [key]: {
            ...prev[key] || getAvailability(selectedDate),
            available: initialCapacity,
            bookings: 0
          }
        }));
      } else {
        console.error('Error in response:', response.data);
      }
    } catch (error) {
      console.error('Error resetting availability:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle previous month button
  const handlePrevMonth = () => {
    setMonth(prevMonth => subMonths(prevMonth, 1));
  };

  // Handle next month button
  const handleNextMonth = () => {
    setMonth(prevMonth => addMonths(prevMonth, 1));
  };

  // Handle date selection in the calendar
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Make sure we create a fresh Date object
      const freshDate = new Date(newDate.getTime());

      // Update the selected date
      setSelectedDate(freshDate);

      // If the date is in a different month, update the month view
      if (freshDate.getMonth() !== month.getMonth() ||
        freshDate.getFullYear() !== month.getFullYear()) {
        setMonth(new Date(freshDate.getFullYear(), freshDate.getMonth(), 1));
      }

      // Force update the details panel
      const currentAvailability = getAvailability(freshDate);
      setSelectedDateAvailability({
        date: freshDate,
        total: currentAvailability.total,
        available: currentAvailability.available,
        bookings: currentAvailability.bookings
      });
    }
  };

  // Toggle date range mode
  const handleDateRangeToggle = (enabled: boolean) => {
    setIsDateRangeMode(enabled);
    if (!enabled) {
      // Clear date range when turning off
      setDateRange({ from: undefined, to: undefined });
    }
  };

  // Handle custom availability input change
  const handleCustomAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAvailability(val);
  };

  // Handle direct availability input change for the main counter
  const handleDirectAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    const numVal = parseInt(val) || 0;
    const clampedVal = Math.max(0, Math.min(initialCapacity, numVal));
    
    setDirectAvailabilityInput(val);
    
    // Update the selectedDateAvailability immediately
    setSelectedDateAvailability(prev => ({
      ...prev,
      available: clampedVal,
      bookings: prev.total - clampedVal
    }));
  };

  // Determine color based on availability ratio
  const getDayColor = (day: Date) => {
    const availability = getAvailability(day);
    const ratio = availability.available / availability.total;

    if (ratio === 0) return "bg-red-100 hover:bg-red-200"; // Fully booked
    if (ratio < 0.3) return "bg-orange-100 hover:bg-orange-200"; // Low availability
    if (ratio < 0.7) return "bg-yellow-100 hover:bg-yellow-200"; // Medium availability
    return "bg-green-100 hover:bg-green-200"; // High availability
  };

  // Custom day rendering for the calendar
  const renderDay = (day: Date) => {
    const availability = getAvailability(day);
    const isSelected = isSameDay(day, selectedDate);

    return (
      <div
        className={`w-full h-full rounded-md flex items-center justify-center 
          ${isSelected ? "ring-2 ring-offset-2 ring-hotel-primary bg-hotel-primary/20" : ""} 
          ${getDayColor(day)}`}
        data-date={format(day, 'yyyy-MM-dd')}
      >
        <div className="flex flex-col items-center">
          <span className={isSelected ? "font-bold" : ""}>{day.getDate()}</span>
          {availability.available === 0 ? (
            <Badge variant="destructive" className="text-[0.6rem] px-1 mt-1">Full</Badge>
          ) : (
            <span className="text-[0.6rem] text-gray-600">{availability.available}/{availability.total}</span>
          )}
        </div>
      </div>
    );
  };

  // Display labels based on service type
  const getUnitLabel = () => {
    switch (serviceType) {
      case "room": return "Rooms";
      case "spa": return "Time Slots";
      case "restaurant": return "Tables";
      case "specialist": return "Appointments";
    }
  };

  // Update availability for a date range
  const handleDateRangeUpdate = async () => {
    if (!dateRange?.from) return;

    const to = dateRange.to || dateRange.from;
    const dates = eachDayOfInterval({ start: dateRange.from, end: to });
    const dateStrings = dates.map(date => getDateKey(date));

    // Update local state for the date range
    updateLocalDateRangeAvailability(dates);

    // If serviceId is not provided, just update local state
    if (!serviceId) {
      return;
    }

    try {
      setIsUpdating(true);

      let requestData = {};

      // Determine action and prepare request data
      if (bulkUpdateAction === 'block') {
        // For blocking, set available to 0
        requestData = {
          dates: dateStrings,
          available: 0
        };
      } else if (bulkUpdateAction === 'reset') {
        // For resetting, use reset: true
        requestData = {
          dates: dateStrings,
          reset: true
        };
      } else {
        // For custom, use the custom value
        const customValue = parseInt(customAvailability) || initialCapacity;
        requestData = {
          dates: dateStrings,
          available: Math.max(0, Math.min(initialCapacity, customValue))
        };
      }

      const response = await axios.put(`${API_URL}/availability/${serviceType}/${serviceId}/bulk`, requestData);

      if (response.data.success) {
        // Close the date range popover
        setIsDateRangeMode(false);
      } else {
        console.error('Error in response:', response.data);
      }
    } catch (error) {
      console.error('Error updating date range:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Update local state for a date range
  const updateLocalDateRangeAvailability = (dates: Date[]) => {
    const newAvailabilityData = { ...availabilityData };

    dates.forEach(date => {
      const key = getDateKey(date);
      const currentRecord = getAvailability(date);
      let newAvailable = currentRecord.available;

      // Set the availability based on the action
      if (bulkUpdateAction === 'block') {
        newAvailable = 0;
      } else if (bulkUpdateAction === 'reset') {
        newAvailable = initialCapacity;
      } else {
        // Custom value
        newAvailable = Math.max(0, Math.min(initialCapacity, parseInt(customAvailability) || initialCapacity));
      }

      newAvailabilityData[key] = {
        ...currentRecord,
        available: newAvailable,
        bookings: currentRecord.total - newAvailable
      };
    });

    setAvailabilityData(newAvailabilityData);

    // Update selectedDateAvailability if the current date is in the range
    if (dates.some(d => isSameDay(d, selectedDate))) {
      // Force update the display for the current date
      const currentAvailability = newAvailabilityData[getDateKey(selectedDate)];
      if (currentAvailability) {
        setSelectedDateAvailability({
          date: new Date(selectedDate.getTime()),
          total: currentAvailability.total,
          available: currentAvailability.available,
          bookings: currentAvailability.bookings
        });
        
        // Update the direct input field as well
        setDirectAvailabilityInput(currentAvailability.available.toString());
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {name} - Availability Management
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h4 className="text-sm font-medium">
                  {format(month, 'MMMM yyyy')}
                </h4>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="w-full max-w-none">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    // Ensure we handle null/undefined values properly
                    if (date) {
                      setSelectedDate(new Date(date.getTime()));
                    }
                  }}
                  month={month}
                  onMonthChange={(newMonth) => {
                    setMonth(newMonth);
                  }}
                  className="rounded-md border w-full max-w-none"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                    month: "space-y-4 w-full",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex w-full",
                    head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] text-center min-w-0",
                    row: "flex w-full mt-2",
                    cell: "flex-1 aspect-square min-h-12 text-center text-sm p-0 relative min-w-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md"
                  }}
                  components={{
                    Day: ({ date: dayDate }) => {
                      if (!dayDate) return null;

                      // Simpler day rendering to test if clicks work
                      const isSelected = dayDate && selectedDate && isSameDay(dayDate, selectedDate);
                      const availability = getAvailability(dayDate);
                      const ratio = availability.available / availability.total;

                      let bgColor = "bg-green-100";
                      if (ratio === 0) bgColor = "bg-red-100";
                      else if (ratio < 0.3) bgColor = "bg-orange-100";
                      else if (ratio < 0.7) bgColor = "bg-yellow-100";

                      return (
                        <div
                          className={`w-full h-full rounded-md flex items-center justify-center 
                            ${isSelected ? "ring-2 ring-offset-2 ring-hotel-primary" : ""} 
                            ${bgColor}`}
                          onClick={() => {
                            setSelectedDate(new Date(dayDate.getTime()));
                          }}
                        >
                          <div className="text-center">
                            <div>{dayDate.getDate()}</div>
                            <div className="text-xs">{availability.available}/{availability.total}</div>
                          </div>
                        </div>
                      );
                    }
                  }}
                  disabled={false}
                  today={new Date()}
                />
              </div>

              <div className="flex justify-between mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-100"></div>
                  <span className="text-xs">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-yellow-100"></div>
                  <span className="text-xs">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-orange-100"></div>
                  <span className="text-xs">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-100"></div>
                  <span className="text-xs">Full</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div
                key={`details-${format(selectedDate, 'yyyy-MM-dd')}`}
                className="p-4 border rounded-md"
              >
                <h3 className="font-medium mb-1 text-start text-hotel-primary bg-gray-50 p-2 rounded" data-testid="selected-date">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>

                <div className="space-y-4 mt-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Total {getUnitLabel()}:</span>
                      <span data-testid="total-rooms">{selectedDateAvailability.total}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Booked:</span>
                      <span data-testid="booked-rooms">{selectedDateAvailability.bookings}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Available:</span>
                      <span data-testid="available-rooms">{selectedDateAvailability.available}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateLocalCount(-1)}
                      disabled={selectedDateAvailability.available <= 0 || isUpdating}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="text"
                      value={directAvailabilityInput}
                      onChange={handleDirectAvailabilityChange}
                      className="w-16 text-center text-xl font-medium"
                      min="0"
                      max={initialCapacity.toString()}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateLocalCount(1)}
                      disabled={selectedDateAvailability.available >= selectedDateAvailability.total || isUpdating}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    className="w-full bg-hotel-primary mt-2"
                    onClick={submitAvailabilityUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Availability"}
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-medium mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleBlockDay}
                      disabled={isUpdating}
                    >
                      Block entire day
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleResetAvailability}
                      disabled={isUpdating}
                    >
                      Reset to default capacity
                    </Button>

                    {/* Date Range Control */}
                    <div className="border rounded-md p-3 mt-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="date-range-mode" className="font-medium">Date Range Mode</Label>
                        <Switch
                          id="date-range-mode"
                          checked={isDateRangeMode}
                          onCheckedChange={handleDateRangeToggle}
                        />
                      </div>

                      {isDateRangeMode && (
                        <div className="space-y-3 mt-3 border-t pt-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                  dateRange.to ? (
                                    <>
                                      {format(dateRange.from, "LLL dd, y")} -{" "}
                                      {format(dateRange.to, "LLL dd, y")}
                                    </>
                                  ) : (
                                    format(dateRange.from, "LLL dd, y")
                                  )
                                ) : (
                                  <span>Select date range</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={selectedDate}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                              />
                            </PopoverContent>
                          </Popover>

                          <RadioGroup
                            value={bulkUpdateAction}
                            onValueChange={setBulkUpdateAction}
                            className="space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="block" id="block" />
                              <Label htmlFor="block">Block Dates</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="reset" id="reset" />
                              <Label htmlFor="reset">Reset to Default</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="custom" id="custom" />
                              <Label htmlFor="custom">Custom Value</Label>
                              {bulkUpdateAction === 'custom' && (
                                <Input
                                  className="w-16 h-8 ml-2"
                                  value={customAvailability}
                                  onChange={handleCustomAvailabilityChange}
                                  min="0"
                                  max={initialCapacity.toString()}
                                />
                              )}
                            </div>
                          </RadioGroup>

                          <Button
                            className="w-full mt-2"
                            onClick={handleDateRangeUpdate}
                            disabled={!dateRange?.from || isUpdating}
                          >
                            {isUpdating ? "Updating..." : "Apply to Date Range"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityCalendar;
