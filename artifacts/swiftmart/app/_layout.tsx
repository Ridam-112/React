import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack, router, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ClerkProvider, useUser } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { CartProvider } from '@/context/CartContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { AuthProvider, useAuth, needsOnboarding } from '@/context/AuthContext';
import { AddressProvider } from '@/context/AddressContext';
import AnimatedSplash from '@/components/AnimatedSplash';
import { ReactNode } from 'react';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

/**
 * Listens for a Clerk Google session and syncs the user into the local
 * AsyncStorage AuthContext so the rest of the app stays consistent.
 * Must live inside both <ClerkProvider> and <AuthProvider>.
 */
function ClerkGoogleBridge() {
  const { user: clerkUser, isLoaded } = useUser();
  const { signInWithGoogle, user: localUser } = useAuth();

  useEffect(() => {
    if (!isLoaded || !clerkUser) return;
    const isGoogle = clerkUser.externalAccounts?.some(
      (a) => a.provider === 'google',
    );
    const email = clerkUser.primaryEmailAddress?.emailAddress ?? '';
    if (isGoogle && !localUser && email) {
      const name =
        clerkUser.fullName ||
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
        email.split('@')[0];
      signInWithGoogle({ id: clerkUser.id, name, email });
    }
  }, [isLoaded, clerkUser]);

  return null;
}

/** Bridges AuthContext → AddressProvider so userId is always in sync. */
function AddressWrapper({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return <AddressProvider userId={user?.id ?? null}>{children}</AddressProvider>;
}

/** Redirects a signed-in user to onboarding if their profile is incomplete. */
function OnboardingGuard() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  useEffect(() => {
    // Don't redirect while already on onboarding — prevents a loop mid-submission.
    if (!isLoading && user && needsOnboarding(user) && pathname !== '/onboarding') {
      router.replace('/onboarding');
    }
  }, [user, isLoading, pathname]);
  return null;
}

function RootLayoutNav() {
  return (
    <>
      <OnboardingGuard />
      <Stack screenOptions={{ headerBackTitle: 'Back' }}>
        <Stack.Screen name="(tabs)"                    options={{ headerShown: false }} />
        <Stack.Screen name="onboarding"                options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="products"                  options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]"              options={{ headerShown: false }} />
        <Stack.Screen name="shop/[id]"                 options={{ headerShown: false }} />
        <Stack.Screen name="notifications"             options={{ headerShown: false }} />
        <Stack.Screen name="flash-deals"               options={{ headerShown: false }} />
        <Stack.Screen name="offers"                    options={{ headerShown: false }} />
        <Stack.Screen name="shops"                     options={{ headerShown: false }} />
        <Stack.Screen name="order/[id]"                options={{ headerShown: false }} />
        <Stack.Screen name="checkout/address"          options={{ headerShown: false }} />
        <Stack.Screen name="checkout/payment"          options={{ headerShown: false }} />
        <Stack.Screen name="checkout/confirm"          options={{ headerShown: false }} />
        <Stack.Screen name="checkout/success"          options={{ headerShown: false }} />
        <Stack.Screen name="profile/edit"              options={{ headerShown: false }} />
        <Stack.Screen name="profile/addresses"         options={{ headerShown: false }} />
        <Stack.Screen name="profile/payment-methods"   options={{ headerShown: false }} />
        <Stack.Screen name="profile/order-history"     options={{ headerShown: false }} />
        <Stack.Screen name="profile/help"              options={{ headerShown: false }} />
        <Stack.Screen name="profile/settings"          options={{ headerShown: false }} />
        <Stack.Screen name="category/[id]"             options={{ headerShown: false }} />
        <Stack.Screen name="auth/index"                options={{ headerShown: false }} />
        <Stack.Screen name="auth/email"                options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

/**
 * Rendered inside AuthProvider so it can read auth loading state.
 * Shows the animated splash on top until both fonts and auth are ready,
 * then fades it out to reveal the app.
 */
function InnerApp({ fontsReady }: { fontsReady: boolean }) {
  const { isLoading: authLoading } = useAuth();
  const [splashDone, setSplashDone] = useState(false);
  const appReady = fontsReady && !authLoading;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        {/* App renders underneath — navigation is ready the moment splash exits */}
        {fontsReady && <RootLayoutNav />}

        {/* Animated splash sits on top until appReady, then fades out */}
        {!splashDone && (
          <AnimatedSplash ready={appReady} onDone={() => setSplashDone(true)} />
        )}
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const fontsReady = fontsLoaded || !!fontError;

  // Hide the native OS splash as soon as fonts are done —
  // our custom AnimatedSplash takes over from this point.
  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ClerkGoogleBridge />
              <AddressWrapper>
                <CartProvider>
                  <NotificationProvider>
                    <InnerApp fontsReady={fontsReady} />
                  </NotificationProvider>
                </CartProvider>
              </AddressWrapper>
            </AuthProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
