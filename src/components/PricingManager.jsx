import { useState } from 'react';
import { TrendingUp, Info, Check, Loader } from 'lucide-react';
import pricingService, { PricingStrategyType } from '../services/pricingService';

export default function PricingManager({ ticketType, onPricingUpdate }) {
    const [selectedStrategy, setSelectedStrategy] = useState(ticketType.pricingStrategy || PricingStrategyType.DEFAULT);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState(null);

    const handleApplyPricing = async () => {
        setApplying(true);
        setMessage(null);

        try {
            const updatedTicketType = await pricingService.applyPricingStrategy(ticketType.id, selectedStrategy);
            setMessage({ type: 'success', text: 'Pricing strategy applied successfully!' });

            if (onPricingUpdate) {
                onPricingUpdate(updatedTicketType);
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to apply pricing strategy'
            });
        } finally {
            setApplying(false);
        }
    };

    const calculateSoldPercentage = () => {
        if (!ticketType.totalQuantity) return 0;
        const sold = ticketType.totalQuantity - ticketType.remainingQuantity;
        return (sold / ticketType.totalQuantity) * 100;
    };

    const soldPercentage = calculateSoldPercentage();
    const demandInfo = pricingService.getDemandLevel(soldPercentage);

    return (
        <div className="card-glass space-y-4 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{ticketType.name}</h3>
                    <p className="text-sm text-gray-600">Manage pricing strategy</p>
                </div>
                <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>

            {/* Current Price Info */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Current Price</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        ₹{ticketType.currentPrice}
                    </p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Base Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                        ₹{ticketType.basePrice || ticketType.currentPrice}
                    </p>
                </div>
            </div>

            {/* Demand Indicator */}
            <div className={`rounded-xl p-4 ${demandInfo.className} flex items-center justify-between`}>
                <div>
                    <p className="font-semibold">{demandInfo.label}</p>
                    <p className="text-sm opacity-90">{demandInfo.message}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">{soldPercentage.toFixed(0)}%</p>
                    <p className="text-sm opacity-90">Sold</p>
                </div>
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Available Tickets</span>
                <span className="font-semibold text-gray-900">
                    {ticketType.remainingQuantity} / {ticketType.totalQuantity}
                </span>
            </div>

            {/* Strategy Selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing Strategy
                </label>
                <div className="space-y-2">
                    {Object.values(PricingStrategyType).map((strategy) => {
                        const strategyInfo = pricingService.getStrategyInfo(strategy);
                        const isSelected = selectedStrategy === strategy;
                        const isCurrent = ticketType.pricingStrategy === strategy;

                        return (
                            <button
                                key={strategy}
                                type="button"
                                onClick={() => setSelectedStrategy(strategy)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                    ? 'border-primary-500 bg-primary-50/50 shadow-md'
                                    : 'border-gray-200 bg-white/40 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{strategyInfo.icon}</span>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-gray-900">
                                                    {strategyInfo.name}
                                                </p>
                                                {isCurrent && (
                                                    <span className="badge badge-success text-xs">
                                                        <Check className="w-3 h-3 mr-1" />
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {strategyInfo.description}
                                            </p>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">How Dynamic Pricing Works</p>
                        <ul className="space-y-1 text-blue-700">
                            <li>• <strong>Default:</strong> Fixed price, no changes</li>
                            <li>• <strong>Demand-Based:</strong> Price increases as tickets sell (75%+ sold)</li>
                            <li>• <strong>Time-Based:</strong> Price changes based on days until event</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className={`rounded-xl p-4 animate-slide-up ${message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Apply Button */}
            <button
                onClick={handleApplyPricing}
                disabled={applying || selectedStrategy === ticketType.pricingStrategy}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {applying ? (
                    <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Applying...
                    </>
                ) : (
                    <>
                        <TrendingUp className="w-5 h-5" />
                        Apply Pricing Strategy
                    </>
                )}
            </button>
        </div>
    );
}
