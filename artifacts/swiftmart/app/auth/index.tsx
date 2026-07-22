import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/expo';

WebBrowser.maybeCompleteAuthSession();

const { width: W, height: H } = Dimensions.get('window');

/* ─── Floating background blobs ──────────────────────────────────── */
function Blob({ x, y, size, color, opacity }: { x: number; y: number; size: number; color: string; opacity: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
      }}
    />
  );
}

/* ─── Google "G" icon ────────────────────────────────────────────── */
function GoogleG({ size = 20 }: { size?: number }) {
  const s = size;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: s * 0.9, fontFamily: 'Inter_700Bold', color: '#4285F4', lineHeight: s }}>G</Text>
    </View>
  );
}

/* ─── Google sign-in button ─────────────────────────────────────── */
function GoogleButton({ onPress, loading, colors: c }: { onPress: () => void; loading: boolean; colors: ReturnType<typeof useColors> }) {
  const scale = useRef(new Animated.Value(1)).current;
  const nativeDriver = Platform.OS !== 'web';

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: nativeDriver, speed: 50, bounciness: 0 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: nativeDriver, speed: 20, bounciness: 8 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        disabled={loading}
        style={[
          styles.socialBtn,
          {
            backgroundColor: '#FFFFFF',
            borderColor: '#DADCE0',
            borderRadius: c.radius,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#3C4043" />
        ) : (
          <GoogleG size={20} />
        )}
        <Text style={[styles.socialBtnText, { color: '#3C4043', fontFamily: 'Inter_600SemiBold' }]}>
          Continue with Google
        </Text>
        <View style={{ width: 20 }} />
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ─── Screen ─────────────────────────────────────────────────────── */
export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Slide-up animation for the bottom sheet
  const slideY = useRef(new Animated.Value(60)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideY, { toValue: 0, useNativeDriver: Platform.OS !== 'web', bounciness: 6, speed: 14 }),
      Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
  }, []);

  // Warm up the browser on Android for faster OAuth
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    WebBrowser.warmUpAsync();
    return () => { WebBrowser.coolDownAsync(); };
  }, []);

  const { startSSOFlow } = useSSO();

  const handleGoogle = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      });
      if (createdSessionId) {
        await setActive!({
          session: createdSessionId,
          navigate: async ({ session, decorateUrl }) => {
            if (session?.currentTask) return;
            router.replace(decorateUrl('/') as any);
          },
        });
      } else {
        setError('Google sign-in could not be completed. Please try again.');
      }
    } catch (err: any) {
      console.error('Google SSO error:', JSON.stringify(err, null, 2));
      setError('Google sign-in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }, [startSSOFlow]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Background blobs ──────────────────────────────────────── */}
      <Blob x={-60}    y={-60}          size={220} color={colors.primary} opacity={0.07} />
      <Blob x={W - 80} y={H * 0.18}     size={160} color="#4285F4"        opacity={0.06} />
      <Blob x={40}     y={H * 0.35}     size={100} color={colors.primary} opacity={0.05} />
      <Blob x={W - 40} y={H * 0.52}     size={130} color="#4285F4"        opacity={0.05} />

      {/* ── Hero section ──────────────────────────────────────────── */}
      <View style={[styles.hero, { paddingTop: insets.top + 32 }]}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <Image
            source={require('@/assets/images/swiftmart-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Headline */}
        <View style={styles.headline}>
          <Text style={[styles.h1, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
            Groceries, delivered{'\n'}
            <Text style={{ color: colors.primary }}>in minutes.</Text>
          </Text>
          <Text style={[styles.subline, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            Sign in to track orders, save{'\n'}addresses, and shop faster.
          </Text>
        </View>

        {/* Feature pills */}
        <View style={styles.pillsRow}>
          {[
            { icon: 'zap',       label: '10-min delivery' },
            { icon: 'shield',    label: 'Secure checkout' },
            { icon: 'star',      label: '4.9★ rated' },
          ].map((p) => (
            <View key={p.label} style={[styles.pill, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
              <Feather name={p.icon as any} size={11} color={colors.primary} />
              <Text style={[styles.pillText, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>
                {p.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Bottom sheet ──────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 24,
            transform: [{ translateY: slideY }],
            opacity: fadeIn,
          },
        ]}
      >
        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

        <Text style={[styles.sheetTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          Get started
        </Text>
        <Text style={[styles.sheetSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          Choose how you'd like to sign in
        </Text>

        {/* Google button */}
        <View style={styles.socials}>
          <GoogleButton onPress={handleGoogle} loading={busy} colors={colors} />
        </View>

        {/* Error message */}
        {error && (
          <View style={[styles.errorBanner, { backgroundColor: '#EF444415', borderColor: '#EF4444', borderRadius: colors.radius }]}>
            <Feather name="alert-circle" size={13} color="#EF4444" />
            <Text style={[styles.errorText, { color: '#EF4444', fontFamily: 'Inter_400Regular' }]}>{error}</Text>
          </View>
        )}

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            or
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Email button */}
        <TouchableOpacity
          style={[styles.emailBtn, { borderColor: colors.border, borderRadius: colors.radius }]}
          onPress={() => router.push('/auth/email')}
          activeOpacity={0.8}
        >
          <Feather name="mail" size={18} color={colors.foreground} />
          <Text style={[styles.emailBtnText, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
            Continue with Email
          </Text>
        </TouchableOpacity>

        {/* Guest */}
        <TouchableOpacity
          style={styles.guestBtn}
          onPress={() => router.replace('/')}
          activeOpacity={0.7}
        >
          <Text style={[styles.guestText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            Browse as guest
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={[styles.terms, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          By continuing you agree to our{' '}
          <Text style={{ color: colors.primary }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: colors.primary }}>Privacy Policy</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  /* Hero */
  hero: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    gap: 20,
  },
  logoRow: { alignItems: 'flex-start' },
  logo: { width: 140, height: 52 },
  headline: { gap: 10 },
  h1: { fontSize: 34, lineHeight: 42 },
  subline: { fontSize: 15, lineHeight: 22 },
  pillsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: { fontSize: 11 },

  /* Sheet */
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 0,
    ...Platform.select({
      web: { boxShadow: '0px -8px 32px rgba(0,0,0,0.35)' },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: -6 },
        elevation: 16,
      },
    }),
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 18,
  },
  sheetTitle: { fontSize: 22, textAlign: 'center' },
  sheetSub: { fontSize: 14, textAlign: 'center', marginTop: 4, marginBottom: 20 },

  /* Social */
  socials: { gap: 12 },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1.5,
    gap: 10,
    ...Platform.select({
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.15)' },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      },
    }),
  },
  socialBtnText: { fontSize: 15 },

  /* Error */
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderWidth: 1,
    marginTop: 10,
  },
  errorText: { fontSize: 13, flex: 1 },

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13 },

  /* Email */
  emailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1.5,
    gap: 10,
  },
  emailBtnText: { fontSize: 15 },

  /* Guest */
  guestBtn: { alignItems: 'center', paddingVertical: 12 },
  guestText: { fontSize: 14 },

  /* Terms */
  terms: { fontSize: 11.5, textAlign: 'center', lineHeight: 17, marginTop: 4 },
});
