
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface AuthGuardProps {
  children: ReactNode;
  requiredRoles?: string[];
  requiredDepartments?: string[];
}

interface UserData {
  name: string;
  email: string;
  role: string;
  department: string;
  accessLevel: string;
}

const AuthGuard = ({ children, requiredRoles, requiredDepartments }: AuthGuardProps) => {
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authReason, setAuthReason] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      // Reset authorization state at the beginning of each check
      setIsAuthorized(null);
      
      const userDataString = localStorage.getItem("currentUser");
      
      if (!userDataString) {
        setIsAuthorized(false);
        setAuthReason("You must be logged in to access this area");
        return;
      }

      try {
        const userData: UserData = JSON.parse(userDataString);
        setUserData(userData);
        
        // Full access can access everything
        if (userData.accessLevel === "Full Access") {
          setIsAuthorized(true);
          return;
        }
        
        // Department-based access check first (most restrictive)
        if (requiredDepartments && requiredDepartments.length > 0) {
          if (!requiredDepartments.includes(userData.department)) {
            setIsAuthorized(false);
            setAuthReason(`Access denied: This section is restricted to ${requiredDepartments.join(", ")} department`);
            toast.error(`Access denied: This section is restricted to ${requiredDepartments.join(", ")} department`);
            return;
          }
        }
        
        // Role-based access check
        if (requiredRoles && requiredRoles.length > 0) {
          if (!requiredRoles.includes(userData.role)) {
            setIsAuthorized(false);
            setAuthReason(`Access denied: This section requires ${requiredRoles.join(" or ")} role`);
            toast.error(`Access denied: This section requires ${requiredRoles.join(" or ")} role`);
            return;
          }
        }
        
        // If we've reached this point and there are specific role or department requirements,
        // check if the user has sufficient access level
        if ((requiredRoles && requiredRoles.length > 0) || (requiredDepartments && requiredDepartments.length > 0)) {
          // Administrative access can access most things except those requiring Administrator role
          if (userData.accessLevel === "Administrative" && (!requiredRoles || !requiredRoles.includes("Administrator"))) {
            setIsAuthorized(true);
            return;
          }
          
          // Standard access and Limited access users can only access their department areas
          // which we've already checked above in the department check
          if (userData.accessLevel === "Standard" || userData.accessLevel === "Limited") {
            setIsAuthorized(true);
            return;
          }
        } else {
          // If there are no specific requirements, all logged-in users can access
          setIsAuthorized(true);
          return;
        }
        
        // Default deny only if we haven't already authorized by this point
        setIsAuthorized(false);
        setAuthReason("You don't have sufficient permissions to access this area");
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsAuthorized(false);
        setAuthReason("Invalid user session. Please log in again.");
        return;
      }
    };
    
    checkAuth();
  }, [location.pathname, requiredRoles, requiredDepartments]);
  
  if (isAuthorized === null) {
    // Still checking authorization
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Verifying access permissions...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthorized) {
    // Show access denied message with reason
    return (
      <Navigate 
        to="/admin-login" 
        state={{ 
          from: location.pathname,
          reason: authReason || "You don't have permission to access this area"
        }} 
        replace 
      />
    );
  }
  
  return <>{children}</>;
};

export default AuthGuard;
