import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Plus, TagIcon, Clock, Users, ShoppingBag, DollarSign, UserPlus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { format, parseISO } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

// API base URL
const API_BASE_URL = "http://localhost:4000/api";

const promoCodeSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  discount: z.string().min(1, "Discount is required"),
  type: z.enum(["Percentage", "Fixed"]),
  validFromDate: z.date({
    required_error: "Start date is required",
  }),
  validToDate: z.date({
    required_error: "End date is required",
  }),
  validFromTime: z.string().min(1, "Start time is required"),
  validToTime: z.string().min(1, "End time is required"),
  status: z.enum(["Active", "Expired", "Scheduled"]),
  capacity: z.string().min(0).optional(),
  applicableServices: z.array(z.string()).min(1, "Select at least one applicable service"),
  minPurchase: z.string().optional(),
  maxDiscountCap: z.string().optional(),
  newCustomersOnly: z.boolean().default(false),
  maxUsesPerCustomer: z.string().min(0).optional(),
});

type PromoCodeFormValues = z.infer<typeof promoCodeSchema>;

type PromoCode = {
  id: number | string;
  _id?: string;
  code: string;
  discount: string;
  type: "Percentage" | "Fixed";
  validFrom: string;
  validTo: string;
  validFromTime: string;
  validToTime: string;
  status: "Active" | "Expired" | "Scheduled";
  usageCount: number;
  capacity?: string;
  applicableServices?: string[];
  minPurchase?: string;
  maxDiscountCap?: string;
  newCustomersOnly: boolean;
  maxUsesPerCustomer?: string;
};

const serviceOptions = [
  { label: "All Rooms", value: "all_rooms" },
  { label: "Standard Room", value: "standard_room" },
  { label: "Deluxe Room", value: "deluxe_room" },
  { label: "Suite", value: "suite" },
  { label: "All Spa Services", value: "all_spa" },
  { label: "Massage", value: "massage" },
  { label: "Facial", value: "facial" },
  { label: "Body Treatment", value: "body_treatment" },
  { label: "All Events", value: "all_events" },
  { label: "Corporate Events", value: "corporate_events" },
  { label: "Weddings", value: "weddings" },
  { label: "All Restaurant Items", value: "all_restaurant" },
  { label: "Main Course", value: "main_course" },
  { label: "Desserts", value: "desserts" },
  { label: "Beverages", value: "beverages" },
];

const PromoCodeContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);

  // Fetch promo codes from the API
  useEffect(() => {
    const fetchPromoCodes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/promo-codes`);

        if (response.data.status === 'success') {
          const formattedPromoCodes = response.data.data.promoCodes.map((code: any) => ({
            ...code,
            id: code._id,
            validFrom: format(new Date(code.validFrom), 'yyyy-MM-dd'),
            validTo: format(new Date(code.validTo), 'yyyy-MM-dd')
          }));

          setPromoCodes(formattedPromoCodes);
        } else {
          throw new Error('Failed to fetch promo codes');
        }
      } catch (error) {
        console.error('Error fetching promo codes:', error);
        toast({
          title: "Error",
          description: "Failed to load promo codes. Please try again.",
          variant: "destructive"
        });

        // Set sample data for display purposes if API fails
        setPromoCodes([
          {
            id: 1,
            code: "SUMMER25",
            discount: "25%",
            type: "Percentage",
            validFrom: "2025-06-01",
            validTo: "2025-08-31",
            validFromTime: "00:00",
            validToTime: "23:59",
            status: "Active",
            usageCount: 156,
            capacity: "1000",
            applicableServices: ["standard_room", "deluxe_room"],
            minPurchase: "100",
            maxDiscountCap: "50",
            newCustomersOnly: true,
            maxUsesPerCustomer: "1",
          },
          // ... other sample promo codes
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoCodes();
  }, [toast]);

  const filteredPromoCodes = promoCodes.filter(
    (promo) =>
      promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const form = useForm<PromoCodeFormValues>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: "",
      discount: "",
      type: "Percentage",
      validFromDate: new Date(),
      validToDate: new Date(),
      validFromTime: "00:00",
      validToTime: "23:59",
      status: "Active",
      capacity: "",
      applicableServices: [],
      minPurchase: "",
      maxDiscountCap: "",
      newCustomersOnly: false,
      maxUsesPerCustomer: "",
    }
  });

  const handleAddClick = () => {
    form.reset({
      code: "",
      discount: "",
      type: "Percentage",
      validFromDate: new Date(),
      validToDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      validFromTime: "00:00",
      validToTime: "23:59",
      status: "Active",
      capacity: "",
      applicableServices: [],
      minPurchase: "",
      maxDiscountCap: "",
      newCustomersOnly: false,
      maxUsesPerCustomer: "",
    });
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (promo: PromoCode) => {
    setSelectedPromoCode(promo);

    // If API dates are already ISO strings, parse them
    // Otherwise, keep them as is (they might already be date objects)
    const fromDate = typeof promo.validFrom === 'string'
      ? new Date(promo.validFrom)
      : promo.validFrom;

    const toDate = typeof promo.validTo === 'string'
      ? new Date(promo.validTo)
      : promo.validTo;

    form.reset({
      code: promo.code,
      discount: promo.discount.replace('%', '').replace('$', ''),
      type: promo.type,
      validFromDate: fromDate,
      validToDate: toDate,
      validFromTime: promo.validFromTime || "00:00",
      validToTime: promo.validToTime || "23:59",
      status: promo.status,
      capacity: promo.capacity || "",
      applicableServices: promo.applicableServices || [],
      minPurchase: promo.minPurchase || "",
      maxDiscountCap: promo.maxDiscountCap || "",
      newCustomersOnly: promo.newCustomersOnly || false,
      maxUsesPerCustomer: promo.maxUsesPerCustomer || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (promo: PromoCode) => {
    setSelectedPromoCode(promo);
    setIsDeleteDialogOpen(true);
  };

  const handleAddSubmit = async (values: PromoCodeFormValues) => {
    const formattedFromDate = format(values.validFromDate, 'yyyy-MM-dd');
    const formattedToDate = format(values.validToDate, 'yyyy-MM-dd');

    const promoCodeData = {
      code: values.code,
      discount: values.type === "Percentage" ? `${values.discount}%` : `$${values.discount}`,
      type: values.type,
      validFrom: formattedFromDate,
      validTo: formattedToDate,
      validFromTime: values.validFromTime,
      validToTime: values.validToTime,
      status: values.status,
      capacity: values.capacity,
      applicableServices: values.applicableServices,
      minPurchase: values.minPurchase,
      maxDiscountCap: values.maxDiscountCap,
      newCustomersOnly: values.newCustomersOnly,
      maxUsesPerCustomer: values.maxUsesPerCustomer,
    };

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/promo-codes`, promoCodeData);

      if (response.data.status === 'success') {
        const newPromoCode = {
          ...response.data.data.promoCode,
          id: response.data.data.promoCode._id,
          validFrom: formattedFromDate,
          validTo: formattedToDate
        };

        setPromoCodes([...promoCodes, newPromoCode]);
        setIsAddDialogOpen(false);
        toast({
          title: "Promo Code Added",
          description: `${newPromoCode.code} has been created successfully.`
        });
      } else {
        throw new Error('Failed to create promo code');
      }
    } catch (error: any) {
      console.error('Error creating promo code:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create promo code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (values: PromoCodeFormValues) => {
    if (!selectedPromoCode) return;

    const formattedFromDate = format(values.validFromDate, 'yyyy-MM-dd');
    const formattedToDate = format(values.validToDate, 'yyyy-MM-dd');

    const promoCodeData = {
      code: values.code,
      discount: values.type === "Percentage" ? `${values.discount}%` : `$${values.discount}`,
      type: values.type,
      validFrom: formattedFromDate,
      validTo: formattedToDate,
      validFromTime: values.validFromTime,
      validToTime: values.validToTime,
      status: values.status,
      capacity: values.capacity,
      applicableServices: values.applicableServices,
      minPurchase: values.minPurchase,
      maxDiscountCap: values.maxDiscountCap,
      newCustomersOnly: values.newCustomersOnly,
      maxUsesPerCustomer: values.maxUsesPerCustomer,
    };

    try {
      setLoading(true);
      const response = await axios.patch(`${API_BASE_URL}/promo-codes/${selectedPromoCode._id || selectedPromoCode.id}`, promoCodeData);

      if (response.data.status === 'success') {
        const updatedPromoCode = {
          ...response.data.data.promoCode,
          id: response.data.data.promoCode._id,
          validFrom: formattedFromDate,
          validTo: formattedToDate
        };

        const updatedPromoCodes = promoCodes.map(promo =>
          promo.id === selectedPromoCode.id ? updatedPromoCode : promo
        );

        setPromoCodes(updatedPromoCodes);
        setIsEditDialogOpen(false);
        toast({
          title: "Promo Code Updated",
          description: `${values.code} has been updated successfully.`
        });
      } else {
        throw new Error('Failed to update promo code');
      }
    } catch (error: any) {
      console.error('Error updating promo code:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update promo code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPromoCode) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/promo-codes/${selectedPromoCode._id || selectedPromoCode.id}`);

      const updatedPromoCodes = promoCodes.filter(
        promo => promo.id !== selectedPromoCode.id
      );

      setPromoCodes(updatedPromoCodes);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Promo Code Deleted",
        description: `${selectedPromoCode.code} has been deleted.`,
        variant: "destructive"
      });
    } catch (error: any) {
      console.error('Error deleting promo code:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete promo code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatApplicableServices = (services?: string[]) => {
    if (!services || services.length === 0) return "None";

    if (services.includes("all_rooms") &&
      services.includes("all_spa") &&
      services.includes("all_events") &&
      services.includes("all_restaurant")) {
      return "All Services";
    }

    const serviceNames = services.map(service => {
      const option = serviceOptions.find(opt => opt.value === service);
      return option ? option.label : service;
    });

    return serviceNames.join(", ");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Promo Code Management</h1>
        <Button className="flex items-center gap-2" onClick={handleAddClick}>
          <Plus size={16} />
          <span>Add New Promo Code</span>
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search promo codes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export</Button>
            <Button variant="outline">Filter</Button>
          </div>
        </div>

        <div className="rounded-md border">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Applicable To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Restrictions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromoCodes.length > 0 ? (
                  filteredPromoCodes.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-medium">{promo.code}</TableCell>
                      <TableCell>{promo.discount}</TableCell>
                      <TableCell className="text-sm">
                        {promo.validFrom} to {promo.validTo}
                        <div className="text-xs text-gray-500">
                          {promo.validFromTime} - {promo.validToTime}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={formatApplicableServices(promo.applicableServices)}>
                        {formatApplicableServices(promo.applicableServices)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            promo.status === "Active"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : promo.status === "Scheduled"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }
                        >
                          {promo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{promo.usageCount}</TableCell>
                      <TableCell>
                        {promo.newCustomersOnly && (
                          <Badge className="bg-purple-100 text-purple-800 mr-1">New Customers</Badge>
                        )}
                        {promo.minPurchase && (
                          <Badge className="bg-yellow-100 text-yellow-800 mr-1">Min: ${promo.minPurchase}</Badge>
                        )}
                        {promo.maxUsesPerCustomer && (
                          <Badge className="bg-blue-100 text-blue-800">Max: {promo.maxUsesPerCustomer}/user</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(promo)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteClick(promo)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                      No promo codes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add New Promo Code</DialogTitle>
            <DialogDescription>
              Create a new promotional code for customers
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input placeholder="SUMMER25" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a unique code for this promotion
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Percentage">Percentage (%)</SelectItem>
                            <SelectItem value="Fixed">Fixed Amount ($)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Value</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="25" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormLabel>Valid From</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="validFromDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="date"
                                value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                onChange={e => {
                                  const date = e.target.value ? new Date(e.target.value) : null;
                                  if (date) field.onChange(date);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="validFromTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <FormLabel>Valid To</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="validToDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="date"
                                value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                onChange={e => {
                                  const date = e.target.value ? new Date(e.target.value) : null;
                                  if (date) field.onChange(date);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="validToTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity (Total Number of Uses)</FormLabel>
                        <div className="flex items-center">
                          <Users size={16} className="mr-2 text-gray-500" />
                          <FormControl>
                            <Input type="number" placeholder="Unlimited" {...field} />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Leave blank for unlimited uses
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxUsesPerCustomer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Uses Per Customer</FormLabel>
                        <div className="flex items-center">
                          <UserPlus size={16} className="mr-2 text-gray-500" />
                          <FormControl>
                            <Input type="number" placeholder="Unlimited" {...field} />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Leave blank for unlimited uses per customer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minPurchase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Purchase Requirement ($)</FormLabel>
                        <div className="flex items-center">
                          <ShoppingBag size={16} className="mr-2 text-gray-500" />
                          <FormControl>
                            <Input type="number" placeholder="No minimum" {...field} />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Leave blank for no minimum purchase requirement
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxDiscountCap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Discount Cap ($)</FormLabel>
                        <div className="flex items-center">
                          <DollarSign size={16} className="mr-2 text-gray-500" />
                          <FormControl>
                            <Input type="number" placeholder="No maximum" {...field} />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Maximum amount the discount can be (for percentage discounts)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="newCustomersOnly"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>New Customers Only</FormLabel>
                        <FormDescription>
                          This promo code can only be used by customers who have never made a purchase before
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicableServices"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applicable Services</FormLabel>
                      <FormDescription>
                        Select which services this promo code can be applied to
                      </FormDescription>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {serviceOptions.map((option) => (
                          <FormItem
                            key={option.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, option.value])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option.value
                                      )
                                    );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Promo Code
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Promo Code</DialogTitle>
            <DialogDescription>
              Update the details of this promotional code
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Percentage">Percentage (%)</SelectItem>
                            <SelectItem value="Fixed">Fixed Amount ($)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Value</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormLabel>Valid From</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="validFromDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="date"
                                value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                onChange={e => {
                                  const date = e.target.value ? new Date(e.target.value) : null;
                                  if (date) field.onChange(date);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="validFromTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <FormLabel>Valid To</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="validToDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="date"
                                value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                onChange={e => {
                                  const date = e.target.value ? new Date(e.target.value) : null;
                                  if (date) field.onChange(date);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="validToTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity (Total Number of Uses)</FormLabel>
                        <div className="flex items-center">
                          <Users size={16} className="mr-2 text-gray-500" />
                          <FormControl>
                            <Input type="number" placeholder="Unlimited" {...field} />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Leave blank for unlimited uses
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxUsesPerCustomer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Uses Per Customer</FormLabel>
                        <div className="flex items-center">
                          <UserPlus size={16} className="mr-2 text-gray-500" />
                          <FormControl>
                            <Input type="number" placeholder="Unlimited" {...field} />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Leave blank for unlimited uses per customer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minPurchase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Purchase Requirement ($)</FormLabel>
                        <div className="flex items-center">
                          <ShoppingBag size={16} className="mr-2 text-gray-500" />
                          <FormControl>
                            <Input type="number" placeholder="No minimum" {...field} />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Leave blank for no minimum purchase requirement
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxDiscountCap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Discount Cap ($)</FormLabel>
                        <div className="flex items-center">
                          <DollarSign size={16} className="mr-2 text-gray-500" />
                          <FormControl>
                            <Input type="number" placeholder="No maximum" {...field} />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Maximum amount the discount can be (for percentage discounts)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="newCustomersOnly"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>New Customers Only</FormLabel>
                        <FormDescription>
                          This promo code can only be used by customers who have never made a purchase before
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicableServices"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applicable Services</FormLabel>
                      <FormDescription>
                        Select which services this promo code can be applied to
                      </FormDescription>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {serviceOptions.map((option) => (
                          <FormItem
                            key={option.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, option.value])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option.value
                                      )
                                    );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Promo Code
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Promo Code</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this promo code? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromoCodeContent;
