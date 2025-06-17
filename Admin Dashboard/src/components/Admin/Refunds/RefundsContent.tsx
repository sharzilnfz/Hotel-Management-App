
import { useState } from "react";
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
import { 
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  BarChart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RefundsContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTab, setSelectedTab] = useState("refunds");
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [refundDetailsOpen, setRefundDetailsOpen] = useState(false);
  
  // Mock refund data
  const refunds = [
    {
      id: "RF-001245",
      customer: "John Doe",
      bookingId: "BK-734589",
      bookingType: "Room",
      amount: "$245.00",
      requestDate: "2025-04-05",
      processingDate: "2025-04-06",
      reason: "Change of plans",
      status: "Approved",
      processedBy: "Admin User",
      policy: "Free cancellation up to 48 hours before check-in",
      email: "john.doe@example.com",
      phone: "+1-555-123-4567"
    },
    {
      id: "RF-001246",
      customer: "Jane Smith",
      bookingId: "BK-734592",
      bookingType: "Spa",
      amount: "$567.00",
      requestDate: "2025-04-06",
      processingDate: "",
      reason: "Medical emergency",
      status: "Pending",
      processedBy: "",
      policy: "50% refund for cancellations up to 24 hours",
      email: "jane.smith@example.com",
      phone: "+1-555-987-6543"
    },
    {
      id: "RF-001247",
      customer: "Robert Johnson",
      bookingId: "BK-734610",
      bookingType: "Event",
      amount: "$320.50",
      requestDate: "2025-04-07",
      processingDate: "2025-04-08",
      reason: "Unsatisfactory service",
      status: "Declined",
      processedBy: "Finance Manager",
      policy: "Non-refundable booking",
      email: "robert.johnson@example.com",
      phone: "+1-555-456-7890"
    },
    {
      id: "RF-001248",
      customer: "Emily Wilson",
      bookingId: "BK-734615",
      bookingType: "Restaurant",
      amount: "$478.25",
      requestDate: "2025-04-07",
      processingDate: "2025-04-09",
      reason: "Flight cancellation",
      status: "Approved",
      processedBy: "Hotel Manager",
      policy: "Free cancellation up to 2 hours before reservation",
      email: "emily.wilson@example.com",
      phone: "+1-555-789-0123"
    },
    {
      id: "RF-001249",
      customer: "Michael Brown",
      bookingId: "BK-734623",
      bookingType: "Room",
      amount: "$189.75",
      requestDate: "2025-04-08",
      processingDate: "",
      reason: "Double booking",
      status: "Pending",
      processedBy: "",
      policy: "Free cancellation up to 24 hours before check-in",
      email: "michael.brown@example.com",
      phone: "+1-555-234-5678"
    }
  ];

  // Calculate some statistics for insights
  const totalRefunds = refunds.length;
  const approvedRefunds = refunds.filter(r => r.status === "Approved").length;
  const pendingRefunds = refunds.filter(r => r.status === "Pending").length;
  const declinedRefunds = refunds.filter(r => r.status === "Declined").length;
  
  const totalAmount = refunds
    .filter(r => r.status === "Approved")
    .reduce((sum, refund) => sum + parseFloat(refund.amount.replace("$", "")), 0);
  
  const refundsByType = {
    Room: refunds.filter(r => r.bookingType === "Room").length,
    Spa: refunds.filter(r => r.bookingType === "Spa").length,
    Event: refunds.filter(r => r.bookingType === "Event").length,
    Restaurant: refunds.filter(r => r.bookingType === "Restaurant").length
  };

  const filteredRefunds = refunds.filter(
    (refund) =>
      (statusFilter === "all" || refund.status.toLowerCase() === statusFilter.toLowerCase()) &&
      (refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        refund.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        refund.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        refund.bookingType.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="text-green-500" size={16} />;
      case "Declined":
        return <XCircle className="text-red-500" size={16} />;
      case "Pending":
        return <Clock className="text-amber-500" size={16} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Declined":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Pending":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (refund) => {
    setSelectedRefund(refund);
    setRefundDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Refund Management</h1>
      </div>

      <Tabs defaultValue="refunds" onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="refunds">Refunds List</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="refunds" className="mt-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search refunds..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">Export</Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Refund ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRefunds.length > 0 ? (
                    filteredRefunds.map((refund) => (
                      <TableRow key={refund.id}>
                        <TableCell className="font-medium">{refund.id}</TableCell>
                        <TableCell>{refund.customer}</TableCell>
                        <TableCell>{refund.bookingId}</TableCell>
                        <TableCell>{refund.bookingType}</TableCell>
                        <TableCell>{refund.amount}</TableCell>
                        <TableCell>{refund.requestDate}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={refund.reason}>{refund.reason}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(refund.status)}
                            <Badge className={getStatusColor(refund.status)}>
                              {refund.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(refund)}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-10 text-gray-500">
                        No refunds found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Refund Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Refunds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRefunds}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Approved Refunds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{approvedRefunds}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Refunds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{pendingRefunds}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Refunded Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Refunds by Service Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(refundsByType).map(([type, count]) => (
                <Card key={type}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{count}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Refund Details Dialog */}
      <Dialog open={refundDetailsOpen} onOpenChange={setRefundDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Refund Details</DialogTitle>
            <DialogDescription>
              Complete information about the refund request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRefund && (
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Refund Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Refund ID:</span>
                      <span className="text-sm">{selectedRefund.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge className={getStatusColor(selectedRefund.status)}>
                        {selectedRefund.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Amount:</span>
                      <span className="text-sm">{selectedRefund.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Request Date:</span>
                      <span className="text-sm">{selectedRefund.requestDate}</span>
                    </div>
                    {selectedRefund.processingDate && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Processing Date:</span>
                        <span className="text-sm">{selectedRefund.processingDate}</span>
                      </div>
                    )}
                    {selectedRefund.processedBy && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Processed By:</span>
                        <span className="text-sm">{selectedRefund.processedBy}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Booking & Customer Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Customer:</span>
                      <span className="text-sm">{selectedRefund.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Booking ID:</span>
                      <span className="text-sm">{selectedRefund.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Service Type:</span>
                      <span className="text-sm">{selectedRefund.bookingType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Email:</span>
                      <span className="text-sm">{selectedRefund.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Phone:</span>
                      <span className="text-sm">{selectedRefund.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Refund Policy</h4>
                <p className="text-sm p-3 bg-gray-50 rounded-md">{selectedRefund.policy}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Reason for Refund</h4>
                <p className="text-sm p-3 bg-gray-50 rounded-md">{selectedRefund.reason}</p>
              </div>
              
              {selectedRefund.status === "Pending" && (
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline Refund
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Refund
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RefundsContent;
