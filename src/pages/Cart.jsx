import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import { EmptyCart } from '../components/EmptyStates';
import ConfirmModal from '../components/ConfirmModal';

export default function Cart() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [showClearCartModal, setShowClearCartModal] = useState(false);
    const [showRemoveItemModal, setShowRemoveItemModal] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

    const handleQuantityChange = (ticketTypeId, newQuantity) => {
        if (newQuantity < 1) {
            setItemToRemove(ticketTypeId);
            setShowRemoveItemModal(true);
        } else {
            updateQuantity(ticketTypeId, newQuantity);
        }
    };

    const confirmRemoveItem = () => {
        if (itemToRemove) {
            removeItem(itemToRemove);
            setItemToRemove(null);
        }
    };

    const confirmClearCart = () => {
        clearCart();
    };

    const handleCheckout = () => {
        if (items.length === 0) return;
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-20">
                <div className="container-custom">
                    <EmptyCart />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.ticketTypeId} className="card">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                            {item.eventName}
                                        </h3>
                                        <p className="text-gray-600 mb-3">{item.ticketName}</p>
                                        <p className="text-2xl font-bold text-primary-600">
                                            ₹{item.price}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setItemToRemove(item.ticketTypeId);
                                            setShowRemoveItemModal(true);
                                        }}
                                        className="text-red-600 hover:text-red-700 p-2"
                                        title="Remove from cart"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-600">Quantity:</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.ticketTypeId, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-semibold text-lg">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(item.ticketTypeId, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Subtotal</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            ₹{item.price * item.quantity}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => setShowClearCartModal(true)}
                            className="btn btn-secondary flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear Cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-20">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal ({totalItems} tickets)</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Service Fee</span>
                                    <span>₹{(totalPrice * 0.05).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-primary-600">
                                        ₹{(totalPrice * 1.05).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Proceed to Checkout'}
                            </button>

                            <button
                                onClick={() => navigate('/events')}
                                className="w-full btn btn-secondary mt-3"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>

                <ConfirmModal
                    isOpen={showClearCartModal}
                    onClose={() => setShowClearCartModal(false)}
                    onConfirm={confirmClearCart}
                    title="Clear Cart"
                    message="Are you sure you want to remove all items from your cart?"
                    confirmText="Clear Cart"
                    cancelText="Cancel"
                    type="danger"
                />

                <ConfirmModal
                    isOpen={showRemoveItemModal}
                    onClose={() => {
                        setShowRemoveItemModal(false);
                        setItemToRemove(null);
                    }}
                    onConfirm={confirmRemoveItem}
                    title="Remove Item"
                    message="Are you sure you want to remove this item from your cart?"
                    confirmText="Remove"
                    cancelText="Cancel"
                    type="danger"
                />
            </div>
        </div>
    );
}
