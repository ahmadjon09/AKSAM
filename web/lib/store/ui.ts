// Global UI state: toasts and the shared order modal.
// Kept intentionally small so toggling them never re-renders unrelated parts.

"use client";

import { create } from "zustand";

export interface Toast {
  id: number;
  kind: "success" | "error" | "info";
  title: string;
  description?: string;
}

export interface OrderProduct {
  slug: string;
  name: string;
}

interface UiState {
  // Toasts
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;

  // Order modal
  orderModalOpen: boolean;
  orderProduct: OrderProduct | null;

  openOrder: (product?: OrderProduct) => void;
  closeOrder: () => void;
}

let toastSeq = 0;

export const useUiStore = create<UiState>((set) => ({
  // --------------------------------------------------
  // Toasts
  // --------------------------------------------------

  toasts: [],

  pushToast: (toast) => {
    const id = ++toastSeq;

    set((state) => ({
      toasts: [
        ...state.toasts.slice(-3),
        {
          ...toast,
          id,
        },
      ],
    }));

    if (typeof window !== "undefined") {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      }, 5200);
    }
  },

  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  orderModalOpen: false,

  orderProduct: null,

  openOrder: (product) => {
    set({
      orderModalOpen: true,
      orderProduct: product ?? null,
    });
  },

  closeOrder: () => {
    set({
      orderModalOpen: false,
      orderProduct: null,
    });
  },
}));