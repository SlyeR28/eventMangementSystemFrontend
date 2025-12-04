import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import useToastStore from '../store/toastStore';
import orderService from '../services/orderService';

// Load Razorpay script
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function Checkout() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { items, totalPrice, clearCart } = useCartStore();
    const { addToast } = useToastStore();
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    const serviceFee = totalPrice * 0.05;
    const total = totalPrice + serviceFee;

    useEffect(() => {
        // Load Razorpay script on component mount
        loadRazorpayScript().then((loaded) => {
            setRazorpayLoaded(loaded);
            if (!loaded) {
                addToast({ type: 'error', message: 'Failed to load payment gateway. Please refresh the page.' });
            }
        });
    }, []);

    const handlePayment = async () => {
        if (!razorpayLoaded) {
            addToast({ type: 'error', message: 'Payment gateway not loaded. Please refresh the page.' });
            return;
        }

        if (!user || !user.userId) {
            addToast({ type: 'error', message: 'Please login to continue' });
            navigate('/login');
            return;
        }

        setLoading(true);

        try {
            // Step 1: Create order from cart in backend
            const order = await orderService.createOrder(user.userId);

            // Step 2: Create Razorpay payment
            const paymentRequest = {
                orderId: order.orderId,
                amount: order.totalAmount,
                currency: 'INR',
                description: `Order #${order.orderId} - Event Tickets`,
                email: user.email || '',
                paymentProviders: 'RAZORPAY'
            };

            const paymentResponse = await orderService.createPayment(paymentRequest, 'razorpay');

            // Step 3: Configure Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
                amount: paymentResponse.amount * 100, // Convert to paise
                currency: 'INR',
                name: 'Event Management System',
                description: paymentRequest.description,
                order_id: paymentResponse.providerOrderId,
                handler: async function (response) {
                    // Payment successful callback
                    try {
                        // Verify payment on backend
                        const verificationResponse = await orderService.verifyPayment(
                            order.orderId,
                            response.razorpay_payment_id,
                            response.razorpay_signature,
                            'razorpay'
                        );

                        if (verificationResponse.verified) {
                            // Payment verified successfully
                            setOrderComplete(true);
                            clearCart();
                            addToast({ type: 'success', message: 'Payment successful! Redirecting to your tickets...' });

                            // Redirect to tickets after 2 seconds
                            setTimeout(() => {
                                navigate('/my-tickets');
                            }, 2000);
                        } else {
                            addToast({ type: 'error', message: 'Payment verification failed. Please contact support.' });
                        }
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        addToast({ type: 'error', message: 'Payment verification failed. Please contact support.' });
                    }
                },
                prefill: {
                    name: user.name || '',
                    email: user.email || '',
                    contact: user.phone || '',
                },
                theme: {
                    color: '#6366f1', // Primary color
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        addToast({ type: 'error', message: 'Payment cancelled' });
                    },
                },
            };

            // Step 4: Open Razorpay checkout
            const razorpay = new window.Razorpay(options);
            razorpay.open();
            setLoading(false);
        } catch (error) {
            console.error('Payment initiation failed:', error);
            addToast({ type: 'error', message: error.response?.data?.message || 'Failed to initiate payment. Please try again.' });
            setLoading(false);
        }
    };

    // Demo payment handler (fallback if Razorpay is not configured)
    const handleDemoPayment = async () => {
        setLoading(true);

        try {
            // Create order from cart in backend
            await orderService.createOrder(user.userId);

            // Simulate payment processing
            setTimeout(() => {
                setOrderComplete(true);
                clearCart();
                setLoading(false);

                // Redirect to tickets after 2 seconds
                setTimeout(() => {
                    navigate('/my-tickets');
                }, 2000);
            }, 2000);
        } catch (error) {
            console.error('Order creation failed:', error);
            addToast({ type: 'error', message: 'Failed to create order. Please try again.' });
            setLoading(false);
        }
    };

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="card max-w-md text-center">
                    <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
                    <p className="text-gray-600 mb-6">
                        Your tickets have been confirmed. Redirecting to your tickets...
                    </p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="card mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.ticketTypeId} className="flex justify-between items-start pb-4 border-b border-gray-200">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{item.eventName}</h3>
                                            <p className="text-sm text-gray-600">{item.ticketName} × {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="card">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

                            <div className="border-2 border-primary-600 rounded-lg p-6 bg-primary-50">
                                <div className="flex items-center gap-3 mb-4">
                                    <CreditCard className="w-6 h-6 text-primary-600" />
                                    <span className="font-semibold text-gray-900">Razorpay Payment Gateway</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Secure payment processing via Razorpay. All major credit cards, debit cards, UPI, and net banking accepted.
                                </p>
                            </div>

                            {!razorpayLoaded && (
                                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Demo Mode:</strong> Razorpay is not configured. Click below to simulate payment.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-20">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Service Fee (5%)</span>
                                    <span>₹{serviceFee.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-primary-600">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={razorpayLoaded ? handlePayment : handleDemoPayment}
                                disabled={loading}
                                className="w-full btn btn-primary py-3 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Pay ₹{total.toFixed(2)}
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => navigate('/cart')}
                                className="w-full btn btn-secondary mt-3"
                            >
                                Back to Cart
                            </button>

                            <div className="mt-6 text-xs text-gray-500 text-center">
                                <p>Your payment is secured with 256-bit SSL encryption</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
