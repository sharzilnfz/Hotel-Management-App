
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Mock staff database for demonstration
const mockStaffDatabase = [
  // Management staff - Full access
  { 
    email: "admin@parkside.com", 
    password: "admin123", 
    role: "Administrator",
    name: "Admin User",
    department: "Management",
    accessLevel: "Full Access"
  },
  // Finance staff
  { 
    email: "finance@parkside.com", 
    password: "staff123", 
    role: "Manager",
    name: "Finance Manager",
    department: "Finance",
    accessLevel: "Administrative"
  },
  // Front Office staff
  { 
    email: "frontdesk@parkside.com", 
    password: "staff123", 
    role: "Staff",
    name: "Front Desk Staff",
    department: "Front Office",
    accessLevel: "Limited"
  },
  // Housekeeping staff
  { 
    email: "housekeeping@parkside.com", 
    password: "staff123", 
    role: "Supervisor",
    name: "Housekeeping Lead",
    department: "Housekeeping",
    accessLevel: "Standard"
  },
  // Food & Beverage staff
  { 
    email: "restaurant@parkside.com", 
    password: "staff123", 
    role: "Manager",
    name: "Restaurant Manager",
    department: "Food & Beverage",
    accessLevel: "Administrative"
  },
  // Maintenance staff
  { 
    email: "maintenance@parkside.com", 
    password: "staff123", 
    role: "Staff",
    name: "Maintenance Worker",
    department: "Maintenance",
    accessLevel: "Limited"
  },
  // Spa & Wellness staff
  { 
    email: "spa@parkside.com", 
    password: "staff123", 
    role: "Supervisor",
    name: "Spa Coordinator",
    department: "Spa & Wellness",
    accessLevel: "Standard"
  },
  // Room Service staff
  { 
    email: "rooms@parkside.com", 
    password: "staff123", 
    role: "Staff",
    name: "Room Service Staff",
    department: "Housekeeping",
    accessLevel: "Limited"
  },
  // HR staff
  { 
    email: "hr@parkside.com", 
    password: "staff123", 
    role: "Manager",
    name: "HR Manager",
    department: "Human Resources",
    accessLevel: "Administrative"
  },
  // Sales staff
  { 
    email: "sales@parkside.com", 
    password: "staff123", 
    role: "Staff",
    name: "Sales Representative",
    department: "Sales & Marketing",
    accessLevel: "Standard"
  }
];

interface LocationState {
  from?: string;
  reason?: string;
}

const AdminLoginPage = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [accessDeniedReason, setAccessDeniedReason] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Check if redirected due to access denial
  useEffect(() => {
    if (state && state.reason) {
      setAccessDeniedReason(state.reason);
      if (state.from) {
        setRedirectPath(state.from);
      }
    }
  }, [state]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    // Fix: allow any admin account regardless of case sensitivity
    const adminUser = mockStaffDatabase.find(
      staff => staff.email.toLowerCase() === adminEmail.toLowerCase() && 
               staff.password === adminPassword && 
               staff.role === "Administrator"
    );
    
    if (adminUser) {
      // Store user information in localStorage for session management
      localStorage.setItem("currentUser", JSON.stringify({
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        department: adminUser.department,
        accessLevel: adminUser.accessLevel
      }));
      
      uiToast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      });
      
      // Redirect to the original path if access was denied, otherwise go to admin
      navigate(redirectPath || "/admin");
    } else {
      setLoginError("Invalid email or password");
      uiToast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    // Fix: allow any staff account regardless of case sensitivity
    const staffUser = mockStaffDatabase.find(
      staff => staff.email.toLowerCase() === staffEmail.toLowerCase() && 
               staff.password === staffPassword
    );
    
    if (staffUser) {
      // Store user information in localStorage for session management
      localStorage.setItem("currentUser", JSON.stringify({
        name: staffUser.name,
        email: staffUser.email,
        role: staffUser.role,
        department: staffUser.department,
        accessLevel: staffUser.accessLevel
      }));
      
      uiToast({
        title: "Login Successful",
        description: `Welcome, ${staffUser.name}`,
      });
      
      toast.success(`Logged in as ${staffUser.role} in ${staffUser.department}`);
      
      // Redirect to the original path if access was denied, otherwise go to admin
      navigate(redirectPath || "/admin");
    } else {
      setLoginError("Invalid email or password");
      uiToast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-hotel-primary">Parkside Plaza Hotel</h1>
          <p className="text-gray-600">Admin Portal</p>
        </div>
        
        {accessDeniedReason && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              {accessDeniedReason}
            </AlertDescription>
          </Alert>
        )}
        
        {loginError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>
              {loginError}
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="staff" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="admin">Admin Login</TabsTrigger>
            <TabsTrigger value="staff">Staff Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access the full admin dashboard.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleAdminLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email</Label>
                    <Input 
                      id="adminEmail" 
                      type="email" 
                      placeholder="admin@parkside.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="adminPassword">Password</Label>
                      <a href="#" className="text-xs text-hotel-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="adminPassword" 
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-hotel-primary hover:bg-opacity-90">
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access the staff dashboard.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleStaffLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staffEmail">Email</Label>
                    <Input 
                      id="staffEmail" 
                      type="email"
                      placeholder="staff@parkside.com"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="staffPassword">Password</Label>
                      <a href="#" className="text-xs text-hotel-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="staffPassword" 
                      type="password"
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-hotel-primary hover:bg-opacity-90">
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 bg-white p-4 rounded-md shadow">
          <h2 className="font-medium text-gray-700 mb-2">Available Test Accounts:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-gray-50 rounded">
              <p><strong>Admin:</strong> admin@parkside.com</p>
              <p><strong>Password:</strong> admin123</p>
              <p className="text-xs text-gray-500 mt-1">Full Access / Management</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p><strong>Finance:</strong> finance@parkside.com</p>
              <p><strong>Password:</strong> staff123</p>
              <p className="text-xs text-gray-500 mt-1">Administrative / Finance</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p><strong>Spa:</strong> spa@parkside.com</p>
              <p><strong>Password:</strong> staff123</p>
              <p className="text-xs text-gray-500 mt-1">Standard / Spa & Wellness</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p><strong>Restaurant:</strong> restaurant@parkside.com</p>
              <p><strong>Password:</strong> staff123</p>
              <p className="text-xs text-gray-500 mt-1">Administrative / Food & Beverage</p>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-4 text-sm text-gray-600">
          © {new Date().getFullYear()} Parkside Plaza Hotel. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
