import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  provider: 'google' | 'facebook' | 'truecaller' | 'email';
};

/** True when the mandatory post-login profile fields are still missing. */
export function needsOnboarding(user: AuthUser): boolean {
  if (!user.address) return true;
  // Truecaller provides phone automatically; everyone else must supply it.
  if (user.provider !== 'truecaller' && !user.phone) return true;
  return false;
}

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithTruecaller: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  completeProfile: (updates: { name: string; phone?: string; address: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = '@swiftmart_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY)
      .then((raw) => {
        if (raw) setUser(JSON.parse(raw));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persist = async (u: AuthUser) => {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(u));
    setUser(u);
  };

  const signInWithGoogle = async () => {
    // Mock — replace with expo-auth-session / Google Sign-In SDK
    await persist({
      id: 'g_001',
      name: 'Ridam Kumar',
      email: 'ridam@gmail.com',
      provider: 'google',
    });
  };

  const signInWithFacebook = async () => {
    // Mock — replace with expo-facebook / Facebook SDK
    await persist({
      id: 'fb_001',
      name: 'Ridam Kumar',
      email: 'ridam@facebook.com',
      provider: 'facebook',
    });
  };

  const signInWithTruecaller = async () => {
    // Mock — replace with Truecaller SDK (react-native-true-caller)
    await persist({
      id: 'tc_001',
      name: 'Ridam Kumar',
      phone: '+91 98765 43210',
      provider: 'truecaller',
    });
  };

  const signInWithEmail = async (email: string, _password: string) => {
    await persist({
      id: 'em_001',
      name: email.split('@')[0],
      email,
      provider: 'email',
    });
  };

  const signUpWithEmail = async (name: string, email: string, _password: string) => {
    await persist({ id: 'em_001', name, email, provider: 'email' });
  };

  /** Saves name, phone (if provided), and address onto the current user. */
  const completeProfile = async (updates: { name: string; phone?: string; address: string }) => {
    if (!user) return;
    await persist({ ...user, ...updates });
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle,
        signInWithFacebook,
        signInWithTruecaller,
        signInWithEmail,
        signUpWithEmail,
        completeProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
