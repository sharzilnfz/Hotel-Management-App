import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, AlertTriangle, Loader2 } from "lucide-react";
import axios from "axios";

// API base URL
const API_BASE_URL = "http://localhost:4000/api";

const SuppliesManagement = () => {
  const [supplies, setSupplies] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      currentStock: 0,
      minStock: 0,
      unit: "",
    }
  });

  // Fetch supplies from API
  const fetchSupplies = async () => {
    setLoading(true);
    try {
      console.log("Frontend - Fetching supplies from:", `${API_BASE_URL}/house-keeping/supplies`);
      const response = await axios.get(`${API_BASE_URL}/house-keeping/supplies`);
      console.log("Frontend - API response:", response);

      if (response.data.status === 'success') {
        setSupplies(response.data.data.supplies);
        console.log("Frontend - Supplies loaded:", response.data.data.supplies.length);
      }
    } catch (error) {
      console.error("Frontend - Error fetching supplies:", error);

      // Provide more specific error messages based on the error type
      let errorMessage = "Failed to load supplies. Please try again.";

      if (error.code === "ERR_NETWORK") {
        errorMessage = "Network error: Cannot connect to the server. Please make sure the backend is running on port 4000.";
      } else if (error.response) {
        // The request was made and the server responded with a status code
        errorMessage = `Server error (${error.response.status}): ${error.response.data.message || "Unknown error"}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your backend server.";
      }

      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load supplies on component mount
  useEffect(() => {
    fetchSupplies();
  }, []);

  const handleSubmit = async (data) => {
    try {
      // Ensure numerical values are properly converted to numbers
      const formattedData = {
        ...data,
        currentStock: Number(data.currentStock),
        minStock: Number(data.minStock)
      };

      console.log("Frontend - Submitting new supply data:", formattedData);

      const response = await axios.post(`${API_BASE_URL}/house-keeping/supplies`, formattedData);
      console.log("Frontend - Response from API:", response.data);

      if (response.data.status === 'success') {
        // Add new supply to the list
        setSupplies([...supplies, response.data.data.supply]);
        setOpen(false);
        form.reset();

        toast({
          title: "Supply Added",
          description: `${data.name} has been added to the inventory.`,
        });
      }
    } catch (error) {
      console.error("Frontend - Error adding supply:", error);
      console.error("Frontend - Error details:", error.response?.data);

      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add supply. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateSupplyStock = async (supplyId, amount) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/house-keeping/supplies/${supplyId}/stock`, {
        amount: amount
      });

      if (response.data.status === 'success') {
        // Update the supply in the list
        const updatedSupplies = supplies.map(supply => {
          if (supply._id === supplyId) {
            return response.data.data.supply;
          }
          return supply;
        });

        setSupplies(updatedSupplies);

        toast({
          title: "Stock Updated",
          description: "The inventory has been updated.",
        });
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update stock. Please try again.",
        variant: "destructive",
      });
    }
  };

  const orderSupplies = async (supplyId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/house-keeping/supplies/${supplyId}/order`, {
        quantity: 100 // Default order quantity
      });

      if (response.data.status === 'success') {
        // Update the supply in the list
        const updatedSupplies = supplies.map(supply => {
          if (supply._id === supplyId) {
            return response.data.data.supply;
          }
          return supply;
        });

        setSupplies(updatedSupplies);

        toast({
          title: "Order Placed",
          description: `An order has been placed for ${response.data.data.supply.name}.`,
        });
      }
    } catch (error) {
      console.error("Error ordering supply:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Supplies Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Supply</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supply</DialogTitle>
              <DialogDescription>
                Add a new item to the housekeeping inventory.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supply Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Towels" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentStock"
                  rules={{
                    required: "Current stock is required",
                    min: {
                      value: 0,
                      message: "Stock cannot be negative"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Stock</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minStock"
                  rules={{
                    required: "Minimum stock is required",
                    min: {
                      value: 0,
                      message: "Minimum stock cannot be negative"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Stock Level</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  rules={{ required: "Unit is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit (piece, bottle, etc.)</FormLabel>
                      <FormControl>
                        <Input placeholder="piece" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Add Supply</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {/* Low Stock Alerts */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-amber-800">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {supplies.filter(supply => supply.status === "low").map(supply => (
                  <div key={supply._id} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm">
                    <div>
                      <p className="font-medium">{supply.name}</p>
                      <p className="text-sm text-gray-500">Current: {supply.currentStock} {supply.unit}s (Min: {supply.minStock})</p>
                    </div>
                    <Button onClick={() => orderSupplies(supply._id)} size="sm" variant="outline" className="text-amber-600 border-amber-600 hover:bg-amber-50">
                      Order Now
                    </Button>
                  </div>
                ))}
                {supplies.filter(supply => supply.status === "low").length === 0 && (
                  <p className="text-center py-2 text-gray-500">No supplies are currently below minimum stock levels.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Minimum Stock</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Ordered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplies.map(supply => (
                      <TableRow key={supply._id}>
                        <TableCell className="font-medium">{supply.name}</TableCell>
                        <TableCell>{supply.currentStock}</TableCell>
                        <TableCell>{supply.minStock}</TableCell>
                        <TableCell>{supply.unit}</TableCell>
                        <TableCell>
                          <Badge className={supply.status === "low" ? "bg-red-100 text-red-800 hover:bg-red-100" : "bg-green-100 text-green-800 hover:bg-green-100"}>
                            {supply.status === "low" ? "Low Stock" : "Adequate"}
                          </Badge>
                        </TableCell>
                        <TableCell>{supply.lastOrdered}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateSupplyStock(supply._id, 10)}
                          >
                            Add 10
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-amber-600 text-amber-600 hover:bg-amber-50"
                            onClick={() => orderSupplies(supply._id)}
                          >
                            Order
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {supplies.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                          No supplies found. Add supplies to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SuppliesManagement;
