import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Music, Briefcase, Heart, Trophy, Palette } from 'lucide-react';

// TODO: Replace with backend API call when /api/categories endpoint is implemented
// For now using hardcoded data since backend returns 404
const hardcodedCategories = [
    { id: 1, name: 'Music & Concerts', icon: Music, color: 'from-purple-500 to-pink-500', eventCount: 0 },
    { id: 2, name: 'Business & Professional', icon: Briefcase, color: 'from-blue-500 to-cyan-500', eventCount: 0 },
    { id: 3, name: 'Arts & Culture', icon: Palette, color: 'from-orange-500 to-red-500', eventCount: 0 },
    { id: 4, name: 'Sports & Fitness', icon: Trophy, color: 'from-green-500 to-emerald-500', eventCount: 0 },
    { id: 5, name: 'Food & Drink', icon: Heart, color: 'from-red-500 to-pink-500', eventCount: 0 },
    { id: 6, name: 'Community & Social', icon: Calendar, color: 'from-indigo-500 to-purple-500', eventCount: 0 },
];

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for better UX
        setTimeout(() => {
            setCategories(hardcodedCategories);
            setLoading(false);
        }, 300);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Browse by Category
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover events that match your interests
                        </p>
                    </div>
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Browse by Category
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover events that match your interests
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/events?category=${category.id}`}
                            className="card hover-lift group"
                        >
                            <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <category.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                            <p className="text-gray-600">
                                {category.eventCount} events
                            </p>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link to="/events" className="btn btn-primary">
                        View All Events
                    </Link>
                </div>
            </div>
        </div>
    );
}
