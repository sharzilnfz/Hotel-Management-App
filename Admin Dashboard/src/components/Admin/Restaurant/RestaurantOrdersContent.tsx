
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Mock data for restaurant orders
const mockOrders = [
  {
    id: "101",
    tableNumber: "12",
    items: ["Continental Breakfast", "Coffee"],
    status: "completed",
    total: 22.50,
    timestamp: "2025-04-09T08:32:00Z",
    customerName: "John Smith",
    roomNumber: "304"
  },
  {
    id: "102",
    tableNumber: "-",
    items: ["Caesar Salad", "Iced Tea"],
    status: "in-progress",
    total: 18.00,
    timestamp: "2025-04-09T12:15:00Z",
    customerName: "Jane Doe",
    roomNumber: "512"
  },
  {
    id: "103",
    tableNumber: "8",
    items: ["Filet Mignon", "Red Wine", "Chocolate Lava Cake"],
    status: "ordered",
    total: 64.50,
    timestamp: "2025-04-09T18:45:00Z",
    customerName: "Robert Johnson",
    roomNumber: "-"
  },
  {
    id: "104",
    tableNumber: "5",
    items: ["Club Sandwich", "French Fries", "Coke"],
    status: "ordered",
    total: 24.50,
    timestamp: "2025-04-09T13:10:00Z",
    customerName: "Emma Wilson",
    roomNumber: "201"
  },
  {
    id: "105",
    tableNumber: "3",
    items: ["Pasta Primavera", "Garlic Bread", "Sparkling Water"],
    status: "in-progress",
    total: 28.75,
    timestamp: "2025-04-09T19:20:00Z",
    customerName: "Michael Brown",
    roomNumber: "-"
  },
  {
    id: "106",
    tableNumber: "-",
    items: ["Grilled Salmon", "House Salad", "White Wine"],
    status: "completed",
    total: 42.00,
    timestamp: "2025-04-09T20:05:00Z",
    customerName: "Sarah Davis",
    roomNumber: "405"
  },
  {
    id: "107",
    tableNumber: "-",
    items: ["New York Cheesecake", "Coffee"],
    status: "cancelled",
    total: 16.50,
    timestamp: "2025-04-09T21:30:00Z",
    customerName: "David Miller",
    roomNumber: "610"
  }
];

const RestaurantOrdersContent: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          order.id.includes(searchQuery);
    const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateOrderStatus = (id: string, newStatus: string) => {
    toast.success(`Order ${id} status updated to ${newStatus}`);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "ordered":
        return <Badge className="bg-yellow-500">Ordered</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Restaurant Orders</h2>
        <Button onClick={() => navigate("/admin/restaurant")}>
          Back to Menu Items
        </Button>
      </div>
      
      <div className="my-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, order ID or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ordered">Ordered</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Room / Table</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">No orders found</TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
                    <TableCell>
                      {order.roomNumber !== "-" ? (
                        <span>Room {order.roomNumber}</span>
                      ) : (
                        <span>Table {order.tableNumber}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {order.items.join(", ")}
                      </div>
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={order.status}
                        onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Update" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ordered">Ordered</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantOrdersContent;
