import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { format } from 'date-fns';

export default function EventCard({ event }) {
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

    const lowestPrice = getLowestPrice();

    return (
        <Link to={`/events/${event.id}`} className="card group cursor-pointer hover:scale-105 transition-transform duration-200">
            {/* Image */}
            <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                {event.imageInfos && event.imageInfos.length > 0 ? (
                    <img
                        src={event.imageInfos[0].securedUrl}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white opacity-50" />
                    </div>
                )}
                {event.status && (
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${event.status === 'PUBLISHED' ? 'bg-green-500 text-white' :
                            event.status === 'ONGOING' ? 'bg-blue-500 text-white' :
                                'bg-gray-500 text-white'
                        }`}>
                        {event.status}
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
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.startTime)}</span>
                    </div>
                    {event.venue && (
                        <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{event.venue}</span>
                        </div>
                    )}
                </div>

                {event.categoryName && (
                    <div className="flex items-center space-x-1 text-sm text-primary-600">
                        <Tag className="w-4 h-4" />
                        <span>{event.categoryName}</span>
                    </div>
                )}

                {lowestPrice !== null && (
                    <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Starting from</span>
                            <span className="text-2xl font-bold text-primary-600">₹{lowestPrice}</span>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}
