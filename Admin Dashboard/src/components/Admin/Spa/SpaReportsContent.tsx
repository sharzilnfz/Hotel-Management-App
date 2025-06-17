
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  LineChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  Download, 
  CalendarRange, 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp 
} from "lucide-react";
import { addDays, format, subDays } from "date-fns";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const SpaReportsContent = () => {
  const [activeTab, setActiveTab] = useState("revenue");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [timeframe, setTimeframe] = useState("monthly");

  // Mock data for revenue chart
  const revenueData = [
    { name: 'Jan', massage: 4000, facial: 2400, body: 1800 },
    { name: 'Feb', massage: 5000, facial: 1398, body: 2210 },
    { name: 'Mar', massage: 6000, facial: 4000, body: 2290 },
    { name: 'Apr', massage: 8780, facial: 3908, body: 2000 },
    { name: 'May', massage: 9890, facial: 4800, body: 2181 },
    { name: 'Jun', massage: 10000, facial: 5800, body: 2500 },
  ];

  // Mock data for appointments
  const appointmentsData = [
    { name: 'Jan', bookings: 65 },
    { name: 'Feb', bookings: 78 },
    { name: 'Mar', bookings: 82 },
    { name: 'Apr', bookings: 95 },
    { name: 'May', bookings: 110 },
    { name: 'Jun', bookings: 120 },
  ];

  // Mock data for service popularity
  const servicePopularityData = [
    { name: 'Swedish Massage', value: 30 },
    { name: 'Deep Tissue', value: 25 },
    { name: 'Hot Stone', value: 15 },
    { name: 'Aromatherapy', value: 12 },
    { name: 'Facial Treatment', value: 10 },
    { name: 'Body Wrap', value: 8 },
  ];

  // Mock data for specialist performance
  const specialistPerformanceData = [
    { name: 'Emily', clients: 142, revenue: 15600, rating: 4.9 },
    { name: 'Michael', clients: 98, revenue: 11200, rating: 4.8 },
    { name: 'Sophia', clients: 156, revenue: 18400, rating: 5.0 },
    { name: 'Olivia', clients: 112, revenue: 13800, rating: 4.7 },
    { name: 'Thomas', clients: 86, revenue: 9800, rating: 4.6 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Spa Reports</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          <span>Export Report</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-gray-500">Total Revenue (30 days)</span>
              <span className="text-3xl font-bold">$42,580</span>
              <span className="text-sm text-green-500">+12% from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-gray-500">Total Appointments (30 days)</span>
              <span className="text-3xl font-bold">324</span>
              <span className="text-sm text-green-500">+8% from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-gray-500">Average Rating</span>
              <span className="text-3xl font-bold">4.8/5.0</span>
              <span className="text-sm text-green-500">+0.2 from previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
            <CardTitle>Reports Dashboard</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
              <DateRangePicker
                value={dateRange}
                onValueChange={setDateRange}
              />
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue" className="w-full" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="specialists">Specialists</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChartIcon className="mr-2" size={16} />
                    Revenue by Service Category
                  </CardTitle>
                  <CardDescription>
                    Revenue breakdown by service category over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={revenueData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="massage" fill="#8884d8" name="Massage" />
                        <Bar dataKey="facial" fill="#82ca9d" name="Facial" />
                        <Bar dataKey="body" fill="#ffc658" name="Body Treatment" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appointments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarRange className="mr-2" size={16} />
                    Appointments Trend
                  </CardTitle>
                  <CardDescription>
                    Number of appointments over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        width={500}
                        height={300}
                        data={appointmentsData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="bookings" stroke="#8884d8" activeDot={{ r: 8 }} name="Appointments" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="services" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="mr-2" size={16} />
                    Service Popularity
                  </CardTitle>
                  <CardDescription>
                    Distribution of service bookings by type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={400} height={400}>
                        <Pie
                          data={servicePopularityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {servicePopularityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specialists" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2" size={16} />
                    Specialist Performance
                  </CardTitle>
                  <CardDescription>
                    Performance metrics by specialist
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={specialistPerformanceData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="clients" fill="#8884d8" name="Clients" />
                        <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue ($100s)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpaReportsContent;
