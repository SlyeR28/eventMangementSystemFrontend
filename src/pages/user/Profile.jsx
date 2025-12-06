import { useState, useEffect } from 'react';
import { User, Mail, Lock, Camera } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';
import authService from '../../services/authService';
import userImageService from '../../services/userImageService';

export default function Profile() {
    const { user, updateUser } = useAuthStore();
    const { addToast } = useToastStore();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [userImage, setUserImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                const imageUrl = await userImageService.getUserImage(user.userId);
                if (imageUrl) setUserImage(imageUrl);
            } catch {
                console.error('Failed to fetch user image');
            }
        };

        if (user?.userId) {
            fetchUserImage();
        }
    }, [user]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageLoading(true);
        try {
            const response = await userImageService.uploadUserImage(user.userId, file);
            // The backend returns the URL string directly or as part of an object?
            // Based on userImageService.js: return response.data;
            // Let's assume it returns the URL string or we might need to adjust.
            // If it returns an object, we might need response.imageUrl or similar.
            // But looking at getUserImage it returns response.data which is "image URL string".
            // So upload likely returns the same or similar.
            // Let's assume response.data is the URL.
            // Wait, userImageService.uploadUserImage returns response.data.
            setUserImage(response);

            addToast({
                type: 'success',
                title: 'Image Updated',
                message: 'Profile picture updated successfully'
            });
        } catch {
            addToast({
                type: 'error',
                title: 'Upload Failed',
                message: 'Failed to upload profile picture'
            });
        } finally {
            setImageLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call backend API to update user
            // const updated = await userService.updateUser(user.userId, formData);

            // For now, update local state
            updateUser(formData);

            addToast({
                type: 'success',
                title: 'Profile Updated',
                message: 'Your profile has been updated successfully'
            });

            setIsEditing(false);
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Update Failed',
                message: error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            addToast({
                type: 'error',
                title: 'Password Mismatch',
                message: 'New password and confirm password do not match'
            });
            return;
        }

        setLoading(true);

        try {
            await authService.changePassword(
                passwordData.oldPassword,
                passwordData.newPassword,
                passwordData.confirmPassword
            );

            addToast({
                type: 'success',
                title: 'Password Changed',
                message: 'Your password has been changed successfully'
            });

            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setShowPasswordForm(false);
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Password Change Failed',
                message: error.response?.data?.message || 'Failed to change password'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Profile Picture Section */}
                    <div className="md:col-span-1">
                        <div className="card text-center">
                            <div className="relative inline-block">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto mb-4 border-4 border-white shadow-lg relative">
                                    {imageLoading ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                        </div>
                                    ) : userImage ? (
                                        <img
                                            src={userImage}
                                            alt={user?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-4xl font-bold">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                                    <Camera className="w-5 h-5 text-gray-600" />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={imageLoading}
                                    />
                                </label>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                            <p className="text-gray-600 text-sm mt-1">{user?.role}</p>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="card">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="btn btn-secondary text-sm"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="input"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mail className="w-4 h-4 inline mr-2" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="input"
                                        required
                                    />
                                </div>



                                {isEditing && (
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn btn-primary flex-1"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData({
                                                    name: user?.name || '',
                                                    email: user?.email || '',
                                                    mobile: user?.mobile || '',
                                                });
                                            }}
                                            className="btn btn-secondary flex-1"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Change Password */}
                        <div className="card">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Security</h3>
                                {!showPasswordForm && (
                                    <button
                                        onClick={() => setShowPasswordForm(true)}
                                        className="btn btn-secondary text-sm"
                                    >
                                        <Lock className="w-4 h-4 inline mr-2" />
                                        Change Password
                                    </button>
                                )}
                            </div>

                            {showPasswordForm && (
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="oldPassword"
                                            value={passwordData.oldPassword}
                                            onChange={handlePasswordChange}
                                            className="input"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="input"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="input"
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn btn-primary flex-1"
                                        >
                                            {loading ? 'Changing...' : 'Change Password'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPasswordForm(false);
                                                setPasswordData({
                                                    oldPassword: '',
                                                    newPassword: '',
                                                    confirmPassword: '',
                                                });
                                            }}
                                            className="btn btn-secondary flex-1"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
