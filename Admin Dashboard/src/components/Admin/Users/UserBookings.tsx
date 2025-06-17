import { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, Users, Bed } from "lucide-react";
import { User } from "@/types/user";

// API configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const USERS_ENDPOINT = `${API_URL}/api/users`;

// Booking type (you may need to adjust this based on your actual data structure)
interface Booking {
    _id: string;
    roomNumber?: string;
    roomType?: string;
    checkInDate: string | Date;
    checkOutDate: string | Date;
    totalAmount: number;
    status: "Confirmed" | "Cancelled" | "Completed" | "Pending";
    guestCount: number;
    createdAt: string | Date;
}

interface UserBookingsProps {
    userId: string;
    onBack: () => void;
}

const UserBookings = ({ userId, onBack }: UserBookingsProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserAndBookings = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch user data
                const userResponse = await axios.get(`${USERS_ENDPOINT}/${userId}`);
                setUser(userResponse.data.data);

                // For demonstration purposes, let's create mock bookings
                // In a real application, you would fetch actual bookings from your API
                const mockBookings: Booking[] = [
                    {
                        _id: "1",
                        roomNumber: "101",
                        roomType: "Deluxe Suite",
                        checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                        checkOutDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
                        totalAmount: 650,
                        status: "Confirmed",
                        guestCount: 2,
                        createdAt: new Date()
                    },
                    {
                        _id: "2",
                        roomNumber: "205",
                        roomType: "Executive Room",
                        checkInDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                        checkOutDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
                        totalAmount: 350,
                        status: "Completed",
                        guestCount: 1,
                        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
                    },
                    {
                        _id: "3",
                        roomNumber: "312",
                        roomType: "Luxury Suite",
                        checkInDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
                        checkOutDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000), // 85 days ago
                        totalAmount: 970,
                        status: "Cancelled",
                        guestCount: 3,
                        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)
                    }
                ];

                setBookings(mockBookings);
            } catch (err: any) {
                console.error("Error fetching data:", err);
                setError(err.response?.data?.error || err.message || "Failed to load data");
                toast({
                    title: "Error",
                    description: "Failed to load bookings. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndBookings();
    }, [userId]);

    const formatDate = (dateString: string | Date) => {
        return format(new Date(dateString), "PPP"); // Format: Jan 1, 2021
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Confirmed":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>;
            case "Cancelled":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{status}</Badge>;
            case "Completed":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{status}</Badge>;
            case "Pending":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{status}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center">
                    <Button variant="ghost" onClick={onBack} className="mr-2">
                        <ArrowLeft size={16} />
                    </Button>
                    <Skeleton className="h-8 w-40" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-40 mb-2" />
                        <Skeleton className="h-5 w-60" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-64 w-full" />
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
                    <h2 className="text-xl font-semibold">User Bookings</h2>
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
                <h2 className="text-xl font-semibold">Bookings for {user.fullName}</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Reservation History</CardTitle>
                    <CardDescription>
                        View all bookings and reservations made by this user
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {bookings.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Room</TableHead>
                                        <TableHead>Check-in</TableHead>
                                        <TableHead>Check-out</TableHead>
                                        <TableHead>Guests</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Booked On</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.map((booking) => (
                                        <TableRow key={booking._id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{booking.roomType}</span>
                                                    <span className="text-xs text-gray-500">Room {booking.roomNumber}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Calendar size={14} className="mr-1 text-gray-500" />
                                                    <span>{formatDate(booking.checkInDate)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Calendar size={14} className="mr-1 text-gray-500" />
                                                    <span>{formatDate(booking.checkOutDate)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Users size={14} className="mr-1 text-gray-500" />
                                                    <span>{booking.guestCount}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                ${booking.totalAmount.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(booking.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Clock size={14} className="mr-1 text-gray-500" />
                                                    <span>{formatDate(booking.createdAt)}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <Bed className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-1">No Bookings Found</h3>
                            <p className="text-gray-500">This user hasn't made any reservations yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UserBookings; 