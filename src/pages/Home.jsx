import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                            Discover Amazing Events
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100">
                            Find and book tickets to the best events in your city
                        </p>
                        <Link to="/events" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
                            Explore Events
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-gray-50">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose EventHub?</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="card text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
                            <p className="text-gray-600">Thousands of events across all categories</p>
                        </div>

                        <div className="card text-center">
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Ticket className="w-8 h-8 text-secondary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                            <p className="text-gray-600">Quick and secure ticket purchasing</p>
                        </div>

                        <div className="card text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Local Events</h3>
                            <p className="text-gray-600">Discover events happening near you</p>
                        </div>

                        <div className="card text-center">
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-secondary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Community</h3>
                            <p className="text-gray-600">Connect with like-minded people</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary-600 text-white">
                <div className="container-custom text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-xl mb-8 text-primary-100">
                        Join thousands of event-goers and organizers on EventHub
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
                            Sign Up Now
                        </Link>
                        <Link to="/events" className="btn bg-primary-700 hover:bg-primary-800 text-lg px-8 py-3">
                            Browse Events
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
