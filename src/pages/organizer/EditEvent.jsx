import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import eventService from '../../services/eventService';

export default function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [event, setEvent] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImageFiles([...newImageFiles, ...files]);
    };

    const removeNewImage = (index) => {
        setNewImageFiles(newImageFiles.filter((_, i) => i !== index));
    };

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        setLoading(true);
        try {
            const data = await eventService.getEventById(id);
            setEvent(data);

            // Populate form
            setValue('name', data.name);
            setValue('description', data.description);
            setValue('venue', data.venue);
            setValue('startTime', formatDateTimeLocal(data.startTime));
            setValue('endTime', formatDateTimeLocal(data.endTime));
            setValue('salesStartTime', formatDateTimeLocal(data.salesStartTime));
            setValue('salesEndTime', formatDateTimeLocal(data.salesEndTime));

            if (data.tickets) {
                setTickets(data.tickets.map(t => ({
                    name: t.name,
                    price: t.currentPrice, // Map currentPrice to price
                    quantity: t.initialQuantity || t.quantity // Use initial or current quantity
                })));
            }

            if (data.imageInfos) {
                setExistingImages(data.imageInfos);
            }
        } catch (err) {
            setError('Failed to load event');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const onSubmit = async (data) => {
        setSaving(true);
        setError('');

        try {
            await eventService.updateEvent(id, {
                name: data.name,
                description: data.description,
                venue: data.venue,
                startTime: data.startTime,
                endTime: data.endTime,
                salesStartTime: data.salesStartTime,
                salesEndTime: data.salesEndTime,
                tickets: tickets.map(t => ({
                    name: t.name,
                    price: parseFloat(t.price),
                    quantity: parseInt(t.quantity)
                }))
            });

            if (newImageFiles.length > 0) {
                await eventService.uploadEventImage(id, newImageFiles);
            }

            navigate('/organizer/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update event');
            console.error(err);
        } finally {
            setSaving(false);
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
            <div className="container-custom max-w-4xl">
                <button
                    onClick={() => navigate('/organizer/dashboard')}
                    className="btn btn-secondary mb-6 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="card">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Event {event && `- ${event.name}`}</h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                                    />
                                    {errors.venue && (
                                        <p className="mt-1 text-sm text-red-600">{errors.venue.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

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

                        {/* Event Images */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Images</h2>

                            <div className="space-y-4">
                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Existing Images</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {existingImages.map((img, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={img.securedUrl}
                                                        alt={`Event ${index}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    {/* Optional: Add delete button if backend supports it */}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload New Images */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="event-images"
                                    />
                                    <label htmlFor="event-images" className="cursor-pointer flex flex-col items-center">
                                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                        <span className="text-gray-600">Click to upload new images</span>
                                        <span className="text-sm text-gray-500 mt-1">(JPG, PNG, max 5MB)</span>
                                    </label>
                                </div>

                                {newImageFiles.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {newImageFiles.map((file, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${index}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn btn-primary px-8 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
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
