/**
 * Local AsyncStorage-backed auth — no Clerk dependency.
 * Works fully offline and without any external service.
 *
 * Users are stored as a JSON array under USERS_KEY.
 * The active session is just the user-id stored under SESSION_KEY.
 *
 * Passwords are stored as-is (demo only — add hashing for production).
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* ─── Types ─────────────────────────────────────────────────────── */
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  provider: 'email' | 'google' | 'truecaller';
};

type StoredUser = AuthUser & { password: string };

export function needsOnboarding(user: AuthUser): boolean {
  return !user.address || !user.phone;
}

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeProfile: (updates: { name: string; phone?: string; address: string }) => Promise<void>;
};

/* ─── Storage keys ───────────────────────────────────────────────── */
const USERS_KEY   = '@swiftmart/users';
const SESSION_KEY = '@swiftmart/session';

/* ─── Helpers ────────────────────────────────────────────────────── */
async function loadUsers(): Promise<StoredUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}
async function saveUsers(users: StoredUser[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function uid() {
  return `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function toPublic(u: StoredUser): AuthUser {
  const { password: _p, ...pub } = u;
  return pub;
}

/* ─── Context ────────────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* Restore session on mount */
  useEffect(() => {
    (async () => {
      try {
        const sessionId = await AsyncStorage.getItem(SESSION_KEY);
        if (sessionId) {
          const users = await loadUsers();
          const found = users.find((u) => u.id === sessionId);
          if (found) setUser(toPublic(found));
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    const users = await loadUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) throw new Error('Invalid email or password. Please try again.');
    await AsyncStorage.setItem(SESSION_KEY, found.id);
    setUser(toPublic(found));
  };

  const signUp = async (name: string, email: string, password: string) => {
    const users = await loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUser: StoredUser = {
      id: uid(),
      name,
      email,
      password,
      provider: 'email',
    };
    users.push(newUser);
    await saveUsers(users);
    await AsyncStorage.setItem(SESSION_KEY, newUser.id);
    setUser(toPublic(newUser));
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const completeProfile = async (updates: {
    name: string;
    phone?: string;
    address: string;
  }) => {
    if (!user) return;
    const users = await loadUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx < 0) return;
    users[idx] = { ...users[idx], ...updates };
    await saveUsers(users);
    setUser(toPublic(users[idx]));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, completeProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
