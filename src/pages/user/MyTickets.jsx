import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'react-qr-code';
import { Calendar, MapPin, Download } from 'lucide-react';
import { format } from 'date-fns';
import useAuthStore from '../../store/authStore';
import ticketService from '../../services/ticketService';

export default function MyTickets() {
    const { user } = useAuthStore();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, upcoming, past

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await ticketService.getUserTickets(user.userId);
            setTickets(data || []);
        } catch (err) {
            console.error('Failed to fetch tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const eventDate = new Date(ticket.event?.startTime);
        const now = new Date();

        if (filter === 'upcoming') return eventDate > now;
        if (filter === 'past') return eventDate <= now;
        return true;
    });

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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">My Tickets</h1>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('upcoming')}
                            className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setFilter('past')}
                            className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-secondary'}`}
                        >
                            Past
                        </button>
                    </div>
                </div>

                {filteredTickets.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-xl text-gray-600">No tickets found</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredTickets.map((ticket) => (
                            <div key={ticket.id} className="card">
                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Ticket Info */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {ticket.event?.name || 'Event Name'}
                                        </h3>
                                        <p className="text-gray-600 mb-4">{ticket.ticketType?.name || 'Ticket Type'}</p>

                                        <div className="space-y-2">
                                            <div className="flex items-center text-gray-700">
                                                <Calendar className="w-5 h-5 mr-3 text-primary-600" />
                                                <span>
                                                    {ticket.event?.startTime
                                                        ? format(new Date(ticket.event.startTime), 'EEEE, MMMM dd, yyyy • h:mm a')
                                                        : 'Date TBD'}
                                                </span>
                                            </div>

                                            {ticket.event?.venue && (
                                                <div className="flex items-center text-gray-700">
                                                    <MapPin className="w-5 h-5 mr-3 text-primary-600" />
                                                    <span>{ticket.event.venue}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-sm text-gray-600">Ticket ID: {ticket.id}</p>
                                            <p className="text-sm text-gray-600">Status: <span className="font-semibold text-green-600">{ticket.status || 'Valid'}</span></p>
                                        </div>
                                    </div>

                                    {/* QR Code */}
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                                            <QRCodeSVG value={`TICKET-${ticket.id}`} size={150} />
                                        </div>
                                        <button className="btn btn-secondary mt-4 flex items-center gap-2">
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
