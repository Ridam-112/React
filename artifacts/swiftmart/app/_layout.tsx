import React, { useEffect } from 'react';
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
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { CartProvider } from '@/context/CartContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { AuthProvider, useAuth, needsOnboarding } from '@/context/AuthContext';
import { AddressProvider } from '@/context/AddressContext';
import { ClerkProvider, ClerkLoaded } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { ReactNode } from 'react';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Fall back to a stub key so ClerkProvider mounts without crashing.
// When the stub is active, ClerkLoaded never fires — we use ClerkReady instead.
const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_stub_no_auth';
const proxyUrl = process.env.EXPO_PUBLIC_CLERK_PROXY_URL || undefined;
const hasClerk = !!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Renders children immediately when Clerk isn't configured (stub key),
 * otherwise waits for ClerkLoaded so hooks like useUser work.
 */
function ClerkReady({ children }: { children: ReactNode }) {
  if (!hasClerk) return <>{children}</>;
  return <ClerkLoaded>{children}</ClerkLoaded>;
}

/** Bridges AuthContext → AddressProvider so userId is always in sync. */
function AddressWrapper({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return <AddressProvider userId={user?.id ?? null}>{children}</AddressProvider>;
}

/** Redirects a signed-in user to onboarding if their profile is incomplete. */
function OnboardingGuard() {
  const { user, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading && user && needsOnboarding(user)) {
      router.replace('/onboarding');
    }
  }, [user, isLoading]);
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

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache} proxyUrl={proxyUrl}>
          <ClerkReady>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <AddressWrapper>
                  <CartProvider>
                    <NotificationProvider>
                      <GestureHandlerRootView style={{ flex: 1 }}>
                        <KeyboardProvider>
                          <RootLayoutNav />
                        </KeyboardProvider>
                      </GestureHandlerRootView>
                    </NotificationProvider>
                  </CartProvider>
                </AddressWrapper>
              </AuthProvider>
            </QueryClientProvider>
          </ClerkReady>
        </ClerkProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
