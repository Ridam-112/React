import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser, useClerk } from '@clerk/expo';

export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  provider: 'google' | 'email';
};

/** True when the mandatory post-login profile fields are still missing. */
export function needsOnboarding(user: AuthUser): boolean {
  if (!user.address) return true;
  if (!user.phone) return true;
  return false;
}

type ExtraProfile = { phone?: string; address?: string };
const extraKey = (uid: string) => `@swiftmart_extra_${uid}`;

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  completeProfile: (updates: { name: string; phone?: string; address: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Wraps Clerk's useUser/useClerk to expose an AuthUser that includes
 * extra profile fields (phone, address) stored in AsyncStorage per user.
 * Must be mounted inside <ClerkProvider>.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const [extra, setExtra] = useState<ExtraProfile>({});

  // Load extra profile data whenever the signed-in user changes
  useEffect(() => {
    if (!clerkUser?.id) {
      setExtra({});
      return;
    }
    AsyncStorage.getItem(extraKey(clerkUser.id)).then((raw) => {
      setExtra(raw ? JSON.parse(raw) : {});
    });
  }, [clerkUser?.id]);

  const user: AuthUser | null = clerkUser
    ? {
        id: clerkUser.id,
        name: clerkUser.fullName ?? clerkUser.firstName ?? 'User',
        email: clerkUser.primaryEmailAddress?.emailAddress,
        phone: extra.phone,
        address: extra.address,
        avatar: clerkUser.imageUrl,
        provider:
          clerkUser.externalAccounts?.[0]?.provider === 'google' ? 'google' : 'email',
      }
    : null;

  /** Saves phone + address to AsyncStorage and optionally updates the name in Clerk. */
  const completeProfile = async (updates: {
    name: string;
    phone?: string;
    address: string;
  }) => {
    if (!clerkUser) return;
    const newExtra: ExtraProfile = {
      ...extra,
      phone: updates.phone,
      address: updates.address,
    };
    await AsyncStorage.setItem(extraKey(clerkUser.id), JSON.stringify(newExtra));
    setExtra(newExtra);

    // Sync name into Clerk if it changed
    try {
      const parts = updates.name.trim().split(/\s+/);
      const firstName = parts[0];
      const lastName = parts.slice(1).join(' ') || undefined;
      if (firstName !== clerkUser.firstName || lastName !== clerkUser.lastName) {
        await clerkUser.update({ firstName, lastName });
      }
    } catch (e) {
      console.warn('Could not update name in Clerk:', e);
    }
  };

  const signOut = async () => {
    await clerkSignOut();
    // Extra data stays keyed by user ID — safe to leave, won't leak to other users
  };

  return (
    <AuthContext.Provider value={{ user, isLoading: !isLoaded, completeProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
