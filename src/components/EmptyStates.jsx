import { Search, Calendar, ShoppingCart, Ticket, FileText } from 'lucide-react';

export function NoEventsFound() {
    return (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
                We couldn't find any events matching your criteria. Try adjusting your filters or search terms.
            </p>
        </div>
    );
}

export function NoTickets() {
    return (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ticket className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Tickets Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
                You haven't purchased any tickets yet. Browse events and get your tickets now!
            </p>
            <a href="/events" className="btn btn-primary inline-block">
                Browse Events
            </a>
        </div>
    );
}

export function NoOrders() {
    return (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
                You haven't placed any orders yet. Start exploring events and make your first purchase!
            </p>
            <a href="/events" className="btn btn-primary inline-block">
                Explore Events
            </a>
        </div>
    );
}

export function EmptyCart() {
    return (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Your Cart is Empty</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
                Add some tickets to your cart to get started!
            </p>
            <a href="/events" className="btn btn-primary inline-block">
                Browse Events
            </a>
        </div>
    );
}

export function NoEventsOrganizer() {
    return (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Events Created</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
                You haven't created any events yet. Start by creating your first event!
            </p>
            <a href="/organizer/create-event" className="btn btn-primary inline-block">
                Create Event
            </a>
        </div>
    );
}
