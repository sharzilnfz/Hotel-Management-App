import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DollarSign, Percent, Plus } from "lucide-react";

// Define tax rule interface
interface TaxRule {
  id: string;
  serviceType: string;
  subType?: string;
  enabled: boolean;
  taxType: "percentage" | "fixed";
  value: number;
  department?: string;
  isGlobal?: boolean;
}

// Define service type by department
interface DepartmentService {
  department: string;
  services: {
    id: string;
    name: string;
  }[];
}

const TaxSettingsContent = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTaxRule, setNewTaxRule] = useState<{
    department: string;
    serviceId: string;
    taxType: "percentage" | "fixed";
    value: number;
  }>({
    department: "",
    serviceId: "",
    taxType: "percentage",
    value: 0
  });
  
  // Department services mapping
  const departmentServices: DepartmentService[] = [
    {
      department: "Rooms",
      services: [
        { id: "standard", name: "Standard Room" },
        { id: "deluxe", name: "Deluxe Room" },
        { id: "suite", name: "Suite" },
        { id: "penthouse", name: "Penthouse" }
      ]
    },
    {
      department: "Spa",
      services: [
        { id: "massage", name: "Massage" },
        { id: "facial", name: "Facial" },
        { id: "sauna", name: "Sauna" },
        { id: "manicure", name: "Manicure & Pedicure" }
      ]
    },
    {
      department: "Events",
      services: [
        { id: "conference", name: "Conference" },
        { id: "wedding", name: "Wedding" },
        { id: "birthday", name: "Birthday" },
        { id: "corporate", name: "Corporate Event" }
      ]
    },
    {
      department: "Restaurant",
      services: [
        { id: "dine-in", name: "Dine-In" },
        { id: "room-service", name: "Room Service" },
        { id: "delivery", name: "Delivery" },
        { id: "buffet", name: "Buffet" }
      ]
    },
  ];
  
  // Initial tax rules for each service type
  const [taxRules, setTaxRules] = useState<TaxRule[]>([
    {
      id: "room-standard",
      serviceType: "room",
      subType: "Standard Room",
      enabled: true,
      taxType: "percentage",
      value: 8,
      department: "Rooms"
    },
    {
      id: "room-deluxe",
      serviceType: "room",
      subType: "Deluxe Room",
      enabled: true,
      taxType: "percentage",
      value: 10,
      department: "Rooms"
    },
    {
      id: "room-suite",
      serviceType: "room",
      subType: "Suite",
      enabled: true,
      taxType: "percentage",
      value: 12,
      department: "Rooms"
    },
    {
      id: "spa-massage",
      serviceType: "spa",
      subType: "Massage",
      enabled: true,
      taxType: "percentage",
      value: 5,
      department: "Spa"
    },
    {
      id: "spa-facial",
      serviceType: "spa",
      subType: "Facial",
      enabled: true,
      taxType: "percentage",
      value: 5,
      department: "Spa"
    },
    {
      id: "event-conference",
      serviceType: "event",
      subType: "Conference",
      enabled: true,
      taxType: "percentage",
      value: 7,
      department: "Events"
    },
    {
      id: "event-wedding",
      serviceType: "event",
      subType: "Wedding",
      enabled: true,
      taxType: "percentage",
      value: 7,
      department: "Events"
    },
    {
      id: "restaurant-dine-in",
      serviceType: "restaurant",
      subType: "Dine-In",
      enabled: true,
      taxType: "percentage",
      value: 6,
      department: "Restaurant"
    },
    {
      id: "restaurant-room-service",
      serviceType: "restaurant",
      subType: "Room Service",
      enabled: true,
      taxType: "percentage",
      value: 8,
      department: "Restaurant"
    },
    {
      id: "restaurant-delivery",
      serviceType: "restaurant",
      subType: "Delivery",
      enabled: true,
      taxType: "percentage",
      value: 6,
      department: "Restaurant"
    }
  ]);

  // Handle tax rule change
  const handleTaxRuleChange = (id: string, field: string, value: any) => {
    setTaxRules(prev => 
      prev.map(rule => 
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  // Handle save changes
  const handleSaveChanges = () => {
    toast({
      title: "Tax settings saved",
      description: "Your tax settings have been updated successfully.",
    });
  };

  // Get rules for a specific service type
  const getRulesByServiceType = (serviceType: string) => {
    return taxRules.filter(rule => rule.serviceType === serviceType);
  };

  // Get available services for selected department
  const getServicesForDepartment = (department: string) => {
    if (department === "All Departments") {
      return [{ id: "all", name: "All Services" }];
    }
    
    const found = departmentServices.find(d => d.department === department);
    return found ? [{ id: "all", name: "All Services" }, ...found.services] : [];
  };

  // Handle form input changes
  const handleFormChange = (field: string, value: any) => {
    if (field === "department" && value !== newTaxRule.department) {
      setNewTaxRule(prev => ({
        ...prev,
        [field]: value,
        serviceId: ""
      }));
    } else {
      setNewTaxRule(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Create new tax rule
  const handleCreateTaxRule = () => {
    const { department, serviceId, taxType, value } = newTaxRule;
    
    if (!department || !serviceId || value === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (department === "All Departments" && serviceId === "all") {
      const id = `global-${taxType}-${Date.now()}`;
      
      const newRule: TaxRule = {
        id,
        serviceType: "global",
        subType: "All Services",
        enabled: true,
        taxType,
        value,
        department: "All Departments",
        isGlobal: true
      };
      
      setTaxRules(prev => [...prev, newRule]);
      
      toast({
        title: "Global tax rule created",
        description: `New tax rule has been created for all departments and services`
      });
    } else if (department === "All Departments") {
      toast({
        title: "Invalid selection",
        description: "When selecting All Departments, you must select All Services",
        variant: "destructive"
      });
      return;
    } else if (serviceId === "all") {
      const id = `${department.toLowerCase()}-all-${Date.now()}`;
      
      const newRule: TaxRule = {
        id,
        serviceType: department.toLowerCase(),
        subType: "All Services",
        enabled: true,
        taxType,
        value,
        department
      };
      
      setTaxRules(prev => [...prev, newRule]);
      
      toast({
        title: "Department tax rule created",
        description: `New tax rule has been created for all ${department} services`
      });
    } else {
      const deptInfo = departmentServices.find(d => d.department === department);
      if (!deptInfo) return;
      
      const serviceInfo = deptInfo.services.find(s => s.id === serviceId);
      if (!serviceInfo) return;
      
      const serviceType = department.toLowerCase();
      const id = `${serviceType}-${serviceId}-${Date.now()}`;
      
      const newRule: TaxRule = {
        id,
        serviceType,
        subType: serviceInfo.name,
        enabled: true,
        taxType,
        value,
        department
      };
      
      setTaxRules(prev => [...prev, newRule]);
      
      toast({
        title: "Tax rule created",
        description: `New tax rule for ${serviceInfo.name} has been created`
      });
    }
    
    setNewTaxRule({
      department: "",
      serviceId: "",
      taxType: "percentage",
      value: 0
    });
    
    setDialogOpen(false);
  };

  // Tax rule table component
  const TaxRuleTable = ({ rules }: { rules: TaxRule[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Tax Type</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell className="font-medium">{rule.subType}</TableCell>
            <TableCell>
              <Select
                value={rule.taxType}
                onValueChange={(value) => handleTaxRuleChange(rule.id, 'taxType', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">
                    <span className="flex items-center">
                      <Percent className="mr-2 h-4 w-4" />
                      Percentage
                    </span>
                  </SelectItem>
                  <SelectItem value="fixed">
                    <span className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Fixed Amount
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                {rule.taxType === "percentage" ? (
                  <>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={rule.value}
                      onChange={(e) => handleTaxRuleChange(rule.id, 'value', parseFloat(e.target.value) || 0)}
                      className="w-20 mr-2"
                    />
                    <span>%</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">$</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={rule.value}
                      onChange={(e) => handleTaxRuleChange(rule.id, 'value', parseFloat(e.target.value) || 0)}
                      className="w-20"
                    />
                  </>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={(checked) => handleTaxRuleChange(rule.id, 'enabled', checked)}
                />
                <span className="ml-2">{rule.enabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tax Settings</h1>
          <p className="text-gray-500 mt-1">Manage tax rates for all hotel services</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> 
              Add New Tax Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Tax Rule</DialogTitle>
              <DialogDescription>
                Select the department and service to apply a new tax rule
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  onValueChange={(value) => handleFormChange("department", value)}
                  value={newTaxRule.department}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Departments">All Departments</SelectItem>
                    {departmentServices.map((dept) => (
                      <SelectItem key={dept.department} value={dept.department}>
                        {dept.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <Select 
                  onValueChange={(value) => handleFormChange("serviceId", value)}
                  value={newTaxRule.serviceId}
                  disabled={!newTaxRule.department}
                >
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {getServicesForDepartment(newTaxRule.department).map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="taxType">Tax Type</Label>
                <Select 
                  onValueChange={(value: "percentage" | "fixed") => handleFormChange("taxType", value)}
                  value={newTaxRule.taxType}
                >
                  <SelectTrigger id="taxType">
                    <SelectValue placeholder="Select tax type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">
                      <span className="flex items-center">
                        <Percent className="mr-2 h-4 w-4" />
                        Percentage
                      </span>
                    </SelectItem>
                    <SelectItem value="fixed">
                      <span className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Fixed Amount
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="value">
                  {newTaxRule.taxType === "percentage" ? "Percentage Value" : "Fixed Amount"}
                </Label>
                <div className="flex items-center">
                  {newTaxRule.taxType === "percentage" ? (
                    <>
                      <Input
                        id="value"
                        type="number"
                        min="0"
                        max="100"
                        value={newTaxRule.value}
                        onChange={(e) => handleFormChange("value", parseFloat(e.target.value) || 0)}
                        className="w-20 mr-2"
                      />
                      <span>%</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2">$</span>
                      <Input
                        id="value"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newTaxRule.value}
                        onChange={(e) => handleFormChange("value", parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTaxRule}>Create Tax Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tax Configuration</CardTitle>
          <CardDescription>
            Set up tax rates for different services. Taxes will be automatically applied during checkout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rooms" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="spa">Spa</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
              {taxRules.some(rule => rule.isGlobal) && (
                <TabsTrigger value="global">Global Rules</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="rooms">
              <div className="space-y-4">
                <TaxRuleTable rules={getRulesByServiceType('room')} />
              </div>
            </TabsContent>

            <TabsContent value="spa">
              <div className="space-y-4">
                <TaxRuleTable rules={getRulesByServiceType('spa')} />
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="space-y-4">
                <TaxRuleTable rules={getRulesByServiceType('event')} />
              </div>
            </TabsContent>

            <TabsContent value="restaurant">
              <div className="space-y-4">
                <TaxRuleTable rules={getRulesByServiceType('restaurant')} />
              </div>
            </TabsContent>

            {taxRules.some(rule => rule.isGlobal) && (
              <TabsContent value="global">
                <div className="space-y-4">
                  <TaxRuleTable rules={taxRules.filter(rule => rule.isGlobal)} />
                </div>
              </TabsContent>
            )}
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxSettingsContent;
