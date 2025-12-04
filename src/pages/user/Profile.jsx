import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Camera } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';
import authService from '../../services/authService';

export default function Profile() {
    const { user, updateUser } = useAuthStore();
    const { addToast } = useToastStore();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

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
                                <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <Camera className="w-5 h-5 text-gray-600" />
                                </button>
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 inline mr-2" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="input"
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
