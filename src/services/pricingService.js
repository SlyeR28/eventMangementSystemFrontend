import api from '../config/api';

// Pricing strategy types matching backend enum
export const PricingStrategyType = {
    DEFAULT: 'DEFAULT',
    DEMAND_BASED: 'DEMAND_BASED',
    TIME_BASED: 'TIME_BASED'
};

const pricingService = {
    /**
     * Apply a pricing strategy to a ticket type
     * @param {number} ticketTypeId - The ID of the ticket type
     * @param {string} strategy - The pricing strategy (DEFAULT, DEMAND_BASED, TIME_BASED)
     * @returns {Promise} - Updated ticket type data
     */
    applyPricingStrategy: async (ticketTypeId, strategy) => {
        const response = await api.post(`/api/pricing/apply/${ticketTypeId}`, null, {
            params: { strategy }
        });
        return response.data;
    },

    /**
     * Get pricing strategy description
     * @param {string} strategy - The pricing strategy type
     * @returns {object} - Strategy info with description
     */
    getStrategyInfo: (strategy) => {
        const strategies = {
            DEFAULT: {
                name: 'Default Pricing',
                description: 'Fixed price - no automatic adjustments',
                icon: '💰',
                color: 'gray'
            },
            DEMAND_BASED: {
                name: 'Demand-Based Pricing',
                description: 'Price increases as tickets sell out (dynamic)',
                icon: '📈',
                color: 'blue'
            },
            TIME_BASED: {
                name: 'Time-Based Pricing',
                description: 'Price changes based on time until event',
                icon: '⏰',
                color: 'purple'
            }
        };
        return strategies[strategy] || strategies.DEFAULT;
    },

    /**
     * Calculate demand level based on sold percentage
     * @param {number} soldPercentage - Percentage of tickets sold (0-100)
     * @returns {object} - Demand level info
     */
    getDemandLevel: (soldPercentage) => {
        if (soldPercentage >= 75) {
            return {
                level: 'HIGH',
                label: 'High Demand',
                className: 'demand-high',
                message: 'Selling fast! Prices may increase'
            };
        } else if (soldPercentage >= 50) {
            return {
                level: 'MEDIUM',
                label: 'Moderate Demand',
                className: 'demand-medium',
                message: 'Good availability'
            };
        } else {
            return {
                level: 'LOW',
                label: 'Available',
                className: 'demand-low',
                message: 'Plenty of tickets available'
            };
        }
    }
};

export default pricingService;
