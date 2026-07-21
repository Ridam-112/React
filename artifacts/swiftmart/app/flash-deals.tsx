import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';
import { FLASH_DEALS, Product } from '@/constants/data';
import { useEffect, useState } from 'react';

const { width: SCREEN_W } = Dimensions.get('window');
const H_PAD = 16;
const COL_GAP = 12;
const CARD_W = Math.floor((SCREEN_W - H_PAD * 2 - COL_GAP) / 2);

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

function TimeBlock({ value }: { value: string }) {
  const colors = useColors();
  return (
    <View style={[styles.timeBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.timeText, { color: colors.primary, fontFamily: 'Inter_700Bold' }]}>
        {value}
      </Text>
    </View>
  );
}

export default function FlashDealsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();
  const [hh, mm, ss] = useCountdown(2 * 3600 + 14 * 60 + 37);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, []);

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <View style={[styles.cellWrapper, index % 2 === 0 ? styles.cellLeft : styles.cellRight]}>
      <ProductCard product={item} cardWidth={CARD_W} />
    </View>
  );

  const ListHeader = (
    <View style={[styles.banner, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30', borderRadius: colors.radius }]}>
      <View style={styles.bannerTop}>
        <View style={[styles.flashIcon, { backgroundColor: colors.primary + '20' }]}>
          <MaterialCommunityIcons name="lightning-bolt" size={18} color={colors.primary} />
        </View>
        <Text style={[styles.bannerTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          Flash Deals
        </Text>
      </View>
      <View style={styles.countdownRow}>
        <Text style={[styles.endsIn, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          Ends in
        </Text>
        <TimeBlock value={hh} />
        <Text style={[styles.colon, { color: colors.primary, fontFamily: 'Inter_700Bold' }]}>:</Text>
        <TimeBlock value={mm} />
        <Text style={[styles.colon, { color: colors.primary, fontFamily: 'Inter_700Bold' }]}>:</Text>
        <TimeBlock value={ss} />
      </View>
      <Text style={[styles.bannerSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
        {FLASH_DEALS.length} limited-time deals · Grab them before they expire
      </Text>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          Flash Deals
        </Text>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ position: 'relative' }}>
          <Feather name="shopping-cart" size={22} color={colors.foreground} />
          {itemCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.primaryForeground }]}>
                {itemCount > 9 ? '9+' : itemCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={FLASH_DEALS}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 32 }]}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PAD,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 20 },
  badge: {
    position: 'absolute', top: -6, right: -6,
    width: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 9, fontFamily: 'Inter_700Bold' },

  banner: {
    margin: H_PAD,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  bannerTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flashIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  bannerTitle: { fontSize: 20 },
  countdownRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  endsIn: { fontSize: 13, marginRight: 2 },
  timeBox: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6, borderWidth: 1, minWidth: 34, alignItems: 'center' },
  timeText: { fontSize: 14 },
  colon: { fontSize: 15 },
  bannerSub: { fontSize: 12 },

  grid: { paddingHorizontal: H_PAD },
  columnWrapper: { gap: COL_GAP, marginBottom: COL_GAP },
  cellWrapper: { flex: 1 },
  cellLeft: {},
  cellRight: {},
});
