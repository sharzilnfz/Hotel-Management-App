import { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ArrowLeft, Mail, Phone, Calendar, Award, Clock } from "lucide-react";
import { User } from "@/types/user";

// API configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const USERS_ENDPOINT = `${API_URL}/api/users`;

interface UserProfileProps {
    userId: string;
    onBack: () => void;
}

const UserProfile = ({ userId, onBack }: UserProfileProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${USERS_ENDPOINT}/${userId}`);
                setUser(response.data.data);
            } catch (err: any) {
                console.error("Error fetching user:", err);
                setError(err.response?.data?.error || err.message || "Failed to load user data");
                toast({
                    title: "Error",
                    description: "Failed to load user profile. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800 hover:bg-green-200";
            case "Inactive":
                return "bg-gray-100 text-gray-800 hover:bg-gray-200";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "VIP Guest":
                return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{role}</Badge>;
            case "Administrator":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{role}</Badge>;
            case "Manager":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{role}</Badge>;
            case "Front Desk":
                return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">{role}</Badge>;
            default:
                return <Badge variant="outline">{role}</Badge>;
        }
    };

    const formatDate = (dateString: string | Date | null | undefined) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "yyyy-MM-dd");
        } catch (error) {
            return "Invalid date";
        }
    };

    const formatDateTime = (dateString: string | Date | null | undefined) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "yyyy-MM-dd HH:mm");
        } catch (error) {
            return "Invalid date";
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center">
                    <Button variant="ghost" onClick={onBack} className="mr-2">
                        <ArrowLeft size={16} />
                    </Button>
                    <Skeleton className="h-8 w-32" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-40 mb-2" />
                        <Skeleton className="h-5 w-60" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="space-y-4">
                <div className="flex items-center">
                    <Button variant="ghost" onClick={onBack} className="mr-2">
                        <ArrowLeft size={16} />
                    </Button>
                    <h2 className="text-xl font-semibold">User Profile</h2>
                </div>
                <Card>
                    <CardContent className="py-10">
                        <div className="text-center text-red-500">
                            <p>{error || "Failed to load user data"}</p>
                            <Button variant="outline" className="mt-4" onClick={onBack}>
                                Go Back
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <Button variant="ghost" onClick={onBack} className="mr-2">
                    <ArrowLeft size={16} />
                </Button>
                <h2 className="text-xl font-semibold">User Profile</h2>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">{user.fullName}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                                <Mail className="mr-1" size={14} />
                                {user.email}
                            </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                            <Badge className={getStatusColor(user.status)}>
                                {user.status}
                            </Badge>
                            {getRoleBadge(user.role)}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-500">Basic Information</h3>

                            <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                    <span className="font-medium w-32">Full Name:</span>
                                    <span>{user.fullName}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="font-medium w-32">Username:</span>
                                    <span>{user.userName}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="font-medium w-32">Email:</span>
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Phone size={14} className="mr-1 text-gray-500" />
                                    <span className="font-medium w-28">Phone:</span>
                                    <span>{user.phone || "Not provided"}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="font-medium w-32">Status:</span>
                                    <Badge className={getStatusColor(user.status)}>
                                        {user.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="font-medium w-32">Role:</span>
                                    {getRoleBadge(user.role)}
                                </div>
                                {user.isStaff && user.department && (
                                    <div className="flex items-center text-sm">
                                        <span className="font-medium w-32">Department:</span>
                                        <span>{user.department}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-500">Additional Information</h3>

                            <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                    <Calendar size={14} className="mr-1 text-gray-500" />
                                    <span className="font-medium w-32">Registered:</span>
                                    <span>{formatDate(user.registeredDate)}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Clock size={14} className="mr-1 text-gray-500" />
                                    <span className="font-medium w-32">Last Visit:</span>
                                    <span>{formatDate(user.lastVisit)}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Clock size={14} className="mr-1 text-gray-500" />
                                    <span className="font-medium w-32">Last Login:</span>
                                    <span>{formatDateTime(user.lastLogin)}</span>
                                </div>
                                {!user.isStaff && (
                                    <div className="flex items-center text-sm">
                                        <Award size={14} className="mr-1 text-gray-500" />
                                        <span className="font-medium w-32">Loyalty Points:</span>
                                        <span>{user.loyaltyPoints.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex items-center text-sm">
                                    <span className="font-medium w-32">Created At:</span>
                                    <span>{formatDateTime(user.createdAt)}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="font-medium w-32">Updated At:</span>
                                    <span>{formatDateTime(user.updatedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={onBack}>
                        Go Back
                    </Button>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => window.history.pushState({}, '', `/admin/bookings/${userId}`)}
                        >
                            View Bookings
                        </Button>
                        <Button
                            onClick={() => window.history.pushState({}, '', `/admin/users/edit/${userId}`)}
                        >
                            Edit User
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default UserProfile; 