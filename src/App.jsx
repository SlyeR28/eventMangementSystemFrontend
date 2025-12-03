import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import MyTickets from './pages/user/MyTickets';
import MyOrders from './pages/user/MyOrders';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/Dashboard';
import CreateEvent from './pages/organizer/CreateEvent';
import EditEvent from './pages/organizer/EditEvent';

// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes - Cart & Checkout */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            {/* User Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {user?.role === 'ORGANIZER' ? <Navigate to="/organizer/dashboard" replace /> : <UserDashboard />}
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-tickets"
              element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div className="container-custom py-20">
                    <h1 className="text-4xl font-bold">Profile Settings</h1>
                    <p className="text-gray-600 mt-4">Profile editing coming soon...</p>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Organizer Dashboard Routes */}
            <Route
              path="/organizer/dashboard"
              element={
                <ProtectedRoute requiredRole="ORGANIZER">
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/organizer/create-event"
              element={
                <ProtectedRoute requiredRole="ORGANIZER">
                  <CreateEvent />
                </ProtectedRoute>
              }
            />

            <Route
              path="/organizer/edit-event/:id"
              element={
                <ProtectedRoute requiredRole="ORGANIZER">
                  <EditEvent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
