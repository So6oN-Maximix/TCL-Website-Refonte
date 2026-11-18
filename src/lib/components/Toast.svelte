<script>
    import { toasts } from "#lib/stores/toast.ts";
    import { fly, fade } from "svelte/transition";
    import { flip } from "svelte/animate";
</script>

<aside aria-label="Notifications" class="toast-container">
    {#each $toasts as toast (toast.id)}
        <div 
            class="toast {toast.type}"
            in:fly={{ y: 20, duration: 300 }}
            out:fade={{ duration: 200 }}
            animate:flip={{ duration: 300 }}
            role="status"
        >
            <!-- Icône selon le type -->
            <div class="toast-icon">
                {#if toast.type === "success"}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                {:else if toast.type === "error"}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {:else}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                {/if}
            </div>

            <p class="toast-message">{toast.message}</p>

            <button 
                type="button" 
                class="toast-close" 
                onclick={() => toasts.remove(toast.id)}
                aria-label="Fermer la notification"
            >
                &times;
            </button>
        </div>
    {/each}
</aside>

<style>
    .toast-container {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 380px;
        width: 100%;
        pointer-events: none; /* Laisse passer les clics à travers le conteneur vide */
    }

    .toast {
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        background: #ffffff;
        color: #1a1a1a;
        padding: 1rem 1.25rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #e30613; /* Identité visuelle rouge TCL */
        font-family: inherit;
        font-size: 0.925rem;
    }

    /* Variantes de couleurs */
    .toast.success {
        border-left-color: #2e7d32;
    }
    .toast.success .toast-icon {
        color: #2e7d32;
    }

    .toast.error {
        border-left-color: #e30613; /* Rouge TCL fort pour les erreurs */
    }
    .toast.error .toast-icon {
        color: #e30613;
    }

    .toast.info {
        border-left-color: #0288d1;
    }
    .toast.info .toast-icon {
        color: #0288d1;
    }

    .toast-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .toast-message {
        margin: 0;
        flex-grow: 1;
        line-height: 1.4;
        font-weight: 500;
    }

    .toast-close {
        background: transparent;
        border: none;
        color: #888;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        transition: color 0.2s;
    }

    .toast-close:hover {
        color: #1a1a1a;
    }
</style>