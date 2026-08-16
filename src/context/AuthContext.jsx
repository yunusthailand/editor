import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { apiUrl, TOKEN_KEY } from "@/lib/api";

const AuthContext = createContext(null);

// Same shape as the frontend's old AdminContext: a token in localStorage,
// verified against the same backend endpoint on load. "checking" exists so
// the guard can render nothing instead of flashing the login page while the
// verify request is in flight.
export function AuthProvider({ children }) {
  const [status, setStatus] = useState("checking");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setStatus("anon");
      return;
    }

    fetch(`${apiUrl}/auth/verifyToken`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setStatus("authed");
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setStatus("anon");
      });
  }, []);

  useEffect(() => {
    if (status === "anon" && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [status, location.pathname, navigate]);

  function login(token) {
    localStorage.setItem(TOKEN_KEY, token);
    setStatus("authed");
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setStatus("anon");
    navigate("/login", { replace: true });
  }

  return (
    <AuthContext.Provider value={{ status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
