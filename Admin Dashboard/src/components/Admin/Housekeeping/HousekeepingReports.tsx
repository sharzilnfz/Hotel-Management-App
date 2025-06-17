
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, PieChart, LineChart } from "@/components/ui/charts";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Download,
  Calendar
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Sample data for productivity report
const productivityData = [
  { name: "John Smith", tasksCompleted: 145, averageTimePerTask: 23 },
  { name: "Maria Garcia", tasksCompleted: 162, averageTimePerTask: 21 },
  { name: "David Lee", tasksCompleted: 128, averageTimePerTask: 25 },
  { name: "Sarah Johnson", tasksCompleted: 149, averageTimePerTask: 22 },
  { name: "Michael Brown", tasksCompleted: 131, averageTimePerTask: 24 }
];

// Sample data for room turnover report
const roomTurnoverChartData = [
  { month: "Jan", turnoverTime: 32 },
  { month: "Feb", turnoverTime: 28 },
  { month: "Mar", turnoverTime: 30 },
  { month: "Apr", turnoverTime: 25 },
  { month: "May", turnoverTime: 22 },
  { month: "Jun", turnoverTime: 20 },
  { month: "Jul", turnoverTime: 21 },
  { month: "Aug", turnoverTime: 23 },
  { month: "Sep", turnoverTime: 26 },
  { month: "Oct", turnoverTime: 28 },
  { month: "Nov", turnoverTime: 30 },
  { month: "Dec", turnoverTime: 32 }
];

// Sample data for supplies usage report
const suppliesUsageChartData = [
  { supply: "Towels", usage: 850 },
  { supply: "Bed Sheets", usage: 620 },
  { supply: "Toilet Paper", usage: 1250 },
  { supply: "Shampoo", usage: 430 },
  { supply: "Soap", usage: 720 },
  { supply: "Cleaning Solution", usage: 350 }
];

// Sample data for cleaning quality ratings
const cleaningQualityChartData = [
  { category: "Excellent", value: 68 },
  { category: "Good", value: 22 },
  { category: "Average", value: 8 },
  { category: "Poor", value: 2 }
];

const HousekeepingReports = () => {
  const [reportPeriod, setReportPeriod] = useState("last-month");
  const [activeTab, setActiveTab] = useState("productivity");
  const { toast } = useToast();

  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: `The ${activeTab} report has been downloaded.`,
    });
  };

  // Bar chart configuration for staff productivity
  const productivityChartConfig = {
    xAxis: [
      {
        data: productivityData.map(item => item.name),
        scaleType: "band",
      },
    ],
    series: [
      {
        data: productivityData.map(item => item.tasksCompleted),
        type: "bar" as const,
        label: "Tasks Completed",
        color: "#4f46e5",
      },
    ],
    height: 300,
  };

  // Line chart configuration for room turnover time trend
  const roomTurnoverConfig = {
    xAxis: [
      {
        data: roomTurnoverChartData.map(item => item.month),
        scaleType: "band",
      },
    ],
    series: [
      {
        data: roomTurnoverChartData.map(item => item.turnoverTime),
        label: "Avg Turnover Time (min)",
        color: "#10b981",
        type: "line" as const,
        curve: "linear" as const,
      },
    ],
    height: 300,
  };

  // Bar chart configuration for supplies usage
  const suppliesUsageConfig = {
    xAxis: [
      {
        data: suppliesUsageChartData.map(item => item.supply),
        scaleType: "band",
      },
    ],
    series: [
      {
        data: suppliesUsageChartData.map(item => item.usage),
        label: "Usage (units)",
        color: "#f59e0b",
        type: "bar" as const,
      },
    ],
    height: 300,
  };

  // Pie chart configuration for cleaning quality
  const cleaningQualityConfig = {
    series: [
      {
        data: cleaningQualityChartData.map(item => ({
          id: item.category,
          value: item.value,
          label: `${item.category} (${item.value}%)`,
        })),
        type: "pie" as const,
        highlightScope: { faded: "global", highlighted: "item" },
        innerRadius: 30,
        outerRadius: 100,
        paddingAngle: 2,
        cornerRadius: 4,
        startAngle: -90,
        endAngle: 270,
      },
    ],
    height: 300,
    legend: { hidden: false },
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Housekeeping Reports</h1>

        <div className="flex items-center gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={handleDownloadReport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="productivity" className="flex items-center gap-2">
            <BarChartIcon className="h-4 w-4" />
            <span className="hidden md:inline">Staff Productivity</span>
            <span className="inline md:hidden">Productivity</span>
          </TabsTrigger>
          <TabsTrigger value="turnover" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            <span className="hidden md:inline">Room Turnover</span>
            <span className="inline md:hidden">Turnover</span>
          </TabsTrigger>
          <TabsTrigger value="supplies" className="flex items-center gap-2">
            <BarChartIcon className="h-4 w-4" />
            <span className="hidden md:inline">Supplies Usage</span>
            <span className="inline md:hidden">Supplies</span>
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            <span className="hidden md:inline">Cleaning Quality</span>
            <span className="inline md:hidden">Quality</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="productivity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Productivity Report</CardTitle>
              <CardDescription>
                Number of tasks completed by each staff member during {reportPeriod.replace('-', ' ')}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart config={productivityChartConfig} />

              <div className="mt-6 border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left">Staff Member</th>
                      <th className="p-3 text-center">Tasks Completed</th>
                      <th className="p-3 text-center">Avg Time Per Task (min)</th>
                      <th className="p-3 text-center">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productivityData.map((staff, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{staff.name}</td>
                        <td className="p-3 text-center">{staff.tasksCompleted}</td>
                        <td className="p-3 text-center">{staff.averageTimePerTask} min</td>
                        <td className="p-3 text-center">
                          <span
                            className={
                              staff.averageTimePerTask < 22
                                ? "text-green-600 font-medium"
                                : staff.averageTimePerTask > 24
                                  ? "text-amber-600 font-medium"
                                  : "text-blue-600 font-medium"
                            }
                          >
                            {staff.averageTimePerTask < 22
                              ? "Excellent"
                              : staff.averageTimePerTask > 24
                                ? "Needs Improvement"
                                : "Good"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="turnover" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Room Turnover Time Trend</CardTitle>
              <CardDescription>
                Average time (in minutes) to prepare rooms after checkout throughout the year.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart config={roomTurnoverConfig} />

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Fastest Turnover</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">20 min</div>
                    <p className="text-sm text-muted-foreground">June 2025</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Current Average</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">26 min</div>
                    <p className="text-sm text-muted-foreground">September 2025</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Year Average</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">26.4 min</div>
                    <p className="text-sm text-muted-foreground">2025 Average</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplies Usage Report</CardTitle>
              <CardDescription>
                Consumption of housekeeping supplies during {reportPeriod.replace('-', ' ')}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart config={suppliesUsageConfig} />

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Top Consumed Item</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Toilet Paper</div>
                    <p className="text-sm text-muted-foreground">1,250 units used</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Monthly Cost Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Supply Cost:</span>
                      <span className="font-medium">$7,820</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost Per Room:</span>
                      <span className="font-medium">$3.45</span>
                    </div>
                    <div className="flex justify-between">
                      <span>YoY Change:</span>
                      <span className="text-green-600 font-medium">-8.2%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cleaning Quality Ratings</CardTitle>
              <CardDescription>
                Guest satisfaction with room cleanliness during {reportPeriod.replace('-', ' ')}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <PieChart config={cleaningQualityConfig} />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Satisfaction Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">90%</div>
                    <p className="text-sm text-muted-foreground">Excellent & Good ratings</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Top Complaint</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-medium">Bathroom Cleanliness</div>
                    <p className="text-sm text-muted-foreground">38% of all complaints</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">YoY Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">+5.8%</div>
                    <p className="text-sm text-muted-foreground">Compared to 2024</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HousekeepingReports;
