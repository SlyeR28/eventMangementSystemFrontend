import { create } from 'zustand';

const useToastStore = create((set) => ({
    toasts: [],

    addToast: (toast) => {
        const id = Date.now();
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id }]
        }));

        // Auto-remove after duration
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter(t => t.id !== id)
            }));
        }, toast.duration || 3000);
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter(t => t.id !== id)
        }));
    },

    clearToasts: () => set({ toasts: [] })
}));

export default useToastStore;
