import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import useAuthStore from '../../store/authStore';
import eventService from '../../services/eventService';

export default function OrganizerDashboard() {
    const { user } = useAuthStore();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEvents: 0,
        publishedEvents: 0,
        draftEvents: 0,
    });

    useEffect(() => {
        const fetchOrganizerEvents = async () => {
            setLoading(true);
            try {
                const data = await eventService.getEventsByOrganizer(user.userId);
                setEvents(data || []);

                setStats({
                    totalEvents: data.length,
                    publishedEvents: data.filter(e => e.status === 'PUBLISHED' || e.status === 'ONGOING').length,
                    draftEvents: data.filter(e => e.status === 'DRAFT').length,
                });
            } catch (err) {
                console.error('Failed to fetch events:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizerEvents();
    }, [user.userId]);

    const handleDelete = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            await eventService.deleteEvent(eventId);
            fetchOrganizerEvents();
        } catch (err) {
            console.error('Failed to delete event:', err);
            alert('Failed to delete event');
        }
    };

    const handlePublish = async (eventId) => {
        try {
            await eventService.publishEvent(eventId);
            fetchOrganizerEvents();
        } catch (err) {
            console.error('Failed to publish event:', err);
            alert('Failed to publish event');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PUBLISHED':
                return 'bg-green-100 text-green-800';
            case 'ONGOING':
                return 'bg-blue-100 text-blue-800';
            case 'DRAFT':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Organizer Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage your events</p>
                    </div>
                    <Link to="/organizer/create-event" className="btn btn-primary flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Create Event
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Events</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalEvents}</p>
                            </div>
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-primary-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Published</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.publishedEvents}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Drafts</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.draftEvents}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events List */}
                <div className="card">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Events</h2>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-xl text-gray-600 mb-4">No events yet</p>
                            <Link to="/organizer/create-event" className="btn btn-primary">
                                Create Your First Event
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {events.map((event) => (
                                <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                                                    {event.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>{event.venue}</span>
                                                <span>•</span>
                                                <span>
                                                    {event.startTime
                                                        ? format(new Date(event.startTime), 'MMM dd, yyyy')
                                                        : 'Date TBD'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 ml-4">
                                            <Link
                                                to={`/events/${event.id}`}
                                                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                                                title="View"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                to={`/organizer/edit-event/${event.id}`}
                                                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                                                title="Edit"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            {event.status === 'DRAFT' && (
                                                <button
                                                    onClick={() => handlePublish(event.id)}
                                                    className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                >
                                                    Publish
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
