import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-20">
            <div className="container-custom py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">E</span>
                            </div>
                            <span className="text-xl font-bold text-white">EventHub</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            Discover and book tickets to the best events in your city.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/events" className="hover:text-primary-400 transition-colors">Browse Events</Link></li>
                            <li><Link to="/categories" className="hover:text-primary-400 transition-colors">Categories</Link></li>
                            <li><Link to="/dashboard" className="hover:text-primary-400 transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* For Organizers */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">For Organizers</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/organizer/dashboard" className="hover:text-primary-400 transition-colors">Organizer Dashboard</Link></li>
                            <li><Link to="/organizer/create-event" className="hover:text-primary-400 transition-colors">Create Event</Link></li>
                            <li><Link to="/register" className="hover:text-primary-400 transition-colors">Become an Organizer</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="hover:text-primary-400 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-primary-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-primary-400 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-primary-400 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                        <a href="mailto:support@eventhub.com" className="flex items-center text-sm hover:text-primary-400 transition-colors">
                            <Mail className="w-4 h-4 mr-2" />
                            support@eventhub.com
                        </a>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
