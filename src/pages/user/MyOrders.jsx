import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Package, Calendar } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import orderService from '../../services/orderService';

export default function MyOrders() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const data = await orderService.getOrders(user.userId);
                setOrders(data || []);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user.userId]);

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="card text-center py-12">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">No orders yet</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="card">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {order.createdAt
                                                ? format(new Date(order.createdAt), 'MMMM dd, yyyy • h:mm a')
                                                : 'Date unavailable'}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status || 'Pending'}
                                    </span>
                                </div>

                                {/* Order Items */}
                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    {order.items?.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.eventName || 'Event'}</p>
                                                    <p className="text-sm text-gray-600">{item.ticketType || 'Ticket'} × {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-primary-600">₹{order.totalAmount || 0}</span>
                                </div>

                                {order.paymentStatus && (
                                    <div className="mt-4 text-sm text-gray-600">
                                        Payment Status: <span className="font-semibold">{order.paymentStatus}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
