import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';

const ORDER_ID = `ORD-${1025 + Math.floor(Math.random() * 10)}`;

export default function SuccessScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  // Only animate the icon — everything else is always visible
  const scale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: false,
      bounciness: 14,
    }).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 },
        ]}
      >
        {/* Animated checkmark */}
        <Animated.View style={{ transform: [{ scale }] }}>
          <View style={[styles.iconRing, { borderColor: '#4CAF5055' }]}>
            <View style={[styles.iconCircle, { backgroundColor: '#4CAF5022' }]}>
              <Feather name="check" size={48} color="#4CAF50" />
            </View>
          </View>
        </Animated.View>

        {/* Headline */}
        <View style={styles.textBlock}>
          <Text
            style={[
              styles.headline,
              { color: colors.foreground, fontFamily: 'Inter_700Bold' },
            ]}
          >
            Order Placed! 🎉
          </Text>
          <Text
            style={[
              styles.subline,
              { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' },
            ]}
          >
            Your order is confirmed and is being prepared.
          </Text>
        </View>

        {/* Order ID */}
        <View
          style={[
            styles.orderIdCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text
            style={[
              styles.orderIdLabel,
              { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' },
            ]}
          >
            Order ID
          </Text>
          <Text
            style={[
              styles.orderIdValue,
              { color: colors.primary, fontFamily: 'Inter_700Bold' },
            ]}
          >
            {ORDER_ID}
          </Text>
        </View>

        {/* ETA */}
        <View
          style={[
            styles.etaRow,
            {
              backgroundColor: '#4CAF5014',
              borderColor: '#4CAF5033',
              borderRadius: colors.radius,
            },
          ]}
        >
          <Feather name="clock" size={15} color="#4CAF50" />
          <Text
            style={[
              styles.etaText,
              { color: colors.foreground, fontFamily: 'Inter_500Medium' },
            ]}
          >
            Estimated delivery:{' '}
            <Text style={{ fontFamily: 'Inter_700Bold' }}>20–35 min</Text>
          </Text>
        </View>

        {/* Step tracker */}
        <View style={styles.stepsRow}>
          {(['Order Placed', 'Processing', 'On the way', 'Delivered'] as const).map(
            (step, i) => (
              <View key={step} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor:
                        i === 0 ? colors.primary : colors.border,
                    },
                  ]}
                >
                  {i === 0 && (
                    <Feather
                      name="check"
                      size={8}
                      color={colors.primaryForeground ?? '#07111F'}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    {
                      color: i === 0 ? colors.primary : colors.mutedForeground,
                      fontFamily:
                        i === 0 ? 'Inter_600SemiBold' : 'Inter_400Regular',
                    },
                  ]}
                  numberOfLines={2}
                >
                  {step}
                </Text>
                {i < 3 && (
                  <View
                    style={[
                      styles.stepLine,
                      {
                        backgroundColor:
                          i === 0 ? colors.primary + '55' : colors.border,
                      },
                    ]}
                  />
                )}
              </View>
            )
          )}
        </View>

        {/* CTAs */}
        <View style={styles.ctaBlock}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.replace('/(tabs)/orders')}
            style={[
              styles.primaryBtn,
              { backgroundColor: colors.primary, borderRadius: colors.radius },
            ]}
          >
            <Feather
              name="truck"
              size={18}
              color={colors.primaryForeground ?? '#07111F'}
            />
            <Text
              style={[
                styles.primaryBtnText,
                {
                  color: colors.primaryForeground ?? '#07111F',
                  fontFamily: 'Inter_700Bold',
                },
              ]}
            >
              Track My Order
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.replace('/')}
            style={[
              styles.secondaryBtn,
              { borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            <Text
              style={[
                styles.secondaryBtnText,
                { color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
              ]}
            >
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },

  iconRing: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textBlock: { alignItems: 'center', gap: 8 },
  headline: { fontSize: 26, textAlign: 'center' },
  subline: { fontSize: 14, textAlign: 'center', lineHeight: 22 },

  orderIdCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 14,
    borderWidth: 1,
  },
  orderIdLabel: { fontSize: 13 },
  orderIdValue: { fontSize: 16, letterSpacing: 0.5 },

  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: 12,
    borderWidth: 1,
  },
  etaText: { fontSize: 13 },

  stepsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
  },
  stepItem: { alignItems: 'center', flex: 1, position: 'relative' },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepLabel: { fontSize: 10, textAlign: 'center', lineHeight: 13 },
  stepLine: {
    position: 'absolute',
    top: 10,
    left: '50%',
    width: '100%',
    height: 2,
  },

  ctaBlock: { width: '100%', gap: 12 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
  },
  primaryBtnText: { fontSize: 16 },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
  },
  secondaryBtnText: { fontSize: 15 },
});
