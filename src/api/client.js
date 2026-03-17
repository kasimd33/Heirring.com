/**
 * API client for backend requests
 * - Local origin: http://localhost:5000
 * - Production origin: Set VITE_API_URL in Vercel (e.g. https://heirring-com-6.onrender.com)
 */

const isLocalhost = typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location?.hostname || "");
const PRODUCTION_API_ORIGIN = "https://heirring-com-6.onrender.com";

function normalizeOrigin(raw) {
  if (!raw || typeof raw !== "string") return raw;
  return raw.trim().replace(/\/+$/, ""); // remove trailing slashes
}

export const API_ORIGIN = normalizeOrigin(
  import.meta.env.VITE_API_URL || (isLocalhost ? "http://localhost:5000" : PRODUCTION_API_ORIGIN)
);

export const API_BASE = `${API_ORIGIN}/api`;

function getToken() {
  return localStorage.getItem("token");
}

export async function apiFetch(endpoint, options = {}) {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new Error(err?.message || "Network error. Check your connection.");
  }

  let data = {};
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch (_) {
    data = {};
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || (data?.errors?.[0]?.msg) || `Request failed (${res.status})`;
    throw new Error(typeof msg === "string" ? msg : "Request failed");
  }

  return data;
}

/** Upload file (e.g. avatar) - do not set Content-Type, let browser set multipart boundary */
export async function apiUpload(endpoint, file, fieldName = "avatar") {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${path}`;
  const formData = new FormData();
  formData.append(fieldName, file);

  const headers = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data;
}
