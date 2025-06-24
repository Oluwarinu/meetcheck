import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '../lib/api';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Session persistence
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await apiClient.getProfile();
          setUser(userData);
          setProfile(userData);
        } catch (err) {
          // Token is invalid, clear it
          apiClient.clearToken();
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      try {
        const userData = await apiClient.getProfile();
        setUser(userData);
        setProfile(userData);
      } catch (err) {
        setError('Failed to refresh profile');
      }
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(email, password);
      setUser(response.user);
      setProfile(response.user);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.signup(email, password, fullName);
      setUser(response.user);
      setProfile(response.user);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    await apiClient.logout();
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = await apiClient.updateProfile(updates);
      setUser(updatedUser);
      setProfile(updatedUser);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.resetPassword(email);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, login, signup, logout, updateProfile, resetPassword, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}; 