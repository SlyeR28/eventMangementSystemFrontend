import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, ShoppingBag, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import ticketService from '../../services/ticketService';
import orderService from '../../services/orderService';

export default function UserDashboard() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({
        totalTickets: 0,
        upcomingEvents: 0,
        totalOrders: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [tickets, orders] = await Promise.all([
                ticketService.getUserTickets(user.userId),
                orderService.getOrders(user.userId),
            ]);

            setStats({
                totalTickets: tickets.length || 0,
                upcomingEvents: tickets.filter(t => new Date(t.event?.startTime) > new Date()).length || 0,
                totalOrders: orders.length || 0,
            });
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        { name: 'My Tickets', icon: Ticket, link: '/my-tickets', color: 'primary' },
        { name: 'My Orders', icon: ShoppingBag, link: '/my-orders', color: 'secondary' },
        { name: 'Browse Events', icon: Calendar, link: '/events', color: 'primary' },
        { name: 'Profile', icon: User, link: '/profile', color: 'secondary' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user?.fullName}!</h1>
                    <p className="text-gray-600 mt-2">Here's what's happening with your events</p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Tickets</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {loading ? '...' : stats.totalTickets}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                <Ticket className="w-6 h-6 text-primary-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Upcoming Events</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {loading ? '...' : stats.upcomingEvents}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-secondary-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {loading ? '...' : stats.totalOrders}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-primary-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {quickActions.map((action) => (
                            <Link
                                key={action.name}
                                to={action.link}
                                className="card hover:scale-105 transition-transform text-center"
                            >
                                <div className={`w-16 h-16 bg-${action.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <action.icon className={`w-8 h-8 text-${action.color}-600`} />
                                </div>
                                <h3 className="font-semibold text-gray-900">{action.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
