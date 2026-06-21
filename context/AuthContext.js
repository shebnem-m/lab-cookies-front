"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

 const checkUserStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include", 
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data && data.user ? data.user : null); 
        
        if (typeof window !== "undefined" && window.location.pathname === "/auth") {
          router.push("/");
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user status:", error);
      setUser(null);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  const login = (userData) => {
    setUser(userData);
    router.push("/");
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, { 
        method: "POST", 
        credentials: "include" 
      });
      setUser(null);
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}