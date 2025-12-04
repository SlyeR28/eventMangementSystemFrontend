import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import ConfirmModal from '../ConfirmModal';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const totalItems = useCartStore((state) => state.totalItems);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
        setMobileMenuOpen(false); // Close mobile menu if open
    };

    const handleLogoutConfirm = () => {
        logout();
        setShowLogoutConfirm(false);
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">EventHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/events" className="text-gray-700 hover:text-primary-600 transition-colors">
                            Events
                        </Link>
                        <Link to="/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
                            Categories
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
                                    <ShoppingCart className="w-6 h-6" />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>

                                <div className="relative group">
                                    <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                                        <User className="w-6 h-6" />
                                        <span>{user?.fullName}</span>
                                    </button>

                                    {/* Dropdown */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                            Dashboard
                                        </Link>
                                        <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogoutClick}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-gray-700"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-2">
                        <Link to="/events" className="block py-2 text-gray-700 hover:text-primary-600">
                            Events
                        </Link>
                        <Link to="/categories" className="block py-2 text-gray-700 hover:text-primary-600">
                            Categories
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/cart" className="block py-2 text-gray-700 hover:text-primary-600">
                                    Cart ({totalItems})
                                </Link>
                                <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-primary-600">
                                    Dashboard
                                </Link>
                                <Link to="/profile" className="block py-2 text-gray-700 hover:text-primary-600">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogoutClick}
                                    className="block w-full text-left py-2 text-gray-700 hover:text-primary-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block py-2 text-gray-700 hover:text-primary-600">
                                    Login
                                </Link>
                                <Link to="/register" className="block py-2">
                                    <span className="btn btn-primary w-full text-center">Sign Up</span>
                                </Link>
                            </>
                        )}
                    </div>
                )}

            </div>

            <ConfirmModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogoutConfirm}
                title="Logout"
                message="Are you sure you want to logout?"
                confirmText="Logout"
                cancelText="Cancel"
                type="danger"
            />
        </nav>
    );
}
