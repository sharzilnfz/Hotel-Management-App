
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Download, Calendar, ChartBar, ChartPie, Filter, FileText, Printer } from "lucide-react";

const RestaurantReportsContent = () => {
  const [timePeriod, setTimePeriod] = useState("month");
  const [filterType, setFilterType] = useState("all");
  
  // Mock data for reports
  const salesData = [
    { month: "Jan", revenue: 14500 },
    { month: "Feb", revenue: 16200 },
    { month: "Mar", revenue: 18900 },
    { month: "Apr", revenue: 21000 },
    { month: "May", revenue: 19500 },
    { month: "Jun", revenue: 22800 },
    { month: "Jul", revenue: 24100 },
    { month: "Aug", revenue: 26300 },
    { month: "Sep", revenue: 23800 },
    { month: "Oct", revenue: 25600 },
    { month: "Nov", revenue: 27400 },
    { month: "Dec", revenue: 32500 },
  ];
  
  const categoryData = [
    { name: "Appetizers", value: 25, fill: "#3b82f6" },
    { name: "Main Course", value: 40, fill: "#10b981" },
    { name: "Desserts", value: 15, fill: "#f59e0b" },
    { name: "Beverages", value: 20, fill: "#6366f1" },
  ];
  
  const topSellingItems = [
    { id: 1, name: "Wagyu Beef Steak", category: "Main Course", quantity: 280, revenue: 16800 },
    { id: 2, name: "Truffle Risotto", category: "Main Course", quantity: 245, revenue: 9800 },
    { id: 3, name: "Chocolate Soufflé", category: "Desserts", quantity: 210, revenue: 4200 },
    { id: 4, name: "Signature Cocktail", category: "Beverages", quantity: 195, revenue: 3900 },
    { id: 5, name: "Lobster Bisque", category: "Appetizers", quantity: 185, revenue: 5550 },
  ];
  
  const hourlyData = [
    { hour: "12 PM", orders: 15 },
    { hour: "1 PM", orders: 28 },
    { hour: "2 PM", orders: 22 },
    { hour: "3 PM", orders: 12 },
    { hour: "4 PM", orders: 8 },
    { hour: "5 PM", orders: 14 },
    { hour: "6 PM", orders: 32 },
    { hour: "7 PM", orders: 45 },
    { hour: "8 PM", orders: 52 },
    { hour: "9 PM", orders: 38 },
    { hour: "10 PM", orders: 25 },
    { hour: "11 PM", orders: 12 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ChartBar className="h-5 w-5 text-hotel-primary" />
          <h2 className="text-xl font-semibold">Restaurant Performance Analytics</h2>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>Time Period:</span>
        </div>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-2 ml-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span>Category:</span>
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="appetizers">Appetizers</SelectItem>
            <SelectItem value="mains">Main Course</SelectItem>
            <SelectItem value="desserts">Desserts</SelectItem>
            <SelectItem value="beverages">Beverages</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$78,650</div>
            <p className="text-sm text-green-600">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,245</div>
            <p className="text-sm text-green-600">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$63.17</div>
            <p className="text-sm text-red-600">-2% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Top Items</TabsTrigger>
          <TabsTrigger value="hourly">Hourly Analysis</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="items" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Selling Items</CardTitle>
              <FileText className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity Sold</TableHead>
                      <TableHead>Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSellingItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.revenue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hourly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders by Hour</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sales by Category</CardTitle>
              <ChartPie className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestaurantReportsContent;
