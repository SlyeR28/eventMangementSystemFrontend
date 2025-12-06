import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import useAuthStore from './store/authStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import { ROLES } from './constants/roles';

// Lazy load all route components for code splitting
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const Categories = lazy(() => import('./pages/Categories'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));

// User Pages
const UserDashboard = lazy(() => import('./pages/user/Dashboard'));
const MyTickets = lazy(() => import('./pages/user/MyTickets'));
const MyOrders = lazy(() => import('./pages/user/MyOrders'));
const Profile = lazy(() => import('./pages/user/Profile'));

// Organizer Pages
const OrganizerDashboard = lazy(() => import('./pages/organizer/Dashboard'));
const CreateEvent = lazy(() => import('./pages/organizer/CreateEvent'));
const EditEvent = lazy(() => import('./pages/organizer/EditEvent'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
    </div>
  );
}

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
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <Toast />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/categories" element={<Categories />} />
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
                      {user?.role === ROLES.ORGANIZER ? <Navigate to="/organizer/dashboard" replace /> : <UserDashboard />}
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
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Organizer Dashboard Routes */}
                <Route
                  path="/organizer/dashboard"
                  element={
                    <ProtectedRoute requiredRole={ROLES.ORGANIZER}>
                      <OrganizerDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/organizer/create-event"
                  element={
                    <ProtectedRoute requiredRole={ROLES.ORGANIZER}>
                      <CreateEvent />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/organizer/edit-event/:id"
                  element={
                    <ProtectedRoute requiredRole={ROLES.ORGANIZER}>
                      <EditEvent />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
