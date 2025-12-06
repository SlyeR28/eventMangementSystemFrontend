import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 md:py-32">
                {/* Animated Background */}
                <div className="absolute inset-0 gradient-primary opacity-90"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-6 animate-bounce-in">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-semibold">Discover Amazing Events</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white animate-fade-in">
                            Your Gateway to
                            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent mt-2">
                                Unforgettable Experiences
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto animate-slide-up">
                            Find and book tickets to the best events in your city with dynamic pricing and exclusive deals
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-scale-in">
                            <Link
                                to="/events"
                                className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-10 py-4 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                            >
                                <Calendar className="w-5 h-5 mr-2 inline" />
                                Explore Events
                            </Link>
                            <Link
                                to="/register"
                                className="btn bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 text-lg px-10 py-4"
                            >
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </section>

            {/* Features */}
            <section className="py-20 relative">
                <div className="container-custom">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                            Why Choose EventHub?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience the future of event booking with our cutting-edge platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="card-glass text-center hover-lift group animate-fade-in">
                            <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Calendar className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Wide Selection</h3>
                            <p className="text-gray-600">Thousands of events across all categories and venues</p>
                        </div>

                        <div className="card-glass text-center hover-lift group animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="w-20 h-20 gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <TrendingUp className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Dynamic Pricing</h3>
                            <p className="text-gray-600">Get the best deals with our smart pricing system</p>
                        </div>

                        <div className="card-glass text-center hover-lift group animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="w-20 h-20 gradient-success rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Shield className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Secure Booking</h3>
                            <p className="text-gray-600">Safe and encrypted payment processing</p>
                        </div>

                        <div className="card-glass text-center hover-lift group animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="w-20 h-20 gradient-warning rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Zap className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Instant Tickets</h3>
                            <p className="text-gray-600">Get your tickets delivered instantly via email</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white/50 backdrop-blur-sm">
                <div className="container-custom">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div className="animate-fade-in">
                            <div className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                                10K+
                            </div>
                            <div className="text-gray-600 font-medium">Events Listed</div>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                                50K+
                            </div>
                            <div className="text-gray-600 font-medium">Happy Customers</div>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                                500+
                            </div>
                            <div className="text-gray-600 font-medium">Event Organizers</div>
                        </div>
                        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                                100+
                            </div>
                            <div className="text-gray-600 font-medium">Cities Covered</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 gradient-primary"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

                <div className="container-custom text-center relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white animate-fade-in">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl mb-10 text-white/90 animate-slide-up">
                            Join thousands of event-goers and organizers on EventHub today
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-scale-in">
                            <Link
                                to="/register"
                                className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-10 py-4 shadow-2xl hover:shadow-3xl"
                            >
                                <Users className="w-5 h-5 mr-2 inline" />
                                Sign Up Now
                            </Link>
                            <Link
                                to="/events"
                                className="btn bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 text-lg px-10 py-4"
                            >
                                <Ticket className="w-5 h-5 mr-2 inline" />
                                Browse Events
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
