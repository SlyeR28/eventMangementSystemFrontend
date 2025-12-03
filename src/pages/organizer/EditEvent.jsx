import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import eventService from '../../services/eventService';

export default function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [event, setEvent] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

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
            });

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Event</h1>

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
