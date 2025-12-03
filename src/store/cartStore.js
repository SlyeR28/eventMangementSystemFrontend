import { create } from 'zustand';

const useCartStore = create((set) => ({
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
                // Add new item
                const updatedItems = [...state.items, item];
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
}));

export default useCartStore;
