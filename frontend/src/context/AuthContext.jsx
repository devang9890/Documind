import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import API from "../services/api";

const AuthContext = createContext(null);

function getStoredToken() {
  return localStorage.getItem("token");
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const fetchMe = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null);
      return;
    }

    const res = await API.get("/auth/me");
    setUser(res.data);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await API.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.access_token);
    setToken(res.data.access_token);

    await fetchMe();

    return res.data;
  }, [fetchMe]);

  const register = useCallback(async ({ name, email, password }) => {
    const res = await API.post("/auth/register", { name, email, password });
    return res.data;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      try {
        await fetchMe();
      } catch (err) {
        if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [fetchMe, logout]);

  const value = useMemo(() => {
    return {
      token,
      user,
      loading,
      login,
      register,
      logout,
      refresh: fetchMe,
      isAuthenticated: Boolean(token),
    };
  }, [token, user, loading, login, register, logout, fetchMe]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
