import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { useState, memo } from 'react';
import pricingService from '../services/pricingService';

const EventCard = memo(function EventCard({ event }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    const getLowestPrice = () => {
        if (!event.tickets || event.tickets.length === 0) return null;
        return Math.min(...event.tickets.map(t => t.currentPrice));
    };

    const getSoldPercentage = () => {
        if (!event.tickets || event.tickets.length === 0) return 0;
        const totalTickets = event.tickets.reduce((sum, t) => sum + (t.totalQuantity || 0), 0);
        const remainingTickets = event.tickets.reduce((sum, t) => sum + (t.remainingQuantity || 0), 0);
        if (totalTickets === 0) return 0;
        return ((totalTickets - remainingTickets) / totalTickets) * 100;
    };

    const lowestPrice = getLowestPrice();
    const soldPercentage = getSoldPercentage();
    const demandInfo = pricingService.getDemandLevel(soldPercentage);
    const showDemandBadge = soldPercentage >= 50;

    return (
        <Link
            to={`/events/${event.id}`}
            className="card hover-lift group cursor-pointer overflow-hidden animate-fade-in"
        >
            {/* Image with Gradient Overlay */}
            <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl">
                {!imageLoaded && (
                    <div className="absolute inset-0 skeleton"></div>
                )}
                {event.imageInfos && event.imageInfos.length > 0 ? (
                    <>
                        <img
                            src={event.imageInfos[0].securedUrl}
                            alt={event.name}
                            loading="lazy"
                            onLoad={() => setImageLoaded(true)}
                            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                ) : (
                    <div className="w-full h-full gradient-primary flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white opacity-50" />
                    </div>
                )}

                {/* Status Badge */}
                {event.status && (
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${event.status === 'PUBLISHED' ? 'bg-green-500/90 text-white' :
                        event.status === 'ONGOING' ? 'bg-blue-500/90 text-white' :
                            'bg-gray-500/90 text-white'
                        } shadow-lg`}>
                        {event.status}
                    </span>
                )}

                {/* Demand Badge */}
                {showDemandBadge && (
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${demandInfo.className} shadow-lg backdrop-blur-sm flex items-center gap-1`}>
                        <TrendingUp className="w-3 h-3" />
                        {demandInfo.label}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {event.name}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2">
                    {event.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-primary-600" />
                        <span>{formatDate(event.startTime)}</span>
                    </div>
                    {event.venue && (
                        <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4 text-primary-600" />
                            <span className="truncate">{event.venue}</span>
                        </div>
                    )}
                </div>

                {event.categoryName && (
                    <div className="flex items-center space-x-1 text-sm">
                        <Tag className="w-4 h-4 text-secondary-600" />
                        <span className="text-secondary-600 font-medium">{event.categoryName}</span>
                    </div>
                )}

                {lowestPrice !== null && (
                    <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Starting from</span>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                    ₹{lowestPrice}
                                </span>
                                {soldPercentage >= 75 && (
                                    <TrendingUp className="w-4 h-4 text-red-500 animate-pulse-slow" />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
});

export default EventCard;
