import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
    persist(
        (set) => ({
            items: [],
            totalItems: 0,
            totalPrice: 0,

            addItem: (item) => {
                set((state) => {
                    const existingItem = state.items.find((i) => i.ticketTypeId === item.ticketTypeId);

                    if (existingItem) {
                        // Update quantity if item already exists
                        const updatedItems = state.items.map((i) =>
                            i.ticketTypeId === item.ticketTypeId
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        );
                        return {
                            items: updatedItems,
                            totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
                            totalPrice: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
                        };
                    } else {
                        // Add new item with complete information
                        const newItem = {
                            ticketTypeId: item.ticketTypeId,
                            eventId: item.eventId,
                            eventName: item.eventName,
                            ticketName: item.ticketName,
                            price: item.price,
                            quantity: item.quantity,
                            // Additional event information for display
                            eventImage: item.eventImage || null,
                            venue: item.venue || null,
                            startTime: item.startTime || null,
                        };
                        const updatedItems = [...state.items, newItem];
                        return {
                            items: updatedItems,
                            totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
                            totalPrice: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
                        };
                    }
                });
            },

            removeItem: (ticketTypeId) => {
                set((state) => {
                    const updatedItems = state.items.filter((i) => i.ticketTypeId !== ticketTypeId);
                    return {
                        items: updatedItems,
                        totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
                        totalPrice: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
                    };
                });
            },

            updateQuantity: (ticketTypeId, quantity) => {
                set((state) => {
                    const updatedItems = state.items.map((i) =>
                        i.ticketTypeId === ticketTypeId ? { ...i, quantity } : i
                    );
                    return {
                        items: updatedItems,
                        totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
                        totalPrice: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
                    };
                });
            },

            clearCart: () => {
                set({ items: [], totalItems: 0, totalPrice: 0 });
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);

export default useCartStore;
