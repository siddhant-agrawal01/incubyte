"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../lib/api";
import { Role, User } from "shared-types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password);
    if (response.data) {
      apiClient.setToken(response.data.token);
      setUser(response.data.user as User);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  };

  const register = async (email: string, password: string, name: string) => {
    await apiClient.register(email, password, name);
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAdmin = user?.role === Role.ADMIN;

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
