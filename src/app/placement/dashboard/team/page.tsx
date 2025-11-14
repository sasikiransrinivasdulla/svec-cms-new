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
    Users,
    Trash2,
    Edit,
    X,
    Save,
    Loader2,
    Mail,
    Phone,
    Briefcase,
    Building2,
    Plus
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface TeamMember {
    id: number;
    name: string;
    designation: string;
    branch: string;
    email: string;
    phone: string;
    image_url: string;
    created_at: string;
}

export default function PlacementTeamPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        branch: '',
        email: '',
        phone: ''
    });

    // Edit state
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || user?.role !== 'placement')) {
            router.replace('/auth/login');
        }
    }, [authLoading, isAuthenticated, user, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchTeamMembers();
        }
    }, [isAuthenticated]);

    const fetchTeamMembers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/placement/team');

            if (!response.ok) {
                throw new Error('Failed to fetch team members');
            }

            const data = await response.json();
            setTeamMembers(data);
        } catch (error) {
            console.error('Error fetching team members:', error);
            toast.error('Failed to load team members');
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

    const resetForm = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setFormData({
            name: '',
            designation: '',
            branch: '',
            email: '',
            phone: ''
        });
        setShowAddForm(false);
        setEditingId(null);

        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        // For new member, image is required
        if (!editingId && !selectedFile) {
            toast.error('Please upload a photo');
            return;
        }

        try {
            setIsSubmitting(true);
            let imageUrl = '';

            // If editing, get existing image URL
            if (editingId) {
                const member = teamMembers.find((m) => m.id === editingId);
                imageUrl = member?.image_url || '';
            }

            // Upload image if a new file is selected
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', selectedFile);
                uploadFormData.append('module', 'team');

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

            // Save or update team member data
            const method = editingId ? 'PUT' : 'POST';
            const payload: any = {
                name: formData.name.trim(),
                designation: formData.designation.trim(),
                branch: formData.branch.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                image_url: imageUrl
            };

            if (editingId) {
                payload.id = editingId;
            }

            const response = await fetch('/api/placement/team', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to ${editingId ? 'update' : 'add'} team member`);
            }

            toast.success(`Team member ${editingId ? 'updated' : 'added'} successfully!`);

            // Reset form and refresh data
            resetForm();
            fetchTeamMembers();
        } catch (error: any) {
            console.error('Error saving team member:', error);
            toast.error(error.message || 'Failed to save team member');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (member: TeamMember) => {
        setEditingId(member.id);
        setShowAddForm(true);
        setFormData({
            name: member.name,
            designation: member.designation || '',
            branch: member.branch || '',
            email: member.email || '',
            phone: member.phone || ''
        });
        setPreviewUrl(member.image_url);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this team member?')) {
            return;
        }

        try {
            const response = await fetch(`/api/placement/team?id=${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete team member');
            }

            toast.success('Team member deleted successfully!');
            fetchTeamMembers();
        } catch (error: any) {
            console.error('Error deleting team member:', error);
            toast.error(error.message || 'Failed to delete team member');
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/placement/dashboard"
                                className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-200 border border-blue-200 font-medium"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Link>
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Placement Team</h1>
                                <p className="text-gray-600">Manage team members and coordinators</p>
                            </div>
                        </div>
                        {!showAddForm && (
                            <Button
                                onClick={() => setShowAddForm(true)}
                                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Team Member
                            </Button>
                        )}
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                {editingId ? 'Edit Team Member' : 'Add New Team Member'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Photo Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="file-input" className="text-gray-700 font-medium">
                                        Photo {!editingId && '*'}
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
                                        <div className="relative w-32 h-32 mx-auto bg-gray-100 rounded-xl overflow-hidden shadow-lg">
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
                                            Designation
                                        </Label>
                                        <Input
                                            id="designation"
                                            name="designation"
                                            type="text"
                                            placeholder="e.g., Placement Coordinator"
                                            value={formData.designation}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Branch */}
                                    <div className="space-y-2">
                                        <Label htmlFor="branch" className="text-gray-700 font-medium">
                                            Branch/Department
                                        </Label>
                                        <Input
                                            id="branch"
                                            name="branch"
                                            type="text"
                                            placeholder="e.g., CSE, ECE, etc."
                                            value={formData.branch}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-700 font-medium">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="member@college.edu"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                                            Phone
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
                                                {editingId ? 'Update Member' : 'Add Member'}
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={resetForm}
                                        variant="outline"
                                        className="border-gray-300"
                                        disabled={isSubmitting}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Team Members List */}
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Team Members ({teamMembers.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {teamMembers.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Team Members Yet</h3>
                                <p className="text-gray-600 mb-6">
                                    Add team members to display on the placement page.
                                </p>
                                <Button
                                    onClick={() => setShowAddForm(true)}
                                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Team Member
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {teamMembers.map((member) => (
                                    <Card
                                        key={member.id}
                                        className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200/50 hover:shadow-xl transition-all duration-300"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex flex-col items-center space-y-4">
                                                {/* Photo */}
                                                <div className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                                                    <Image
                                                        src={member.image_url}
                                                        alt={member.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="text-center space-y-2 w-full">
                                                    <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>

                                                    {member.designation && (
                                                        <p className="text-sm text-orange-600 font-medium flex items-center justify-center gap-1">
                                                            <Briefcase className="w-4 h-4" />
                                                            {member.designation}
                                                        </p>
                                                    )}

                                                    {member.branch && (
                                                        <p className="text-xs text-gray-600 bg-orange-100 inline-block px-3 py-1 rounded-full">
                                                            <Building2 className="w-3 h-3 inline mr-1" />
                                                            {member.branch}
                                                        </p>
                                                    )}

                                                    {/* Contact Info */}
                                                    <div className="space-y-1 pt-2 text-sm text-gray-700">
                                                        {member.email && (
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Mail className="w-4 h-4 text-orange-600" />
                                                                <a
                                                                    href={`mailto:${member.email}`}
                                                                    className="hover:text-orange-600 transition-colors truncate"
                                                                    title={member.email}
                                                                >
                                                                    {member.email}
                                                                </a>
                                                            </div>
                                                        )}

                                                        {member.phone && (
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Phone className="w-4 h-4 text-orange-600" />
                                                                <a
                                                                    href={`tel:${member.phone}`}
                                                                    className="hover:text-orange-600 transition-colors"
                                                                >
                                                                    {member.phone}
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 w-full pt-4 border-t border-orange-200">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleEdit(member)}
                                                        variant="outline"
                                                        className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleDelete(member.id)}
                                                        variant="outline"
                                                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>

                                                {/* Created Date */}
                                                <p className="text-xs text-gray-500">
                                                    Added {new Date(member.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
