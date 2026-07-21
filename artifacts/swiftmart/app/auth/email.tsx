import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Animated,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

type Mode = 'signin' | 'signup';

function validate(mode: Mode, name: string, email: string, password: string) {
  const errs: Record<string, string> = {};
  if (mode === 'signup' && !name.trim()) errs.name = 'Name is required';
  if (!email.trim()) {
    errs.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errs.email = 'Enter a valid email';
  }
  if (!password) {
    errs.password = 'Password is required';
  } else if (password.length < 6) {
    errs.password = 'At least 6 characters';
  }
  return errs;
}

/* ─── Animated input field ───────────────────────────────────────── */
function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureEntry,
  error,
  keyboardType,
  autoCapitalize,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  secureEntry?: boolean;
  error?: string;
  keyboardType?: 'email-address' | 'default';
  autoCapitalize?: 'none' | 'words';
  colors: ReturnType<typeof useColors>;
}) {
  const [secure, setSecure] = useState(secureEntry ?? false);
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, { toValue: 1, duration: 180, useNativeDriver: false }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? '#EF4444' : colors.border, error ? '#EF4444' : colors.primary],
  });

  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.label, { color: focused ? colors.primary : colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
        {label}
      </Text>
      <Animated.View style={[styles.inputBox, { backgroundColor: colors.muted, borderColor, borderRadius: colors.radius - 2 }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground + '88'}
          secureTextEntry={secure}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'none'}
          autoCorrect={false}
          onFocus={onFocus}
          onBlur={onBlur}
          style={[styles.input, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
        />
        {secureEntry && (
          <TouchableOpacity onPress={() => setSecure((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name={secure ? 'eye-off' : 'eye'} size={17} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error ? (
        <Text style={[styles.errorText, { color: '#EF4444', fontFamily: 'Inter_400Regular' }]}>{error}</Text>
      ) : null}
    </View>
  );
}

/* ─── Screen ─────────────────────────────────────────────────────── */
export default function EmailAuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);

  // Slide animation when toggling between sign-in / sign-up
  const slideAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(slideAnim, { toValue: mode === 'signup' ? 1 : 0, useNativeDriver: false, bounciness: 0, speed: 18 }).start();
  }, [mode]);

  const nameHeight = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 80] });
  const nameOpacity = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  const handleSubmit = async () => {
    const errs = validate(mode, name, email, password);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(name, email, password);
      }
      router.replace('/onboarding');
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="arrow-left" size={19} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 60}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Mode toggle tabs */}
          <View style={[styles.tabs, { backgroundColor: colors.muted, borderColor: colors.border, borderRadius: colors.radius }]}>
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => { setMode(m); setErrors({}); }}
                style={[
                  styles.tab,
                  m === mode && { backgroundColor: colors.primary, borderRadius: colors.radius - 2 },
                ]}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.tabText,
                  {
                    color: m === mode ? colors.primaryForeground : colors.mutedForeground,
                    fontFamily: m === mode ? 'Inter_600SemiBold' : 'Inter_400Regular',
                  },
                ]}>
                  {m === 'signin' ? 'Sign In' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Welcome text */}
          <View style={styles.welcome}>
            <Text style={[styles.welcomeTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
              {mode === 'signin' ? 'Welcome back 👋' : 'Join SwiftMart 🚀'}
            </Text>
            <Text style={[styles.welcomeSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              {mode === 'signin'
                ? 'Enter your details to access your account'
                : 'Create an account to start ordering'}
            </Text>
          </View>

          {/* Name field (sign-up only) */}
          <Animated.View style={{ height: nameHeight, opacity: nameOpacity, overflow: 'hidden' }}>
            <InputField
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Ridam Kumar"
              autoCapitalize="words"
              error={errors.name}
              colors={colors}
            />
          </Animated.View>

          {/* Email field */}
          <InputField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            error={errors.email}
            colors={colors}
          />

          {/* Password field */}
          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Min. 6 characters"
            secureEntry
            error={errors.password}
            colors={colors}
          />

          {/* Forgot password */}
          {mode === 'signin' && (
            <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
              <Text style={[styles.forgotText, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          )}

          {/* Submit error */}
          {errors.submit && (
            <View style={[styles.submitError, { backgroundColor: '#EF444418', borderColor: '#EF4444', borderRadius: colors.radius }]}>
              <Feather name="alert-circle" size={14} color="#EF4444" />
              <Text style={[styles.submitErrorText, { color: '#EF4444', fontFamily: 'Inter_400Regular' }]}>
                {errors.submit}
              </Text>
            </View>
          )}

          {/* CTA button */}
          <TouchableOpacity
            style={[styles.cta, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
            onPress={handleSubmit}
            activeOpacity={0.88}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <>
                <Text style={[styles.ctaText, { color: colors.primaryForeground, fontFamily: 'Inter_700Bold' }]}>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </Text>
                <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
              </>
            )}
          </TouchableOpacity>

          {/* Switch mode */}
          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setErrors({}); }}>
              <Text style={[styles.switchLink, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Security note */}
          <View style={styles.secureRow}>
            <Feather name="lock" size={12} color={colors.mutedForeground} />
            <Text style={[styles.secureText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              256-bit SSL encrypted · Your data is safe
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17 },

  /* Content */
  scroll: { paddingHorizontal: 24, paddingTop: 8, gap: 16 },

  /* Mode tabs */
  tabs: {
    flexDirection: 'row',
    padding: 4,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: { fontSize: 14 },

  /* Welcome */
  welcome: { gap: 4 },
  welcomeTitle: { fontSize: 24 },
  welcomeSub: { fontSize: 14, lineHeight: 20 },

  /* Fields */
  fieldWrap: { gap: 6 },
  label: { fontSize: 13 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, padding: 0 },
  errorText: { fontSize: 12 },

  /* Forgot */
  forgotRow: { alignItems: 'flex-end' },
  forgotText: { fontSize: 13 },

  /* Submit error */
  submitError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
  },
  submitErrorText: { fontSize: 13, flex: 1 },

  /* CTA */
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    marginTop: 4,
    ...Platform.select({
      web: { boxShadow: '0px 6px 20px rgba(255, 193, 7, 0.35)' },
      default: {
        shadowColor: '#FFC107',
        shadowOpacity: 0.4,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
      },
    }),
  },
  ctaText: { fontSize: 16 },

  /* Switch */
  switchRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' },
  switchText: { fontSize: 14 },
  switchLink: { fontSize: 14 },

  /* Secure */
  secureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  secureText: { fontSize: 11.5 },
});
