import { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Upload, Type, Palette, CreditCard, Globe, Bell, Smartphone, Layers } from "lucide-react";
import ConfirmDeleteModal from "../Common/ConfirmDeleteModal";
import { useToast } from "@/hooks/use-toast";
import NotificationManager from "./NotificationManager";
import { Checkbox } from "@/components/ui/checkbox";
import AppPageSettings from "./AppPageSettings";
import PlatformVisibilitySettings from "./PlatformVisibilitySettings";

interface PaymentMethod {
  id: number;
  name: string;
  logo: string;
  color: string;
  description: string;
  connected: boolean;
}

interface OtaSystem {
  id: number;
  name: string;
  logo: string;
  color: string;
  description: string;
  connected: boolean;
  type?: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  isGCC?: boolean;
}

const SettingsContent = () => {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    hotelName: "Parkside Plaza Hotel",
    email: "info@parksideplaza.com",
    phone: "+1 (555) 123-4567",
    address: "123 Park Avenue, New York, NY 10001",
    timezone: "America/New_York",
    currency: "USD",
    checkInTime: "15:00",
    checkOutTime: "11:00"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCurrencyLoading, setIsCurrencyLoading] = useState(false);
  const [isCurrentUserSuperAdmin] = useState(true);
  const [isAppearanceLoading, setIsAppearanceLoading] = useState(false);

  const [enabledCurrencies, setEnabledCurrencies] = useState({
    USD: true,
    EUR: false,
    GBP: false,
    SAR: false,
    AED: false,
    QAR: false,
    KWD: false,
    BHD: false,
    OMR: false,
    CAD: false,
    AUD: false,
    JPY: false,
    CNY: false
  });

  // Fetch general settings from API
  useEffect(() => {
    const fetchGeneralSettings = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/general-settings");
        if (response.data.success) {
          setGeneralSettings(response.data.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load general settings",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching general settings:", error);
        toast({
          title: "Error",
          description: "Failed to load settings from server",
          variant: "destructive"
        });
      }
    };

    fetchGeneralSettings();
  }, []);

  // Fetch currency settings from API
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setIsCurrencyLoading(true);
        const response = await axios.get("http://localhost:4000/api/currencies");
        if (response.data.success) {
          setEnabledCurrencies(response.data.data.currencies);

          // Update default currency in general settings if needed
          if (response.data.data.defaultCurrency && response.data.data.defaultCurrency !== generalSettings.currency) {
            setGeneralSettings(prev => ({
              ...prev,
              currency: response.data.data.defaultCurrency
            }));
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to load currency settings",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching currencies:", error);
        toast({
          title: "Error",
          description: "Failed to load currency settings from server",
          variant: "destructive"
        });
      } finally {
        setIsCurrencyLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  // Notifications state and loading state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingConfirmations: true,
    cancellationAlerts: true,
    lowInventoryAlerts: true,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: true
  });

  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);

  // Fetch notification settings from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsNotificationsLoading(true);
        const response = await axios.get("http://localhost:4000/api/notifications");
        if (response.data.success) {
          setNotificationSettings(prev => ({
            ...prev,
            ...response.data.data.notifications
          }));
        } else {
          toast({
            title: "Error",
            description: "Failed to load notification settings",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Error",
          description: "Failed to load notification settings from server",
          variant: "destructive"
        });
      } finally {
        setIsNotificationsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // SEO settings and loading state
  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "Parkside Plaza Hotel | Luxury Stay in New York",
    metaDescription: "Experience luxury accommodations at Parkside Plaza Hotel in the heart of New York City. Book your stay today for the best rates guaranteed.",
    ogImage: "",
    googleAnalyticsId: ""
  });

  const [isSeoLoading, setIsSeoLoading] = useState(false);

  // Appearance settings
  const [fonts, setFonts] = useState([
    { id: 1, name: "Inter", family: "Inter, sans-serif", type: "Sans-serif", previewText: "Experience luxury accommodations" },
    { id: 2, name: "Playfair Display", family: "Playfair Display, serif", type: "Serif", previewText: "Experience luxury accommodations" }
  ]);

  const [colors, setColors] = useState([
    { id: 1, name: "Primary", value: "#0F4C81", category: "Brand" },
    { id: 2, name: "Secondary", value: "#C19A6B", category: "Brand" },
    { id: 3, name: "Accent", value: "#E5D3B3", category: "Brand" },
    { id: 4, name: "Dark", value: "#2C3E50", category: "UI" },
    { id: 5, name: "Light", value: "#F5F5F5", category: "UI" }
  ]);

  const [newFont, setNewFont] = useState({ name: "", family: "", type: "Sans-serif", previewText: "Experience luxury accommodations" });
  const [newColor, setNewColor] = useState({ name: "", value: "#6366f1", category: "Brand" });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 1, name: "Stripe", logo: "S", color: "#635BFF", description: "Accept credit card payments", connected: false },
    { id: 2, name: "PayPal", logo: "P", color: "#009cde", description: "Accept PayPal payments", connected: false }
  ]);

  const [otaSystems, setOtaSystems] = useState<OtaSystem[]>([
    { id: 1, name: "Booking.com", logo: "B", color: "#003580", description: "Sync inventory and rates", connected: false },
    { id: 2, name: "Airbnb", logo: "A", color: "#FF5A5F", description: "Sync inventory and rates", connected: false },
    { id: 3, name: "TripAdvisor", logo: "T", color: "#00a680", description: "Manage reviews and listing", connected: false }
  ]);

  const [newPaymentMethod, setNewPaymentMethod] = useState({ name: "", description: "", apiKey: "" });
  const [newOtaSystem, setNewOtaSystem] = useState({ name: "", description: "", apiKey: "", systemType: "OTA" });

  const currencies: Currency[] = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "SAR", name: "Saudi Riyal", symbol: "ر.س", isGCC: true },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ", isGCC: true },
    { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق", isGCC: true },
    { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", isGCC: true },
    { code: "BHD", name: "Bahraini Dinar", symbol: "د.ب", isGCC: true },
    { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", isGCC: true },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" }
  ];

  const handleCurrencyToggle = async (currencyCode: string) => {
    try {
      // First update UI optimistically
      setEnabledCurrencies(prev => ({
        ...prev,
        [currencyCode]: !prev[currencyCode]
      }));

      // Then make the API call
      const response = await axios.patch(`http://localhost:4000/api/currencies/toggle/${currencyCode}`);

      if (response.data.success) {
        // Update state with the actual data from API
        setEnabledCurrencies(response.data.data.currencies);

        toast({
          title: response.data.data.currencies[currencyCode] ? "Currency Enabled" : "Currency Disabled",
          description: response.data.message
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to toggle currency",
          variant: "destructive"
        });

        // Revert the UI change on error
        setEnabledCurrencies(prev => ({
          ...prev,
          [currencyCode]: !prev[currencyCode]
        }));
      }
    } catch (error) {
      console.error(`Error toggling currency ${currencyCode}:`, error);
      toast({
        title: "Error",
        description: "Failed to update currency settings",
        variant: "destructive"
      });

      // Revert the UI change on error
      setEnabledCurrencies(prev => ({
        ...prev,
        [currencyCode]: !prev[currencyCode]
      }));
    }
  };

  const handleSaveCurrencySettings = async (e) => {
    e.preventDefault();
    setIsCurrencyLoading(true);

    try {
      // Send all currency settings to the API
      const response = await axios.put("http://localhost:4000/api/currencies", {
        currencies: enabledCurrencies
      });

      if (response.data.success) {
        // Update state with the actual data from API
        setEnabledCurrencies(response.data.data.currencies);

        toast({
          title: "Success",
          description: "Currency settings updated successfully"
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to update currency settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating currency settings:", error);
      toast({
        title: "Error",
        description: "Failed to update currency settings",
        variant: "destructive"
      });
    } finally {
      setIsCurrencyLoading(false);
    }
  };

  const handleGeneralSettingChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveGeneralSettings = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put("http://localhost:4000/api/general-settings", generalSettings);

      if (response.data.success) {
        toast({
          title: "Success",
          description: "General settings updated successfully"
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to update settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating general settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationToggle = async (setting) => {
    try {
      // First update UI optimistically
      setNotificationSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));

      // Then make the API call
      const response = await axios.patch(`http://localhost:4000/api/notifications/toggle/${setting}`);

      if (response.data.success) {
        // Update state with the actual data from API
        setNotificationSettings(prev => ({
          ...prev,
          ...response.data.data.notifications
        }));

        toast({
          title: response.data.data.notifications[setting] ? "Notification Enabled" : "Notification Disabled",
          description: response.data.message
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to toggle notification",
          variant: "destructive"
        });

        // Revert the UI change on error
        setNotificationSettings(prev => ({
          ...prev,
          [setting]: !prev[setting]
        }));
      }
    } catch (error) {
      console.error(`Error toggling notification ${setting}:`, error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive"
      });

      // Revert the UI change on error
      setNotificationSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    }
  };

  const handleSaveNotificationSettings = async () => {
    try {
      setIsNotificationsLoading(true);

      // Send all notification settings to the API
      const response = await axios.put("http://localhost:4000/api/notifications", {
        notifications: notificationSettings
      });

      if (response.data.success) {
        // Update state with the actual data from API
        setNotificationSettings(prev => ({
          ...prev,
          ...response.data.data.notifications
        }));

        toast({
          title: "Success",
          description: "Notification settings updated successfully"
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to update notification settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive"
      });
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  const handleSeoSettingChange = (e) => {
    const { name, value } = e.target;
    setSeoSettings((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSeoSettings = async (e) => {
    e.preventDefault();
    setIsSeoLoading(true);

    try {
      const response = await axios.put("http://localhost:4000/api/seo-settings", seoSettings);

      if (response.data.success) {
        toast({
          title: "Success",
          description: "SEO settings updated successfully"
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to update SEO settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating SEO settings:", error);
      toast({
        title: "Error",
        description: "Failed to update SEO settings",
        variant: "destructive"
      });
    } finally {
      setIsSeoLoading(false);
    }
  };

  // Fetch appearance settings from API
  useEffect(() => {
    const fetchAppearanceSettings = async () => {
      try {
        setIsAppearanceLoading(true);
        const response = await axios.get("http://localhost:4000/api/appearance-settings");
        if (response.data.success) {
          const data = response.data.data;
          if (data.colors) setColors(data.colors);
          if (data.fonts) setFonts(data.fonts);
        } else {
          toast({
            title: "Error",
            description: "Failed to load appearance settings",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching appearance settings:", error);
        toast({
          title: "Error",
          description: "Failed to load appearance settings from server",
          variant: "destructive"
        });
      } finally {
        setIsAppearanceLoading(false);
      }
    };

    fetchAppearanceSettings();
  }, []);

  const handleAddFont = async () => {
    if (!newFont.name || !newFont.family) {
      toast({
        title: "Missing Information",
        description: "Please provide both a name and family for the font",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAppearanceLoading(true);
      const response = await axios.post("http://localhost:4000/api/appearance-settings/fonts", newFont);

      if (response.data.success) {
        // Update local state with the new font that includes the server-generated ID
        const addedFont = response.data.data.font;
        setFonts(prevFonts => [...prevFonts, addedFont]);
        setNewFont({ name: "", family: "", type: "Sans-serif", previewText: "Experience luxury accommodations" });

        toast({
          title: "Font Added",
          description: `${addedFont.name} has been added to your fonts`
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to add font",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding font:", error);
      toast({
        title: "Error",
        description: "Failed to add font",
        variant: "destructive"
      });
    } finally {
      setIsAppearanceLoading(false);
    }
  };

  const handleDeleteFont = async (id) => {
    try {
      setIsAppearanceLoading(true);
      const response = await axios.delete(`http://localhost:4000/api/appearance-settings/fonts/${id}`);

      if (response.data.success) {
        setFonts(fonts.filter(font => font.id !== id));
        toast({
          title: "Font Removed",
          description: "The font has been removed from your collection"
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to remove font",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting font:", error);
      toast({
        title: "Error",
        description: "Failed to remove font",
        variant: "destructive"
      });
    } finally {
      setIsAppearanceLoading(false);
    }
  };

  const handleAddColor = async () => {
    if (!newColor.name) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for the color",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAppearanceLoading(true);
      const response = await axios.post("http://localhost:4000/api/appearance-settings/colors", newColor);

      if (response.data.success) {
        // Update local state with the new color that includes the server-generated ID
        const addedColor = response.data.data.color;
        setColors(prevColors => [...prevColors, addedColor]);
        setNewColor({ name: "", value: "#6366f1", category: "Brand" });

        toast({
          title: "Color Added",
          description: `${addedColor.name} has been added to your color palette`
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to add color",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding color:", error);
      toast({
        title: "Error",
        description: "Failed to add color",
        variant: "destructive"
      });
    } finally {
      setIsAppearanceLoading(false);
    }
  };

  const handleDeleteColor = async (id) => {
    try {
      setIsAppearanceLoading(true);
      const response = await axios.delete(`http://localhost:4000/api/appearance-settings/colors/${id}`);

      if (response.data.success) {
        setColors(colors.filter(color => color.id !== id));
        toast({
          title: "Color Removed",
          description: "The color has been removed from your palette"
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to remove color",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting color:", error);
      toast({
        title: "Error",
        description: "Failed to remove color",
        variant: "destructive"
      });
    } finally {
      setIsAppearanceLoading(false);
    }
  };

  const handleFontFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsAppearanceLoading(true);

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('fontFile', file);
        formData.append('fileName', file.name);

        // For now, we're just sending the filename since the backend is mocked
        const response = await axios.post("http://localhost:4000/api/appearance-settings/fonts/upload", {
          fileName: file.name
        });

        if (response.data.success) {
          const uploadedFont = response.data.data.font;
          setFonts(prevFonts => [...prevFonts, uploadedFont]);

          toast({
            title: "Font Uploaded",
            description: `${file.name} has been uploaded and processed`
          });
        } else {
          toast({
            title: "Error",
            description: response.data.message || "Failed to upload font",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error uploading font:", error);
        toast({
          title: "Error",
          description: "Failed to upload font",
          variant: "destructive"
        });
      } finally {
        setIsAppearanceLoading(false);
      }
    }
  };

  const handleImportColors = async (e) => {
    e.preventDefault();

    try {
      setIsAppearanceLoading(true);

      // In a real application, you might upload a file or provide a color palette
      // For now, we'll just send a sample set of colors to import
      const colorsToImport = [
        { name: "Imported Blue", value: "#3b82f6", category: "Imported" },
        { name: "Imported Green", value: "#10b981", category: "Imported" }
      ];

      const response = await axios.post("http://localhost:4000/api/appearance-settings/colors/import", {
        colors: colorsToImport
      });

      if (response.data.success) {
        // Update with the complete set of colors returned from the server
        setColors(response.data.data.colors);

        toast({
          title: "Colors Imported",
          description: `${response.data.data.addedColors.length} colors have been added to your palette`
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to import colors",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error importing colors:", error);
      toast({
        title: "Error",
        description: "Failed to import colors",
        variant: "destructive"
      });
    } finally {
      setIsAppearanceLoading(false);
    }
  };

  const handleSaveColors = async () => {
    try {
      setIsAppearanceLoading(true);

      const response = await axios.put("http://localhost:4000/api/appearance-settings/colors", {
        colors: colors
      });

      if (response.data.success) {
        // Update local state with the data from the server
        setColors(response.data.data.colors);

        toast({
          title: "Success",
          description: "Color settings saved successfully"
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to save color settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving colors:", error);
      toast({
        title: "Error",
        description: "Failed to save color settings",
        variant: "destructive"
      });
    } finally {
      setIsAppearanceLoading(false);
    }
  };

  const handleSaveFonts = async () => {
    try {
      setIsAppearanceLoading(true);

      const response = await axios.put("http://localhost:4000/api/appearance-settings/fonts", {
        fonts: fonts
      });

      if (response.data.success) {
        // Update local state with the data from the server
        setFonts(response.data.data.fonts);

        toast({
          title: "Success",
          description: "Font settings saved successfully"
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to save font settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving fonts:", error);
      toast({
        title: "Error",
        description: "Failed to save font settings",
        variant: "destructive"
      });
    } finally {
      setIsAppearanceLoading(false);
    }
  };

  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.name || !newPaymentMethod.description) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and description for the payment method",
        variant: "destructive"
      });
      return;
    }

    const nextId = paymentMethods.length > 0 ?
      Math.max(...paymentMethods.map(method => method.id)) + 1 : 1;

    const newMethod = {
      id: nextId,
      name: newPaymentMethod.name,
      logo: newPaymentMethod.name.charAt(0),
      color: getRandomColor(),
      description: newPaymentMethod.description,
      connected: false
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setNewPaymentMethod({ name: "", description: "", apiKey: "" });

    toast({
      title: "Payment Method Added",
      description: `${newPaymentMethod.name} has been added to your payment methods`
    });
  };

  const handleDeletePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast({
      title: "Payment Method Removed",
      description: "The payment method has been removed"
    });
  };

  const handleConnectPaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.map(method =>
      method.id === id ? { ...method, connected: !method.connected } : method
    ));

    const method = paymentMethods.find(m => m.id === id);
    if (method) {
      toast({
        title: method.connected ? "Disconnected" : "Connected",
        description: `${method.name} has been ${method.connected ? "disconnected" : "connected"} successfully`
      });
    }
  };

  const handleAddOtaSystem = () => {
    if (!newOtaSystem.name || !newOtaSystem.description) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and description",
        variant: "destructive"
      });
      return;
    }

    const nextId = otaSystems.length > 0 ?
      Math.max(...otaSystems.map(system => system.id)) + 1 : 1;

    const newSystem: OtaSystem = {
      id: nextId,
      name: newOtaSystem.name,
      logo: newOtaSystem.name.charAt(0),
      color: getRandomColor(),
      description: newOtaSystem.description,
      connected: false,
      type: newOtaSystem.systemType
    };

    setOtaSystems([...otaSystems, newSystem]);
    setNewOtaSystem({ name: "", description: "", apiKey: "", systemType: "OTA" });

    toast({
      title: "System Added",
      description: `${newOtaSystem.name} has been added to your distribution channels`
    });
  };

  const handleDeleteOtaSystem = (id) => {
    setOtaSystems(otaSystems.filter(system => system.id !== id));
    toast({
      title: "Channel Removed",
      description: "The distribution channel has been removed"
    });
  };

  const handleConnectOtaSystem = (id) => {
    setOtaSystems(otaSystems.map(system =>
      system.id === id ? { ...system, connected: !system.connected } : system
    ));

    const system = otaSystems.find(s => s.id === id);
    if (system) {
      toast({
        title: system.connected ? "Disconnected" : "Connected",
        description: `${system.name} has been ${system.connected ? "disconnected" : "connected"} successfully`
      });
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your hotel settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="platform-visibility">
            <Layers className="h-4 w-4 mr-2" />
            Platform Visibility
          </TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="app-page">
            <Smartphone className="h-4 w-4 mr-2" />
            App Page
          </TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          {isCurrentUserSuperAdmin && (
            <TabsTrigger value="admin-notifications">
              <Bell className="h-4 w-4 mr-2" />
              Admin Notifications
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="general" className="bg-white p-6 rounded-lg shadow">
          <form className="space-y-6" onSubmit={handleSaveGeneralSettings}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hotelName">Hotel Name</Label>
                <Input
                  id="hotelName"
                  name="hotelName"
                  value={generalSettings.hotelName}
                  onChange={handleGeneralSettingChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={generalSettings.email}
                  onChange={handleGeneralSettingChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={generalSettings.phone}
                  onChange={handleGeneralSettingChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralSettingChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={generalSettings.timezone}
                  onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="Asia/Muscat">Oman Time (GMT+4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select
                  value={generalSettings.currency}
                  onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.filter(currency => enabledCurrencies[currency.code]).map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.name} ({currency.symbol} {currency.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkInTime">Check-in Time</Label>
                <Input
                  id="checkInTime"
                  name="checkInTime"
                  type="time"
                  value={generalSettings.checkInTime}
                  onChange={handleGeneralSettingChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOutTime">Check-out Time</Label>
                <Input
                  id="checkOutTime"
                  name="checkOutTime"
                  type="time"
                  value={generalSettings.checkOutTime}
                  onChange={handleGeneralSettingChange}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="currencies" className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Currency Management</h3>
              <p className="text-gray-500 text-sm">Enable or disable currencies for your hotel</p>

              <form className="mt-6 space-y-6">
                <div className="mb-4">
                  <h4 className="font-medium text-md mb-2">GCC Currencies</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currencies.filter(currency => currency.isGCC).map(currency => (
                      <div key={currency.code} className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center font-medium text-green-800">
                            {currency.symbol}
                          </div>
                          <div>
                            <p className="font-medium">{currency.name}</p>
                            <p className="text-sm text-gray-500">{currency.code}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {currency.code === "OMR" && (
                            <Badge className="mr-2 bg-green-100 text-green-800 border-green-300">
                              Featured
                            </Badge>
                          )}
                          <Switch
                            checked={enabledCurrencies[currency.code] || false}
                            onCheckedChange={() => handleCurrencyToggle(currency.code)}
                            disabled={currency.code === generalSettings.currency || isCurrencyLoading}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <h4 className="font-medium text-md mb-2">Other Currencies</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currencies.filter(currency => !currency.isGCC).map(currency => (
                    <div key={currency.code} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-medium">
                          {currency.symbol}
                        </div>
                        <div>
                          <p className="font-medium">{currency.name}</p>
                          <p className="text-sm text-gray-500">{currency.code}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={enabledCurrencies[currency.code] || false}
                          onCheckedChange={() => handleCurrencyToggle(currency.code)}
                          disabled={currency.code === generalSettings.currency || isCurrencyLoading}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Changes are saved automatically when toggling currencies</p>
                  {isCurrencyLoading && <p className="text-sm text-blue-500">Saving changes...</p>}
                </div>
              </form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Notification Channels</h3>
              <p className="text-gray-500 text-sm">Configure how you receive notifications</p>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="font-medium">Email Notifications</Label>
                    <p className="text-gray-500 text-sm">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                    disabled={isNotificationsLoading}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications" className="font-medium">SMS Notifications</Label>
                    <p className="text-gray-500 text-sm">Receive notifications via text message</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={() => handleNotificationToggle("smsNotifications")}
                    disabled={isNotificationsLoading}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Notification Types</h3>
              <p className="text-gray-500 text-sm">Select which events trigger notifications</p>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bookingConfirmations" className="font-medium">Booking Confirmations</Label>
                    <p className="text-gray-500 text-sm">New bookings and reservation confirmations</p>
                  </div>
                  <Switch
                    id="bookingConfirmations"
                    checked={notificationSettings.bookingConfirmations}
                    onCheckedChange={() => handleNotificationToggle("bookingConfirmations")}
                    disabled={isNotificationsLoading}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cancellationAlerts" className="font-medium">Cancellation Alerts</Label>
                    <p className="text-gray-500 text-sm">Booking cancellations and modifications</p>
                  </div>
                  <Switch
                    id="cancellationAlerts"
                    checked={notificationSettings.cancellationAlerts}
                    onCheckedChange={() => handleNotificationToggle("cancellationAlerts")}
                    disabled={isNotificationsLoading}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lowInventoryAlerts" className="font-medium">Low Inventory Alerts</Label>
                    <p className="text-gray-500 text-sm">When room availability is running low</p>
                  </div>
                  <Switch
                    id="lowInventoryAlerts"
                    checked={notificationSettings.lowInventoryAlerts}
                    onCheckedChange={() => handleNotificationToggle("lowInventoryAlerts")}
                    disabled={isNotificationsLoading}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Reports</h3>
              <p className="text-gray-500 text-sm">Configure automatic report deliveries</p>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dailyReports" className="font-medium">Daily Reports</Label>
                    <p className="text-gray-500 text-sm">Daily summary of bookings and revenue</p>
                  </div>
                  <Switch
                    id="dailyReports"
                    checked={notificationSettings.dailyReports}
                    onCheckedChange={() => handleNotificationToggle("dailyReports")}
                    disabled={isNotificationsLoading}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyReports" className="font-medium">Weekly Reports</Label>
                    <p className="text-gray-500 text-sm">Weekly summary of bookings and revenue</p>
                  </div>
                  <Switch
                    id="weeklyReports"
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={() => handleNotificationToggle("weeklyReports")}
                    disabled={isNotificationsLoading}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="monthlyReports" className="font-medium">Monthly Reports</Label>
                    <p className="text-gray-500 text-sm">Monthly summary of bookings and revenue</p>
                  </div>
                  <Switch
                    id="monthlyReports"
                    checked={notificationSettings.monthlyReports}
                    onCheckedChange={() => handleNotificationToggle("monthlyReports")}
                    disabled={isNotificationsLoading}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Changes are saved automatically when toggling notifications.
              </p>
              {isNotificationsLoading && <p className="text-sm text-blue-500">Saving changes...</p>}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium">Brand Colors</h3>
              <p className="text-gray-500 text-sm">Customize the colors of your hotel dashboard</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input type="color" id="primaryColor" defaultValue="#6366f1" className="w-16 h-10" />
                    <Input defaultValue="#6366f1" className="font-mono" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input type="color" id="secondaryColor" defaultValue="#8b5cf6" className="w-16 h-10" />
                    <Input defaultValue="#8b5cf6" className="font-mono" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <Input type="color" id="accentColor" defaultValue="#10b981" className="w-16 h-10" />
                    <Input defaultValue="#10b981" className="font-mono" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex items-center gap-2">
                    <Input type="color" id="textColor" defaultValue="#1f2937" className="w-16 h-10" />
                    <Input defaultValue="#1f2937" className="font-mono" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveColors} disabled={isAppearanceLoading}>
                  {isAppearanceLoading ? "Saving..." : "Save Colors"}
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Palette className="h-5 w-5" /> Color Palette
                  </h3>
                  <p className="text-gray-500 text-sm">Manage your brand color palette</p>
                </div>
                <Button variant="outline" onClick={handleImportColors} disabled={isAppearanceLoading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {isAppearanceLoading ? "Importing..." : "Import Colors"}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="flex mb-4">
                    <div className="w-1/4 font-medium">Name</div>
                    <div className="w-1/4 font-medium">Color</div>
                    <div className="w-1/4 font-medium">Category</div>
                    <div className="w-1/4 font-medium">Actions</div>
                  </div>

                  {colors.map((color) => (
                    <div key={color.id} className="flex items-center py-2 border-t border-gray-200">
                      <div className="w-1/4">{color.name}</div>
                      <div className="w-1/4 flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border border-gray-200"
                          style={{ backgroundColor: color.value }}
                          aria-label={`${color.name} color: ${color.value}`}
                        />
                        <span className="text-sm font-mono">{color.value}</span>
                      </div>
                      <div className="w-1/4">
                        <Badge variant="outline">{color.category}</Badge>
                      </div>
                      <div className="w-1/4">
                        <ConfirmDeleteModal
                          itemName={`${color.name} color`}
                          onConfirmDelete={() => handleDeleteColor(color.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
                <div>
                  <Label htmlFor="colorName">Name</Label>
                  <Input
                    id="colorName"
                    value={newColor.name}
                    onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                    placeholder="Primary Blue"
                  />
                </div>

                <div>
                  <Label htmlFor="colorValue">Color Value</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={newColor.value}
                      onChange={(e) => setNewColor({ ...newColor, value: e.target.value })}
                      className="w-12 h-10"
                    />
                    <Input
                      id="colorValue"
                      value={newColor.value}
                      onChange={(e) => setNewColor({ ...newColor, value: e.target.value })}
                      className="font-mono"
                      placeholder="#0000FF"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="colorCategory">Category</Label>
                  <Select
                    value={newColor.category}
                    onValueChange={(value) => setNewColor({ ...newColor, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brand">Brand</SelectItem>
                      <SelectItem value="UI">UI</SelectItem>
                      <SelectItem value="Accent">Accent</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleAddColor} disabled={isAppearanceLoading}>
                  <Plus className="w-4 h-4 mr-2" />
                  {isAppearanceLoading ? "Adding..." : "Add Color"}
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Type className="h-5 w-5" /> Typography
                  </h3>
                  <p className="text-gray-500 text-sm">Manage your brand fonts</p>
                </div>
                <div>
                  <label htmlFor="font-upload" className="cursor-pointer">
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('font-upload')?.click()}
                        type="button"
                        disabled={isAppearanceLoading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isAppearanceLoading ? "Uploading..." : "Upload Font"}
                      </Button>
                      <input
                        id="font-upload"
                        type="file"
                        accept=".woff,.woff2,.ttf,.otf"
                        onChange={handleFontFileUpload}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="flex mb-4">
                    <div className="w-1/4 font-medium">Name</div>
                    <div className="w-1/4 font-medium">Sample</div>
                    <div className="w-1/4 font-medium">Type</div>
                    <div className="w-1/4 font-medium">Actions</div>
                  </div>

                  {fonts.map((font) => (
                    <div key={font.id} className="flex items-center py-2 border-t border-gray-200">
                      <div className="w-1/4">{font.name}</div>
                      <div className="w-1/4" style={{ fontFamily: font.family }}>
                        {font.previewText}
                      </div>
                      <div className="w-1/4">
                        <Badge variant="outline">{font.type}</Badge>
                      </div>
                      <div className="w-1/4">
                        <ConfirmDeleteModal
                          itemName={`${font.name} font`}
                          onConfirmDelete={() => handleDeleteFont(font.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
                <div>
                  <Label htmlFor="fontName">Name</Label>
                  <Input
                    id="fontName"
                    value={newFont.name}
                    onChange={(e) => setNewFont({ ...newFont, name: e.target.value })}
                    placeholder="Inter"
                  />
                </div>

                <div>
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Input
                    id="fontFamily"
                    value={newFont.family}
                    onChange={(e) => setNewFont({ ...newFont, family: e.target.value })}
                    placeholder="Inter, sans-serif"
                  />
                </div>

                <div>
                  <Label htmlFor="fontType">Type</Label>
                  <Select
                    value={newFont.type}
                    onValueChange={(value) => setNewFont({ ...newFont, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sans-serif">Sans-serif</SelectItem>
                      <SelectItem value="Serif">Serif</SelectItem>
                      <SelectItem value="Monospace">Monospace</SelectItem>
                      <SelectItem value="Display">Display</SelectItem>
                      <SelectItem value="Handwriting">Handwriting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleAddFont} disabled={isAppearanceLoading}>
                  <Plus className="w-4 h-4 mr-2" />
                  {isAppearanceLoading ? "Adding..." : "Add Font"}
                </Button>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveFonts} disabled={isAppearanceLoading}>
                  {isAppearanceLoading ? "Saving..." : "Save Font Settings"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="platform-visibility" className="bg-white p-6 rounded-lg shadow">
          <PlatformVisibilitySettings />
        </TabsContent>

        <TabsContent value="seo" className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Search Engine Optimization</h3>
              <p className="text-gray-500 text-sm">Configure SEO settings for your hotel website</p>
            </div>

            <form className="space-y-4" onSubmit={handleSaveSeoSettings}>
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Page Title</Label>
                <Input
                  id="metaTitle"
                  name="metaTitle"
                  value={seoSettings.metaTitle}
                  onChange={handleSeoSettingChange}
                  placeholder="Parkside Plaza Hotel | Luxury Stay in New York"
                />
                <p className="text-xs text-gray-500">Recommended length: 50-60 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={seoSettings.metaDescription}
                  onChange={handleSeoSettingChange}
                  placeholder="Experience luxury accommodations at Parkside Plaza Hotel in the heart of New York City."
                  className="h-24"
                />
                <p className="text-xs text-gray-500">Recommended length: 150-160 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">Social Media Image URL</Label>
                <Input
                  id="ogImage"
                  name="ogImage"
                  value={seoSettings.ogImage}
                  onChange={handleSeoSettingChange}
                  placeholder="https://example.com/images/hotel-social-share.jpg"
                />
                <p className="text-xs text-gray-500">Recommended size: 1200 × 630 pixels</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  name="googleAnalyticsId"
                  value={seoSettings.googleAnalyticsId}
                  onChange={handleSeoSettingChange}
                  placeholder="UA-123456789-1"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSeoLoading}>
                  {isSeoLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="app-page" className="bg-white p-6 rounded-lg shadow">
          <AppPageSettings />
        </TabsContent>

        <TabsContent value="integrations" className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <CreditCard className="h-5 w-5" /> Payment Methods
                  </h3>
                  <p className="text-gray-500 text-sm">Connect payment gateways to accept payments</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: method.color }}
                        >
                          {method.logo}
                        </div>
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ConfirmDeleteModal
                          itemName={`${method.name} payment method`}
                          onConfirmDelete={() => handleDeletePaymentMethod(method.id)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <div>
                        {method.connected ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            Not Connected
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConnectPaymentMethod(method.id)}
                      >
                        {method.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
                <div>
                  <Label htmlFor="paymentName">Name</Label>
                  <Input
                    id="paymentName"
                    value={newPaymentMethod.name}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, name: e.target.value })}
                    placeholder="Payment Method Name"
                  />
                </div>

                <div>
                  <Label htmlFor="paymentDescription">Description</Label>
                  <Input
                    id="paymentDescription"
                    value={newPaymentMethod.description}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, description: e.target.value })}
                    placeholder="Payment method description"
                  />
                </div>

                <div>
                  <Label htmlFor="paymentApiKey">API Key (Optional)</Label>
                  <Input
                    id="paymentApiKey"
                    value={newPaymentMethod.apiKey}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, apiKey: e.target.value })}
                    placeholder="sk_test_123456789"
                    type="password"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleAddPaymentMethod}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Globe className="h-5 w-5" /> Distribution Channels
                  </h3>
                  <p className="text-gray-500 text-sm">Connect to online travel agencies and booking platforms</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {otaSystems.map((system) => (
                  <div key={system.id} className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: system.color }}
                        >
                          {system.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{system.name}</p>
                            {system.type && <Badge variant="outline" className="text-xs">{system.type}</Badge>}
                          </div>
                          <p className="text-sm text-gray-500">{system.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ConfirmDeleteModal
                          itemName={`${system.name} distribution channel`}
                          onConfirmDelete={() => handleDeleteOtaSystem(system.id)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <div>
                        {system.connected ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            Not Connected
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConnectOtaSystem(system.id)}
                      >
                        {system.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
                <div>
                  <Label htmlFor="otaName">Name</Label>
                  <Input
                    id="otaName"
                    value={newOtaSystem.name}
                    onChange={(e) => setNewOtaSystem({ ...newOtaSystem, name: e.target.value })}
                    placeholder="Channel Name"
                  />
                </div>

                <div>
                  <Label htmlFor="otaDescription">Description</Label>
                  <Input
                    id="otaDescription"
                    value={newOtaSystem.description}
                    onChange={(e) => setNewOtaSystem({ ...newOtaSystem, description: e.target.value })}
                    placeholder="Channel description"
                  />
                </div>

                <div>
                  <Label htmlFor="otaType">Type</Label>
                  <Select
                    value={newOtaSystem.systemType}
                    onValueChange={(value) => setNewOtaSystem({ ...newOtaSystem, systemType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OTA">OTA</SelectItem>
                      <SelectItem value="GDS">GDS</SelectItem>
                      <SelectItem value="Channel Manager">Channel Manager</SelectItem>
                      <SelectItem value="Meta Search">Meta Search</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleAddOtaSystem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Distribution Channel
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Security Settings</h3>
              <p className="text-gray-500 text-sm">Configure security options for your hotel system</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Require staff to use 2FA when logging in</p>
                </div>
                <Switch id="twoFactor" />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-gray-500">Automatically log out inactive users</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="0">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">Password Policy</p>
                  <p className="text-sm text-gray-500">Set minimum requirements for passwords</p>
                </div>
                <Select defaultValue="strong">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="strong">Strong</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">Force Password Reset</p>
                  <p className="text-sm text-gray-500">Force all users to reset their passwords</p>
                </div>
                <Button variant="outline">Force Reset</Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="admin-notifications" className="bg-white p-6 rounded-lg shadow">
          {isCurrentUserSuperAdmin && <NotificationManager />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsContent;