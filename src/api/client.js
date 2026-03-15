/**
 * API client for backend requests
 * - Local: localhost:5000/api
 * - Production: Set VITE_API_URL in Vercel (e.g. https://heirring-com-6.onrender.com/api)
 */

const isLocalhost = typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location?.hostname || "");
const PRODUCTION_API_URL = "https://heirring-com-6.onrender.com/api";

function normalizeApiBase(raw) {
  if (!raw || typeof raw !== "string") return raw;
  let base = raw.trim().replace(/\/+$/, ""); // remove trailing slashes
  if (!base.endsWith("/api")) base = base + (base.endsWith("/") ? "" : "/") + "api";
  return base;
}

export const API_BASE = normalizeApiBase(
  import.meta.env.VITE_API_URL || (isLocalhost ? "http://localhost:5000/api" : PRODUCTION_API_URL)
);

function getToken() {
  return localStorage.getItem("token");
}

export async function apiFetch(endpoint, options = {}) {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE.replace(/\/+$/, "")}${path}`;
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
  const url = `${API_BASE.replace(/\/+$/, "")}${path}`;
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
