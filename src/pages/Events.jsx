import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import EventCard from '../components/EventCard';
import eventService from '../services/eventService';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        keyword: '',
        venue: '',
        category: '',
        status: '',
        startTime: '',
        endTime: '',
        page: 0,
        pageSize: 12,
    });

    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
    });

    const [appliedFilters, setAppliedFilters] = useState(filters);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await eventService.searchEvents(appliedFilters);
                setEvents(response.content || []);
                setPagination({
                    currentPage: response.currentPage,
                    totalPages: response.totalPages,
                    totalElements: response.totalElements,
                });
            } catch (err) {
                setError('Failed to load events. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [appliedFilters]);

    const handleSearch = (e) => {
        e.preventDefault();
        const newFilters = { ...filters, page: 0 };
        setFilters(newFilters);
        setAppliedFilters(newFilters);
    };

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        const resetFilters = {
            keyword: '',
            venue: '',
            category: '',
            status: '',
            startTime: '',
            endTime: '',
            page: 0,
            pageSize: 12,
        };
        setFilters(resetFilters);
        setAppliedFilters(resetFilters);
    };

    const handlePageChange = (newPage) => {
        setAppliedFilters({ ...appliedFilters, page: newPage });
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search Header */}
            <div className="bg-white shadow-sm py-8">
                <div className="container-custom">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">Discover Events</h1>

                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={filters.keyword}
                                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                                placeholder="Search events by name or description..."
                                className="input pl-12 w-full"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="btn btn-secondary flex items-center gap-2"
                        >
                            <Filter className="w-5 h-5" />
                            Filters
                        </button>
                        <button type="submit" className="btn btn-primary px-8">
                            Search
                        </button>
                    </form>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="mt-6 p-6 bg-gray-50 rounded-lg space-y-4 animate-slide-up">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Venue
                                    </label>
                                    <input
                                        type="text"
                                        value={filters.venue}
                                        onChange={(e) => handleFilterChange('venue', e.target.value)}
                                        placeholder="Enter venue"
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        placeholder="Enter category"
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="input"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="PUBLISHED">Published</option>
                                        <option value="ONGOING">Ongoing</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date (From)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={filters.startTime}
                                        onChange={(e) => handleFilterChange('startTime', e.target.value)}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date (To)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={filters.endTime}
                                        onChange={(e) => handleFilterChange('endTime', e.target.value)}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="btn btn-secondary flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="container-custom py-12">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600">No events found. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-gray-600">
                            Found {pagination.totalElements} event{pagination.totalElements !== 1 ? 's' : ''}
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-12">
                                <button
                                    onClick={() => handlePageChange(filters.page - 1)}
                                    disabled={filters.page === 0}
                                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                <span className="px-4 py-2 text-gray-700">
                                    Page {pagination.currentPage + 1} of {pagination.totalPages}
                                </span>

                                <button
                                    onClick={() => handlePageChange(filters.page + 1)}
                                    disabled={filters.page >= pagination.totalPages - 1}
                                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
