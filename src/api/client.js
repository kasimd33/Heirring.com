/**
 * API client for backend requests
 * - Local: localhost:5000
 * - Production: Render.com backend (or set VITE_API_URL in Vercel)
 */

const isLocalhost = typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location?.hostname || "");
const PRODUCTION_API_URL = "https://heirring-com-5.onrender.com/api";
export const API_BASE = import.meta.env.VITE_API_URL
  || (isLocalhost ? "http://localhost:5000/api" : PRODUCTION_API_URL);

function getToken() {
  return localStorage.getItem("token");
}

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
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

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(typeof msg === "string" ? msg : "Request failed");
  }

  return data;
}

/** Upload file (e.g. avatar) - do not set Content-Type, let browser set multipart boundary */
export async function apiUpload(endpoint, file, fieldName = "avatar") {
  const url = `${API_BASE}${endpoint}`;
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
