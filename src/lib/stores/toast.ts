import { writable } from "svelte/store";

export type ToastType = "success" | "error" | "info";

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

function createToastStore() {
    const { subscribe, update } = writable<Toast[]>([]);

    return {
        subscribe,
        /**
         * Affiche un toast
         * @param message Le texte du message
         * @param type Le type de toast ("success" | "error" | "info")
         * @param timeout Durée en ms avant fermeture auto (défaut: 3500ms)
         */
        send(message: string, type: ToastType = "success", timeout: number = 3500) {
            const id = Math.random().toString(36).substring(2, 9);
            update(state => [...state, { id, message, type }]);

            setTimeout(() => {
                update(state => state.filter(t => t.id !== id));
            }, timeout);
        },
        remove(id: string) {
            update(state => state.filter(t => t.id !== id));
        }
    };
}

export const toasts = createToastStore();