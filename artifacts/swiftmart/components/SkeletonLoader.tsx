import React, { useEffect, useRef } from 'react';
import { Animated, Platform, View, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useColors';

/* ─── Base shimmer box ────────────────────────────────────────────── */
type BoxProps = {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: object;
};

export function SkeletonBox({ width, height, borderRadius = 8, style }: BoxProps) {
  const colors = useColors();
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.9,
          duration: 750,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: colors.border, opacity: pulse },
        style,
      ]}
    />
  );
}

/* ─── Product card skeleton ───────────────────────────────────────── */
export function ProductCardSkeleton() {
  const colors = useColors();
  return (
    <View
      style={[
        styles.productCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <SkeletonBox width="100%" height={110} borderRadius={0} />
      <View style={styles.productBody}>
        <SkeletonBox width="78%" height={12} />
        <SkeletonBox width="45%" height={10} />
        <SkeletonBox width="55%" height={14} style={{ marginTop: 2 }} />
        <SkeletonBox width="100%" height={34} borderRadius={10} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

/* ─── Shop card skeleton ──────────────────────────────────────────── */
export function ShopCardSkeleton() {
  const colors = useColors();
  return (
    <View
      style={[
        styles.shopCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <SkeletonBox width="100%" height={100} borderRadius={0} />
      <View style={styles.shopBody}>
        <SkeletonBox width="65%" height={12} />
        <SkeletonBox width="45%" height={10} />
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
          <SkeletonBox width={52} height={22} borderRadius={20} />
          <SkeletonBox width={66} height={22} borderRadius={20} />
        </View>
      </View>
    </View>
  );
}

/* ─── Banner skeleton ─────────────────────────────────────────────── */
export function BannerSkeleton() {
  const colors = useColors();
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
      <SkeletonBox width="100%" height={175} borderRadius={14} />
    </View>
  );
}

/* ─── Flash deal card skeleton ────────────────────────────────────── */
export function FlashDealSkeleton() {
  const colors = useColors();
  return (
    <View
      style={[
        styles.productCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <SkeletonBox width="100%" height={110} borderRadius={0} />
      <View style={styles.productBody}>
        <SkeletonBox width="78%" height={12} />
        <SkeletonBox width="45%" height={10} />
        <SkeletonBox width="55%" height={14} style={{ marginTop: 2 }} />
        <SkeletonBox width="100%" height={34} borderRadius={10} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    width: 152,
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
    paddingBottom: 12,
  },
  productBody: { padding: 10, gap: 5 },
  shopCard: {
    width: 155,
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  shopBody: { padding: 10, gap: 5 },
});
