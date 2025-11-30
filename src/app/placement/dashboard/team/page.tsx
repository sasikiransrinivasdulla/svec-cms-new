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
    Users,
    Trash2,
    Edit,
    X,
    Save,
    Loader2,
    Plus,
    Check,
    Upload
} from 'lucide-react';
import { toast } from 'sonner';

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
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        branch: '',
        email: '',
        phone: '',
        image_url: ''
    });

    // Edit state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<TeamMember | null>(null);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (!editData) return;

        const value = e.target.value;
        setEditData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]: value
            };
        });
    };

    const resetForm = () => {
        setFormData({
            name: '',
            designation: '',
            branch: '',
            email: '',
            phone: '',
            image_url: ''
        });
        setShowAddForm(false);
        setEditingId(null);
        setEditData(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        if (!formData.image_url.trim()) {
            toast.error('Image URL is required');
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/placement/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add team member');
            }

            toast.success('Team member added successfully!');

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
        setEditData({ ...member });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData(null);
    };

    const handleSaveEdit = async () => {
        if (!editData) return;

        // Validation
        if (!editData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        if (!editData.image_url.trim()) {
            toast.error('Image URL is required');
            return;
        }

        try {
            const response = await fetch('/api/placement/team', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update team member');
            }

            toast.success('Team member updated successfully!');
            setEditingId(null);
            setEditData(null);
            fetchTeamMembers();
        } catch (error: any) {
            console.error('Error updating team member:', error);
            toast.error(error.message || 'Failed to update team member');
        }
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
                                <p className="text-gray-600">Manage placement team members</p>
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

                {/* Add Form */}
                {showAddForm && (
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Add New Team Member
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                            placeholder="e.g., John Doe"
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
                                            placeholder="e.g., Placement Officer"
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
                                            placeholder="e.g., CSE"
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
                                            placeholder="e.g., john@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                                            Phone
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="text"
                                            placeholder="e.g., +91 98765 43210"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Image URL */}
                                    <div className="space-y-2">
                                        <Label htmlFor="image_url" className="text-gray-700 font-medium">
                                            Image URL *
                                        </Label>
                                        <Input
                                            id="image_url"
                                            name="image_url"
                                            type="text"
                                            placeholder="e.g., /uploads/team/john.jpg"
                                            value={formData.image_url}
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
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Add Member
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

                {/* Team Members Table */}
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
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Team Members</h3>
                                <p className="text-gray-600 mb-6">
                                    Add placement team members to display here.
                                </p>
                                <Button
                                    onClick={() => setShowAddForm(true)}
                                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Member
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Designation</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Branch</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teamMembers.map((member) => (
                                            <tr key={member.id} className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors">
                                                {editingId === member.id && editData ? (
                                                    <>
                                                        <td className="px-4 py-4">
                                                            <Input
                                                                type="text"
                                                                value={editData.image_url}
                                                                onChange={(e) => handleEditInputChange(e, 'image_url')}
                                                                className="w-full text-sm"
                                                                placeholder="Image URL"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <Input
                                                                type="text"
                                                                value={editData.name}
                                                                onChange={(e) => handleEditInputChange(e, 'name')}
                                                                className="w-full text-sm"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <Input
                                                                type="text"
                                                                value={editData.designation}
                                                                onChange={(e) => handleEditInputChange(e, 'designation')}
                                                                className="w-full text-sm"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <Input
                                                                type="text"
                                                                value={editData.branch}
                                                                onChange={(e) => handleEditInputChange(e, 'branch')}
                                                                className="w-full text-sm"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <Input
                                                                type="email"
                                                                value={editData.email}
                                                                onChange={(e) => handleEditInputChange(e, 'email')}
                                                                className="w-full text-sm"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <Input
                                                                type="text"
                                                                value={editData.phone}
                                                                onChange={(e) => handleEditInputChange(e, 'phone')}
                                                                className="w-full text-sm"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={handleSaveEdit}
                                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={handleCancelEdit}
                                                                    variant="outline"
                                                                    className="border-gray-300"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="px-4 py-4">
                                                            <img
                                                                src={member.image_url}
                                                                alt={member.name}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = '/placeholder-avatar.png';
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-4 text-sm font-semibold text-gray-800">{member.name}</td>
                                                        <td className="px-4 py-4 text-sm text-gray-700">{member.designation || '-'}</td>
                                                        <td className="px-4 py-4 text-sm text-gray-700">{member.branch || '-'}</td>
                                                        <td className="px-4 py-4 text-sm text-gray-700">{member.email || '-'}</td>
                                                        <td className="px-4 py-4 text-sm text-gray-700">{member.phone || '-'}</td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleEdit(member)}
                                                                    variant="outline"
                                                                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleDelete(member.id)}
                                                                    variant="outline"
                                                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
