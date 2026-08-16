// Anonymous visitor tracking. Every visitor gets a random token stored in
// localStorage; a tiny beacon reports each page view to the API, which
// deduplicates unique visitors by (day, token hash) and aggregates views.

"use client";

import { trackVisit } from "./api";

const TOKEN_KEY = "aksam_vid";

export function getVisitorToken(): string {
  if (typeof window === "undefined") return "";
  let token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = generateToken();
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Storage may be blocked in private mode — tracking just won't dedupe.
    }
  }
  return token;
}

function generateToken(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function reportPageView(lang: string): void {
  if (typeof window === "undefined") return;
  const token = getVisitorToken();
  void trackVisit({
    token,
    path: window.location.pathname,
    referrer: document.referrer,
    lang
  });
}
