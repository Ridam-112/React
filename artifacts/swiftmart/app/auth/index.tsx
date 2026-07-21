import React, { useRef, useEffect, useState } from 'react';
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

const { width: W, height: H } = Dimensions.get('window');

/* ─── Brand colours ──────────────────────────────────────────────── */
const BRAND = {
  google:      { bg: '#FFFFFF', text: '#3C4043', border: '#DADCE0', icon: 'google'      },
  truecaller:  { bg: '#0066FF', text: '#FFFFFF', border: '#0066FF', icon: 'phone'       },
  facebook:    { bg: '#1877F2', text: '#FFFFFF', border: '#1877F2', icon: 'facebook'    },
};

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

/* ─── Social button ──────────────────────────────────────────────── */
type SocialBtnProps = {
  provider: keyof typeof BRAND;
  label: string;
  onPress: () => void;
  loading?: boolean;
  colors: ReturnType<typeof useColors>;
};

function SocialButton({ provider, label, onPress, loading, colors: c }: SocialBtnProps) {
  const brand = BRAND[provider];
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
            backgroundColor: brand.bg,
            borderColor: provider === 'google' ? brand.border : brand.bg,
            borderRadius: c.radius,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={brand.text} />
        ) : provider === 'google' ? (
          <GoogleG size={20} />
        ) : (
          <MaterialCommunityIcons
            name={brand.icon as any}
            size={20}
            color={brand.text}
          />
        )}
        <Text style={[styles.socialBtnText, { color: brand.text, fontFamily: 'Inter_600SemiBold' }]}>
          {label}
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
  const { signInWithGoogle, signInWithFacebook, signInWithTruecaller } = useAuth();

  const [busy, setBusy] = useState<'google' | 'truecaller' | 'facebook' | null>(null);

  // Slide-up animation for the bottom sheet
  const slideY = useRef(new Animated.Value(60)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideY, { toValue: 0, useNativeDriver: Platform.OS !== 'web', bounciness: 6, speed: 14 }),
      Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
  }, []);

  const handle = async (provider: 'google' | 'truecaller' | 'facebook', fn: () => Promise<void>) => {
    setBusy(provider);
    try {
      await fn();
      router.replace('/onboarding');
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Background blobs ──────────────────────────────────────── */}
      <Blob x={-60}    y={-60}          size={220} color={colors.primary} opacity={0.07} />
      <Blob x={W - 80} y={H * 0.18}     size={160} color="#4285F4"        opacity={0.06} />
      <Blob x={40}     y={H * 0.35}     size={100} color={colors.primary} opacity={0.05} />
      <Blob x={W - 40} y={H * 0.52}     size={130} color="#1877F2"        opacity={0.05} />

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

        {/* Social buttons */}
        <View style={styles.socials}>
          <SocialButton
            provider="google"
            label="Continue with Google"
            onPress={() => handle('google', signInWithGoogle)}
            loading={busy === 'google'}
            colors={colors}
          />
          <SocialButton
            provider="truecaller"
            label="Continue with Truecaller"
            onPress={() => handle('truecaller', signInWithTruecaller)}
            loading={busy === 'truecaller'}
            colors={colors}
          />
          <SocialButton
            provider="facebook"
            label="Continue with Facebook"
            onPress={() => handle('facebook', signInWithFacebook)}
            loading={busy === 'facebook'}
            colors={colors}
          />
        </View>

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
