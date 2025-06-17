import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddSpaServiceForm from "@/components/Admin/Spa/AddSpaServiceForm";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const EditServicePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [service, setService] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchService = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:4000/api/spa/services/${id}`);

                if (response.data.success) {
                    setService(response.data.data);
                    console.log("Service data loaded:", response.data.data);
                } else {
                    setError('Failed to load service details');
                    toast.error('Failed to load service details');
                }
            } catch (error) {
                console.error("Error fetching service:", error);
                setError('Error fetching service details');
                toast.error('Error fetching service details');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchService();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading service details...</span>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <p>{error || 'Service not found'}</p>
                    <button
                        className="mt-2 text-blue-600 hover:underline"
                        onClick={() => navigate('/admin/spa')}
                    >
                        Return to Spa Management
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AuthGuard requiredDepartments={["Management", "Spa & Wellness"]}>
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold mb-6">Edit Service</h1>
                <AddSpaServiceForm serviceToEdit={service} />
            </div>
        </AuthGuard>
    );
};

export default EditServicePage; 