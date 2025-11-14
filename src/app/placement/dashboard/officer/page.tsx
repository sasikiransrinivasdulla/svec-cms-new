'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    Upload,
    User,
    Trash2,
    Edit,
    X,
    Save,
    Loader2,
    Mail,
    Phone,
    Linkedin,
    Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface PlacementOfficer {
    id: number;
    name: string;
    designation: string;
    phone: string;
    email: string;
    linkedin: string;
    image_url: string;
    created_at: string;
}

export default function PlacementOfficerPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [officer, setOfficer] = useState<PlacementOfficer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        phone: '',
        email: '',
        linkedin: ''
    });

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || user?.role !== 'placement')) {
            router.replace('/auth/login');
        }
    }, [authLoading, isAuthenticated, user, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOfficer();
        }
    }, [isAuthenticated]);

    const fetchOfficer = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/placement/officer');

            if (!response.ok) {
                throw new Error('Failed to fetch placement officer');
            }

            const data = await response.json();
            setOfficer(data);

            // If editing and officer exists, populate form
            if (data && isEditing) {
                setFormData({
                    name: data.name,
                    designation: data.designation,
                    phone: data.phone,
                    email: data.email,
                    linkedin: data.linkedin || ''
                });
                setPreviewUrl(data.image_url);
            }
        } catch (error) {
            console.error('Error fetching placement officer:', error);
            toast.error('Failed to load placement officer');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        if (!formData.designation.trim()) {
            toast.error('Designation is required');
            return;
        }

        if (!formData.email.trim()) {
            toast.error('Email is required');
            return;
        }

        if (!formData.phone.trim()) {
            toast.error('Phone is required');
            return;
        }

        // For new officer, image is required
        if (!officer && !selectedFile) {
            toast.error('Please upload a photo');
            return;
        }

        try {
            setIsSubmitting(true);
            let imageUrl = officer?.image_url || '';

            // Upload image if a new file is selected
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', selectedFile);
                uploadFormData.append('module', 'officer');

                const uploadResponse = await fetch('/api/placement/upload', {
                    method: 'POST',
                    body: uploadFormData
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.error || 'Failed to upload image');
                }

                const uploadData = await uploadResponse.json();
                imageUrl = uploadData.url;
            }

            // Save or update officer data
            const method = officer ? 'PUT' : 'POST';
            const payload: any = {
                name: formData.name.trim(),
                designation: formData.designation.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                linkedin: formData.linkedin.trim(),
                image_url: imageUrl
            };

            if (officer) {
                payload.id = officer.id;
            }

            const response = await fetch('/api/placement/officer', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to ${officer ? 'update' : 'add'} placement officer`);
            }

            toast.success(`Placement officer ${officer ? 'updated' : 'added'} successfully!`);

            // Reset form
            setSelectedFile(null);
            setPreviewUrl(null);
            setFormData({
                name: '',
                designation: '',
                phone: '',
                email: '',
                linkedin: ''
            });
            setIsEditing(false);

            // Reset file input
            const fileInput = document.getElementById('file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            // Refresh data
            fetchOfficer();
        } catch (error: any) {
            console.error('Error saving placement officer:', error);
            toast.error(error.message || 'Failed to save placement officer');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = () => {
        if (officer) {
            setIsEditing(true);
            setFormData({
                name: officer.name,
                designation: officer.designation,
                phone: officer.phone,
                email: officer.email,
                linkedin: officer.linkedin || ''
            });
            setPreviewUrl(officer.image_url);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        setFormData({
            name: '',
            designation: '',
            phone: '',
            email: '',
            linkedin: ''
        });
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleDelete = async () => {
        if (!officer) return;

        if (!confirm('Are you sure you want to delete the placement officer?')) {
            return;
        }

        try {
            const response = await fetch(`/api/placement/officer?id=${officer.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete placement officer');
            }

            toast.success('Placement officer deleted successfully!');
            setOfficer(null);
        } catch (error: any) {
            console.error('Error deleting placement officer:', error);
            toast.error(error.message || 'Failed to delete placement officer');
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-red-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/placement/dashboard"
                            className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-200 border border-blue-200 font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Placement Officer</h1>
                            <p className="text-gray-600">Manage placement officer information</p>
                        </div>
                    </div>
                </div>

                {/* Show form if no officer exists or if editing */}
                {(!officer || isEditing) && (
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                {officer ? 'Edit Placement Officer' : 'Add Placement Officer'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Photo Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="file-input" className="text-gray-700 font-medium">
                                        Photo {!officer && '*'}
                                    </Label>
                                    <Input
                                        id="file-input"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleFileChange}
                                        className="cursor-pointer"
                                        disabled={isSubmitting}
                                    />
                                    <p className="text-xs text-gray-500">
                                        Accepted formats: JPG, JPEG, PNG, WEBP (Max: 300 KB)
                                    </p>
                                </div>

                                {/* Preview */}
                                {previewUrl && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                                        <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
                                        <div className="relative w-32 h-32 mx-auto bg-gray-100 rounded-full overflow-hidden">
                                            <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                        </div>
                                    </div>
                                )}

                                {/* Form Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-gray-700 font-medium">
                                            Name *
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Enter full name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Designation */}
                                    <div className="space-y-2">
                                        <Label htmlFor="designation" className="text-gray-700 font-medium">
                                            Designation *
                                        </Label>
                                        <Input
                                            id="designation"
                                            name="designation"
                                            type="text"
                                            placeholder="e.g., Director of Placements"
                                            value={formData.designation}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                                            Phone *
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+91 XXXXX XXXXX"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-700 font-medium">
                                            Email *
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="officer@college.edu"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* LinkedIn */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="linkedin" className="text-gray-700 font-medium">
                                            LinkedIn URL
                                        </Label>
                                        <Input
                                            id="linkedin"
                                            name="linkedin"
                                            type="url"
                                            placeholder="https://linkedin.com/in/username"
                                            value={formData.linkedin}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium px-6 py-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                {officer ? 'Update Officer' : 'Add Officer'}
                                            </>
                                        )}
                                    </Button>

                                    {isEditing && (
                                        <Button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            variant="outline"
                                            className="border-gray-300"
                                            disabled={isSubmitting}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Display Current Officer */}
                {officer && !isEditing && (
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Current Placement Officer
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={handleEdit}
                                        className="bg-white text-red-600 hover:bg-gray-100"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleDelete}
                                        variant="outline"
                                        className="border-white text-white hover:bg-red-800"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Photo */}
                                <div className="relative w-48 h-48 bg-gray-100 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                                    <Image
                                        src={officer.image_url}
                                        alt={officer.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-800 mb-1">{officer.name}</h2>
                                        <p className="text-lg text-orange-600 font-medium flex items-center gap-2">
                                            <Briefcase className="w-5 h-5" />
                                            {officer.designation}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Mail className="w-5 h-5 text-orange-600" />
                                            <a
                                                href={`mailto:${officer.email}`}
                                                className="hover:text-orange-600 transition-colors"
                                            >
                                                {officer.email}
                                            </a>
                                        </div>

                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Phone className="w-5 h-5 text-orange-600" />
                                            <a
                                                href={`tel:${officer.phone}`}
                                                className="hover:text-orange-600 transition-colors"
                                            >
                                                {officer.phone}
                                            </a>
                                        </div>

                                        {officer.linkedin && (
                                            <div className="flex items-center gap-3 text-gray-700">
                                                <Linkedin className="w-5 h-5 text-orange-600" />
                                                <a
                                                    href={officer.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-orange-600 transition-colors flex items-center gap-1"
                                                >
                                                    LinkedIn Profile
                                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Added on{' '}
                                            {new Date(officer.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {!officer && !isEditing && (
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                        <CardContent className="p-12 text-center">
                            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Placement Officer Added</h3>
                            <p className="text-gray-600 mb-6">
                                Add the placement officer information to display on the website.
                            </p>
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Add Placement Officer
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
