import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import eventService from '../../services/eventService';

export default function CreateEvent() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [tickets, setTickets] = useState([]);
    const [imageFiles] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const addTicketType = () => {
        setTickets([...tickets, { name: '', price: '', quantity: '' }]);
    };

    const removeTicketType = (index) => {
        setTickets(tickets.filter((_, i) => i !== index));
    };

    const updateTicketType = (index, field, value) => {
        const updated = [...tickets];
        updated[index][field] = value;
        setTickets(updated);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            const eventData = {
                name: data.name,
                description: data.description,
                venue: data.venue,
                startTime: data.startTime,
                endTime: data.endTime,
                salesStartTime: data.salesStartTime || data.startTime,
                salesEndTime: data.salesEndTime || data.endTime,
                categoryId: parseInt(data.categoryId) || 1,
                tickets: tickets.map(t => ({
                    name: t.name,
                    price: parseFloat(t.price),
                    quantity: parseInt(t.quantity)
                }))
            };

            const createdEvent = await eventService.createEvent(eventData);

            // Upload images if any (createdEvent might be the ID or an object with id/eventId)
            const eventId = createdEvent.id || createdEvent.eventId || createdEvent;
            if (imageFiles.length > 0 && eventId) {
                await eventService.uploadEventImage(eventId, imageFiles);
            }

            // Navigate to organizer dashboard
            navigate('/organizer/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom max-w-4xl">
                <button
                    onClick={() => navigate('/organizer/dashboard')}
                    className="btn btn-secondary mb-6 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="card">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Event</h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Name *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('name', { required: 'Event name is required' })}
                                        className="input"
                                        placeholder="Enter event name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        {...register('description', { required: 'Description is required' })}
                                        rows={4}
                                        className="input"
                                        placeholder="Describe your event"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Venue *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('venue', { required: 'Venue is required' })}
                                        className="input"
                                        placeholder="Event location"
                                    />
                                    {errors.venue && (
                                        <p className="mt-1 text-sm text-red-600">{errors.venue.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category ID
                                    </label>
                                    <input
                                        type="number"
                                        {...register('categoryId')}
                                        className="input"
                                        placeholder="1"
                                        defaultValue="1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Date & Time</h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        {...register('startTime', { required: 'Start time is required' })}
                                        className="input"
                                    />
                                    {errors.startTime && (
                                        <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        {...register('endTime', { required: 'End time is required' })}
                                        className="input"
                                    />
                                    {errors.endTime && (
                                        <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sales Start Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        {...register('salesStartTime')}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sales End Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        {...register('salesEndTime')}
                                        className="input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ticket Types */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Ticket Types</h2>
                                <button
                                    type="button"
                                    onClick={addTicketType}
                                    className="btn btn-secondary text-sm flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Ticket Type
                                </button>
                            </div>

                            {tickets.length === 0 && (
                                <p className="text-gray-500 text-sm italic">No ticket types added yet.</p>
                            )}

                            <div className="space-y-4">
                                {tickets.map((ticket, index) => (
                                    <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    value={ticket.name}
                                                    onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                                                    placeholder="Ticket Name (e.g., VIP, General)"
                                                    className="input"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="number"
                                                    value={ticket.price}
                                                    onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                                                    placeholder="Price"
                                                    className="input"
                                                    min="0"
                                                    required
                                                />
                                                <input
                                                    type="number"
                                                    value={ticket.quantity}
                                                    onChange={(e) => updateTicketType(index, 'quantity', e.target.value)}
                                                    placeholder="Quantity"
                                                    className="input"
                                                    min="1"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeTicketType(index)}
                                            className="text-red-500 hover:text-red-700 p-2"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary px-8 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Event'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/organizer/dashboard')}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
