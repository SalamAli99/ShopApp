import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, signup as apiSignup, profile, logout as apiLogout } from "./api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [busy,  setBusy]  = useState(true);    // wait for auto-login

  // 👉 auto-load user on first mount if token exists
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return setBusy(false);

      try {
        const { data } = await profile();
        setUser(data);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  // ─── auth actions ───
  const login  = async (values) => {
    const { data } = await apiLogin(values);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const signup = async (values) => {
    const { data } = await apiSignup(values);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = { user, login, signup, logout };

  if (busy) return <div className="p-8 text-center">Loading…</div>;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
