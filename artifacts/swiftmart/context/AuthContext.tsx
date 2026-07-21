import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  provider: 'google' | 'facebook' | 'truecaller' | 'email';
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithTruecaller: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
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
