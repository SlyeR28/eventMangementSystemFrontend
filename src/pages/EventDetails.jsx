import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, Clock, Minus, Plus, TrendingUp, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { EventDetailSkeleton } from '../components/LoadingSkeletons';
import eventService from '../services/eventService';
import pricingService from '../services/pricingService';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const addItem = useCartStore((state) => state.addItem);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTickets, setSelectedTickets] = useState({});
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchEventDetails = async () => {
            setLoading(true);
            setError('');

            try {
                const data = await eventService.getEventById(id);

                // Fetch event images separately since they're stored with unidirectional mapping
                try {
                    const images = await eventService.getEventImages(id);
                    // Merge images into event data
                    data.imageInfos = images || [];
                } catch (imgError) {
                    console.log('No images found for event or error fetching images:', imgError);
                    data.imageInfos = [];
                }

                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'EEEE, MMMM dd, yyyy • h:mm a');
        } catch {
            return dateString;
        }
    };

    const handleQuantityChange = (ticketTypeId, change) => {
        setSelectedTickets((prev) => {
            const current = prev[ticketTypeId] || 0;
            const newQuantity = Math.max(0, current + change);
            return { ...prev, [ticketTypeId]: newQuantity };
        });
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        let itemsAdded = 0;
        Object.entries(selectedTickets).forEach(([ticketTypeId, quantity]) => {
            if (quantity > 0) {
                const ticket = event.ticketTypes.find(t => t.id === parseInt(ticketTypeId));
                if (ticket) {
                    addItem({
                        ticketTypeId: parseInt(ticketTypeId),
                        eventId: event.id,
                        eventName: event.name,
                        ticketName: ticket.name,
                        price: ticket.currentPrice,
                        quantity,
                        // Additional event information
                        eventImage: event.imageInfos?.[0]?.securedUrl || null,
                        venue: event.venue || null,
                        startTime: event.startTime || null,
                    });
                    itemsAdded++;
                }
            }
        });

        if (itemsAdded > 0) {
            navigate('/cart');
        }
    };

    const getTotalQuantity = () => {
        return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
    };

    const getTotalPrice = () => {
        return Object.entries(selectedTickets).reduce((sum, [ticketTypeId, quantity]) => {
            const ticket = event?.ticketTypes?.find(t => t.id === parseInt(ticketTypeId));
            return sum + (ticket ? ticket.currentPrice * quantity : 0);
        }, 0);
    };

    if (loading) {
        return <EventDetailSkeleton />;
    }

    if (error || !event) {
        return (
            <div className="container-custom py-20">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                    {error || 'Event not found'}
                </div>
            </div>
        );
    }

    const getSoldPercentage = (ticket) => {
        if (!ticket.totalQuantity) return 0;
        const sold = ticket.totalQuantity - ticket.remainingQuantity;
        return (sold / ticket.totalQuantity) * 100;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
            <div className="container-custom">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6 animate-fade-in">
                        {/* Image Gallery */}
                        <div className="card">
                            {event.imageInfos && event.imageInfos.length > 0 && event.imageInfos[currentImageIndex]?.securedUrl ? (
                                <div className="space-y-4">
                                    <img
                                        src={event.imageInfos[currentImageIndex].securedUrl}
                                        alt={event.name}
                                        className="w-full h-96 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    {event.imageInfos.length > 1 && (
                                        <div className="flex gap-2 overflow-x-auto">
                                            {event.imageInfos.map((img, index) => (
                                                img?.securedUrl && (
                                                    <img
                                                        key={index}
                                                        src={img.securedUrl}
                                                        alt={`${event.name} ${index + 1}`}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer ${index === currentImageIndex ? 'ring-2 ring-primary-600' : 'opacity-60'
                                                            }`}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                )
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-96 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-24 h-24 text-white opacity-50" />
                                </div>
                            )}
                        </div>

                        {/* Event Info */}
                        <div className="card">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.name}</h1>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-gray-700">
                                    <Calendar className="w-5 h-5 mr-3 text-primary-600" />
                                    <span>{formatDate(event.startTime)}</span>
                                </div>

                                {event.venue && (
                                    <div className="flex items-center text-gray-700">
                                        <MapPin className="w-5 h-5 mr-3 text-primary-600" />
                                        <span>{event.venue}</span>
                                    </div>
                                )}

                                {event.categoryName && (
                                    <div className="flex items-center text-gray-700">
                                        <Tag className="w-5 h-5 mr-3 text-primary-600" />
                                        <span>{event.categoryName}</span>
                                    </div>
                                )}

                                <div className="flex items-center text-gray-700">
                                    <Clock className="w-5 h-5 mr-3 text-primary-600" />
                                    <span>Ends: {formatDate(event.endTime)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Tickets */}
                    <div className="lg:col-span-1">
                        <div className="card-glass sticky top-20 animate-slide-in-right">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">Select Tickets</h2>

                            {event.ticketTypes && event.ticketTypes.length > 0 ? (
                                <div className="space-y-4">
                                    {event.ticketTypes.map((ticket) => {
                                        const soldPercentage = getSoldPercentage(ticket);
                                        const demandInfo = pricingService.getDemandLevel(soldPercentage);
                                        const showDemandBadge = soldPercentage >= 50;

                                        return (
                                            <div key={ticket.id} className="border-2 border-gray-200 rounded-xl p-4 bg-white/60 backdrop-blur-sm hover:border-primary-300 transition-all duration-200">
                                                {/* Demand Badge */}
                                                {showDemandBadge && (
                                                    <div className="mb-2">
                                                        <span className={`badge ${demandInfo.className} text-xs flex items-center gap-1 w-fit`}>
                                                            <TrendingUp className="w-3 h-3" />
                                                            {demandInfo.message}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{ticket.name}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                                                ₹{ticket.currentPrice}
                                                            </p>
                                                            {soldPercentage >= 75 && (
                                                                <TrendingUp className="w-4 h-4 text-red-500 animate-pulse-slow" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-sm text-gray-500 block">
                                                            {ticket.remainingQuantity} left
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {soldPercentage.toFixed(0)}% sold
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Quantity:</span>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleQuantityChange(ticket.id, -1)}
                                                            disabled={!selectedTickets[ticket.id]}
                                                            className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-10 text-center font-bold text-lg">
                                                            {selectedTickets[ticket.id] || 0}
                                                        </span>
                                                        <button
                                                            onClick={() => handleQuantityChange(ticket.id, 1)}
                                                            disabled={selectedTickets[ticket.id] >= ticket.remainingQuantity}
                                                            className="w-9 h-9 rounded-full gradient-primary hover:shadow-lg text-white disabled:opacity-50 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {getTotalQuantity() > 0 && (
                                        <div className="border-t-2 border-gray-200 pt-4 mt-4 animate-slide-up">
                                            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 mb-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-700 font-medium">Total ({getTotalQuantity()} tickets)</span>
                                                    <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                                        ₹{getTotalPrice()}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleAddToCart}
                                                className="w-full btn btn-primary py-4 text-lg shadow-lg hover:shadow-xl"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-600">No tickets available for this event.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
