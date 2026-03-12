import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiFetch("/auth/profile")
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.warn("Auth check failed:", err?.message);
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("token", res.data.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (data) => {
    const res = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    localStorage.setItem("token", res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const setUserFromToken = (token) => {
    if (!token) return Promise.reject(new Error("No token"));
    localStorage.setItem("token", token);
    return apiFetch("/auth/profile")
      .then((res) => {
        setUser(res.data);
        return res.data;
      })
      .catch((err) => {
        localStorage.removeItem("token");
        setUser(null);
        throw new Error(err?.message || "Invalid token");
      });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUserFromToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
