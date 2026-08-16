// Admin session state. The access token lives in memory plus localStorage
// (so a page refresh keeps you signed in), while the refresh token lives in
// an httpOnly cookie managed by the API.

"use client";

import { create } from "zustand";
import type { AdminUserDto } from "../types";
import { adminApi } from "../api";

const ACCESS_KEY = "aksam_access_token";

interface AuthState {
  token: string | null;
  user: AdminUserDto | null;
  booted: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setSession: (token: string, user: AdminUserDto) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  booted: false,

  init: async () => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(ACCESS_KEY) : null;
    if (!stored) {
      set({ booted: true, token: null, user: null });
      return;
    }
    try {
      const res = await adminApi.me(stored);
      set({ token: stored, user: res.user, booted: true });
    } catch {
      // The access token may be expired. Try rotating it via the cookie.
      try {
        const refreshed = await adminApi.refresh();
        localStorage.setItem(ACCESS_KEY, refreshed.accessToken);
        set({ token: refreshed.accessToken, user: refreshed.user, booted: true });
      } catch {
        localStorage.removeItem(ACCESS_KEY);
        set({ token: null, user: null, booted: true });
      }
    }
  },

  setSession: (token, user) => {
    localStorage.setItem(ACCESS_KEY, token);
    set({ token, user });
  },

  login: async (email, password) => {
    const res = await adminApi.login(email, password);
    get().setSession(res.accessToken, res.user);
  },

  logout: async () => {
    try {
      await adminApi.logout();
    } catch {
      // Even if the call fails, clear the local session.
    }
    localStorage.removeItem(ACCESS_KEY);
    set({ token: null, user: null });
  }
}));
