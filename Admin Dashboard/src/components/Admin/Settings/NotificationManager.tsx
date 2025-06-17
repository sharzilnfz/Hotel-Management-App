
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Send, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  type: "new" | "regular" | "loyal";
}

const NotificationManager = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [customerSegment, setCustomerSegment] = useState("all");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  
  // Mock data for demonstration purposes
  const customers: Customer[] = [
    { id: "1", name: "John Doe", email: "john@example.com", joinDate: "2023-01-15", type: "loyal" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", joinDate: "2023-03-22", type: "regular" },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", joinDate: "2023-10-05", type: "new" },
    { id: "4", name: "Sarah Williams", email: "sarah@example.com", joinDate: "2022-11-18", type: "loyal" },
    { id: "5", name: "Alex Brown", email: "alex@example.com", joinDate: "2024-03-30", type: "new" },
  ];
  
  const getFilteredCustomers = () => {
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);
    
    switch (customerSegment) {
      case "new":
        return customers.filter(customer => new Date(customer.joinDate) >= oneMonthAgo);
      case "old":
        return customers.filter(customer => new Date(customer.joinDate) < oneMonthAgo);
      case "selected":
        return customers.filter(customer => selectedCustomers.includes(customer.id));
      case "all":
      default:
        return customers;
    }
  };
  
  const handleSendNotification = () => {
    if (!title || !message) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and message for the notification",
        variant: "destructive"
      });
      return;
    }
    
    const targetCustomers = getFilteredCustomers();
    
    // In a real application, this would send the notification to the backend
    toast({
      title: "Notifications Sent",
      description: `Sent to ${targetCustomers.length} customers successfully`
    });
    
    setTitle("");
    setMessage("");
  };
  
  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Customer Notifications
        </CardTitle>
        <CardDescription>Send notifications to your customers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="notificationTitle">Notification Title</Label>
            <Input 
              id="notificationTitle" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
            />
          </div>
          
          <div>
            <Label htmlFor="notificationMessage">Message</Label>
            <Textarea 
              id="notificationMessage" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              rows={5}
            />
          </div>
          
          <div>
            <Label htmlFor="customerSegment">Target Audience</Label>
            <Select 
              value={customerSegment}
              onValueChange={(value) => {
                setCustomerSegment(value);
                if (value !== "selected") {
                  setSelectedCustomers([]);
                }
              }}
            >
              <SelectTrigger id="customerSegment">
                <SelectValue placeholder="Select customer segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="new">New Customers (Last 30 Days)</SelectItem>
                <SelectItem value="old">Existing Customers (Before 30 Days)</SelectItem>
                <SelectItem value="selected">Selected Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {customerSegment === "selected" && (
            <div className="border rounded-md p-4 max-h-60 overflow-y-auto space-y-2">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Select Customers</Label>
                <div className="text-xs text-gray-500">
                  {selectedCustomers.length} selected
                </div>
              </div>
              {customers.map((customer) => (
                <div key={customer.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`customer-${customer.id}`} 
                    checked={selectedCustomers.includes(customer.id)}
                    onCheckedChange={() => toggleCustomerSelection(customer.id)}
                  />
                  <Label htmlFor={`customer-${customer.id}`} className="flex flex-1 justify-between">
                    <span>{customer.name}</span>
                    <span className="text-xs text-gray-500">{customer.email}</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
          
          <div>
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <Users size={16} />
                Notification Preview
              </div>
              <div className="text-sm text-gray-500 mb-1">
                Target audience: {
                  customerSegment === "all" ? "All Customers" :
                  customerSegment === "new" ? "New Customers (Last 30 Days)" :
                  customerSegment === "old" ? "Existing Customers (Before 30 Days)" :
                  "Selected Customers"
                }
              </div>
              <div className="text-sm text-gray-500">
                Recipients: {getFilteredCustomers().length} customers
              </div>
            </div>
            <Button 
              onClick={handleSendNotification} 
              className="w-full"
              disabled={!title || !message}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Notification
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationManager;
