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
import { useAuth, needsOnboarding } from '@/context/AuthContext';
import { useAddresses } from '@/context/AddressContext';

/* ─── Reusable animated input ────────────────────────────────────── */
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  error,
  icon,
  multiline,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad';
  autoCapitalize?: 'none' | 'words' | 'sentences';
  error?: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  multiline?: boolean;
  colors: ReturnType<typeof useColors>;
}) {
  const [focused, setFocused] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const focus = () => {
    setFocused(true);
    Animated.timing(anim, { toValue: 1, duration: 160, useNativeDriver: false }).start();
  };
  const blur = () => {
    setFocused(false);
    Animated.timing(anim, { toValue: 0, duration: 160, useNativeDriver: false }).start();
  };

  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? '#EF4444' : colors.border, error ? '#EF4444' : colors.primary],
  });

  return (
    <View style={fieldStyles.wrap}>
      <Text style={[fieldStyles.label, { color: focused ? colors.primary : colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
        {label} <Text style={{ color: '#EF4444' }}>*</Text>
      </Text>
      <Animated.View
        style={[
          fieldStyles.box,
          {
            backgroundColor: colors.muted,
            borderColor,
            borderRadius: colors.radius - 2,
          },
          multiline && { alignItems: 'flex-start', paddingVertical: 12 },
        ]}
      >
        <Feather
          name={icon}
          size={17}
          color={focused ? colors.primary : colors.mutedForeground}
          style={multiline ? { marginTop: 2 } : undefined}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground + '88'}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          autoCorrect={false}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          onFocus={focus}
          onBlur={blur}
          style={[
            fieldStyles.input,
            { color: colors.foreground, fontFamily: 'Inter_400Regular' },
            multiline && { height: 72, textAlignVertical: 'top' },
          ]}
        />
      </Animated.View>
      {error ? (
        <Text style={[fieldStyles.err, { color: '#EF4444', fontFamily: 'Inter_400Regular' }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 13 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, padding: 0 },
  err: { fontSize: 12 },
});

/* ─── Screen ─────────────────────────────────────────────────────── */
export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, completeProfile } = useAuth();
  const { addAddress } = useAddresses();

  // Pre-fill name from what auth provided
  const [name, setName]       = useState(user?.name ?? '');
  const [phone, setPhone]     = useState(user?.phone ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isTruecaller = user?.provider === 'truecaller';

  // If for some reason this screen is shown to a user whose profile is already
  // complete (e.g. navigating back), redirect them to home immediately.
  useEffect(() => {
    if (user && !needsOnboarding(user)) {
      router.replace('/');
    }
  }, [user]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!isTruecaller && !phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!isTruecaller && !/^\+?[\d\s\-()]{7,15}$/.test(phone.trim())) {
      errs.phone = 'Enter a valid phone number';
    }
    if (!address.trim()) errs.address = 'Delivery address is required';
    else if (address.trim().length < 10) errs.address = 'Please enter your full address';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const resolvedPhone = isTruecaller ? (user?.phone ?? '') : phone.trim();
      await completeProfile({
        name: name.trim(),
        phone: resolvedPhone,
        address: address.trim(),
      });
      // Save address to the user's saved-addresses list as the default entry
      await addAddress({
        tag: 'Home',
        name: name.trim(),
        line: address.trim(),
        city: '',
        pincode: '',
        phone: resolvedPhone,
        isDefault: true,
      });
      router.replace('/');
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 60}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}
        >
          {/* ── Icon + heading ────────────────────────────────────── */}
          <View style={styles.hero}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
              <Feather name="user-check" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
              One last step!
            </Text>
            <Text style={[styles.sub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              {isTruecaller
                ? "We already have your number. Just tell us where to deliver."
                : 'Tell us a bit about yourself so we can deliver to you.'}
            </Text>
          </View>

          {/* ── Progress dots ─────────────────────────────────────── */}
          <View style={styles.dots}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === 2
                    ? { backgroundColor: colors.primary, width: 24 }
                    : { backgroundColor: colors.border },
                ]}
              />
            ))}
          </View>

          {/* ── Fields ───────────────────────────────────────────── */}
          <View style={styles.fields}>
            {/* Name — shown for all providers */}
            <Field
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              autoCapitalize="words"
              icon="user"
              error={errors.name}
              colors={colors}
            />

            {/* Phone — hidden for Truecaller (already captured) */}
            {!isTruecaller && (
              <Field
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 98765 43210"
                keyboardType="phone-pad"
                autoCapitalize="none"
                icon="phone"
                error={errors.phone}
                colors={colors}
              />
            )}

            {/* Truecaller: show the captured number as read-only info */}
            {isTruecaller && user?.phone && (
              <View style={styles.readOnlyRow}>
                <View style={[styles.readOnlyBox, { backgroundColor: colors.muted, borderColor: colors.border, borderRadius: colors.radius - 2 }]}>
                  <Feather name="phone" size={17} color={colors.primary} />
                  <Text style={[styles.readOnlyValue, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>
                    {user.phone}
                  </Text>
                  <View style={[styles.verifiedBadge, { backgroundColor: '#4CAF5022', borderColor: '#4CAF5040' }]}>
                    <Feather name="check-circle" size={11} color="#4CAF50" />
                    <Text style={[styles.verifiedText, { color: '#4CAF50', fontFamily: 'Inter_600SemiBold' }]}>
                      Verified
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Address — always shown */}
            <Field
              label="Delivery Address"
              value={address}
              onChangeText={setAddress}
              placeholder="House / flat no., street, area, city, pincode"
              autoCapitalize="sentences"
              icon="map-pin"
              multiline
              error={errors.address}
              colors={colors}
            />
          </View>

          {/* ── Submit error ─────────────────────────────────────── */}
          {errors.submit && (
            <View style={[styles.submitErr, { backgroundColor: '#EF444418', borderColor: '#EF4444', borderRadius: colors.radius }]}>
              <Feather name="alert-circle" size={14} color="#EF4444" />
              <Text style={[styles.submitErrText, { color: '#EF4444', fontFamily: 'Inter_400Regular' }]}>
                {errors.submit}
              </Text>
            </View>
          )}

          {/* ── CTA ──────────────────────────────────────────────── */}
          <TouchableOpacity
            style={[
              styles.cta,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
                opacity: loading ? 0.85 : 1,
              },
            ]}
            onPress={handleSubmit}
            activeOpacity={0.88}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <>
                <Text style={[styles.ctaText, { color: colors.primaryForeground, fontFamily: 'Inter_700Bold' }]}>
                  Save & Continue
                </Text>
                <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
              </>
            )}
          </TouchableOpacity>

          <Text style={[styles.note, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            <Feather name="lock" size={11} color={colors.mutedForeground} /> Your information is stored securely and only used for delivery.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 24, gap: 24 },

  hero: { alignItems: 'center', gap: 10 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 26, textAlign: 'center' },
  sub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },

  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  dot: { height: 6, borderRadius: 3 },

  fields: { gap: 18 },

  readOnlyRow: { gap: 6 },
  readOnlyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  readOnlyValue: { flex: 1, fontSize: 15 },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  verifiedText: { fontSize: 11 },

  submitErr: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
  },
  submitErrText: { fontSize: 13, flex: 1 },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
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

  note: { fontSize: 11.5, textAlign: 'center', lineHeight: 17 },
});
