import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { ProductCard } from '@/components/ProductCard';
import { FlashDealSkeleton } from '@/components/SkeletonLoader';
import { FLASH_DEALS } from '@/constants/data';

/* ─── Countdown hook ──────────────────────────────────────────────── */
function useCountdown(initialSeconds: number) {
  const [secs, setSecs] = useState(initialSeconds);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(Math.floor(secs / 3600)).padStart(2, '0');
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return [hh, mm, ss];
}

type TimeBlockProps = { value: string };
function TimeBlock({ value }: TimeBlockProps) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.timeBox,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text
        style={[
          styles.timeText,
          { color: colors.primary, fontFamily: 'Inter_700Bold' },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

type Props = { loading?: boolean };

export function FlashDeals({ loading = false }: Props) {
  const colors = useColors();
  const [hh, mm, ss] = useCountdown(2 * 3600 + 14 * 60 + 37);

  return (
    <View style={styles.wrapper}>
      {/* ── Header ── */}
      <View style={styles.header}>
        {/* Left: title */}
        <View style={styles.titleRow}>
          <View
            style={[
              styles.flashIcon,
              { backgroundColor: colors.primary + '20' },
            ]}
          >
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={16}
              color={colors.primary}
            />
          </View>
          <Text
            style={[
              styles.title,
              { color: colors.foreground, fontFamily: 'Inter_700Bold' },
            ]}
          >
            Flash Deals
          </Text>
        </View>

        {/* Right: countdown + see all */}
        <View style={styles.rightRow}>
          <View style={styles.countdownRow}>
            <Text
              style={[
                styles.endsIn,
                {
                  color: colors.mutedForeground,
                  fontFamily: 'Inter_400Regular',
                },
              ]}
            >
              Ends in
            </Text>
            <TimeBlock value={hh} />
            <Text
              style={[
                styles.colon,
                { color: colors.primary, fontFamily: 'Inter_700Bold' },
              ]}
            >
              :
            </Text>
            <TimeBlock value={mm} />
            <Text
              style={[
                styles.colon,
                { color: colors.primary, fontFamily: 'Inter_700Bold' },
              ]}
            >
              :
            </Text>
            <TimeBlock value={ss} />
          </View>
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text
              style={[
                styles.seeAll,
                { color: colors.primary, fontFamily: 'Inter_500Medium' },
              ]}
            >
              See All
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Products ── */}
      {loading ? (
        <View style={styles.skeletonRow}>
          {[0, 1, 2].map((i) => (
            <FlashDealSkeleton key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={FLASH_DEALS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 4 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flashIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 18 },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  endsIn: { fontSize: 12, marginRight: 4 },
  timeBox: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 32,
    alignItems: 'center',
  },
  timeText: { fontSize: 13 },
  colon: { fontSize: 14 },
  seeAll: { fontSize: 13 },
  skeletonRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
});
