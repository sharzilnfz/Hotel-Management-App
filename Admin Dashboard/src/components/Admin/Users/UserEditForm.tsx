import { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { User } from "@/types/user";

// API configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const USERS_ENDPOINT = `${API_URL}/api/users`;

interface UserEditFormProps {
    userId: string;
    onBack: () => void;
    onUserUpdated: (user: User) => void;
}

const UserEditForm = ({ userId, onBack, onUserUpdated }: UserEditFormProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        userName: "",
        email: "",
        phone: "",
        password: "",
        role: "",
        department: "",
        loyaltyPoints: 0
    });

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${USERS_ENDPOINT}/${userId}`);
                const userData = response.data.data;
                setUser(userData);

                // Initialize form with user data
                setFormData({
                    fullName: userData.fullName || "",
                    userName: userData.userName || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    password: "", // Don't set existing password
                    role: userData.role || "",
                    department: userData.department || "",
                    loyaltyPoints: userData.loyaltyPoints || 0
                });
            } catch (err: any) {
                console.error("Error fetching user:", err);
                setError(err.response?.data?.error || err.message || "Failed to load user data");
                toast({
                    title: "Error",
                    description: "Failed to load user data. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === "loyaltyPoints" ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Create an object with only the fields that have changed
            const updateData: Partial<User> = {};

            if (formData.fullName !== user?.fullName) updateData.fullName = formData.fullName;
            if (formData.userName !== user?.userName) updateData.userName = formData.userName;
            if (formData.email !== user?.email) updateData.email = formData.email;
            if (formData.phone !== user?.phone) updateData.phone = formData.phone;
            if (formData.role !== user?.role) updateData.role = formData.role;
            if (formData.department !== user?.department) updateData.department = formData.department;
            if (formData.loyaltyPoints !== user?.loyaltyPoints) updateData.loyaltyPoints = formData.loyaltyPoints;
            if (formData.password) updateData.password = formData.password;

            const response = await axios.patch(`${USERS_ENDPOINT}/${userId}`, updateData);
            const updatedUser = response.data.data;

            setUser(updatedUser);
            onUserUpdated(updatedUser);

            toast({
                title: "Success",
                description: "User information updated successfully!",
            });
        } catch (err: any) {
            console.error("Error updating user:", err);
            toast({
                title: "Error",
                description: err.response?.data?.error || err.message || "Failed to update user. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
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
                        <Skeleton className="h-7 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-3/4" />
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
                    <h2 className="text-xl font-semibold">Edit User</h2>
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
                <h2 className="text-xl font-semibold">Edit User: {user.fullName}</h2>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Edit User Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="userName">Username</Label>
                                <Input
                                    id="userName"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password (leave empty to keep current)</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                >
                                    {user.isStaff ? (
                                        <>
                                            <option value="Administrator">Administrator</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Front Desk">Front Desk</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Guest">Guest</option>
                                            <option value="VIP Guest">VIP Guest</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            {user.isStaff && (
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}

                            {!user.isStaff && (
                                <div className="space-y-2">
                                    <Label htmlFor="loyaltyPoints">Loyalty Points</Label>
                                    <Input
                                        id="loyaltyPoints"
                                        name="loyaltyPoints"
                                        type="number"
                                        value={formData.loyaltyPoints}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={onBack}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default UserEditForm; 