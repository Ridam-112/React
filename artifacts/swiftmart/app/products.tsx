import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCTS, FLASH_DEALS, Product } from '@/constants/data';

/* ─── Data ───────────────────────────────────────────────────────── */
// All unique products: regular + flash deals merged
const ALL_PRODUCTS: Product[] = [...PRODUCTS, ...FLASH_DEALS];

// Unique category names from all products
const CATEGORY_FILTERS = [
  'All',
  ...Array.from(
    new Set(ALL_PRODUCTS.map((p) => p.category).filter(Boolean) as string[])
  ).sort(),
];

/* ─── Layout constants ────────────────────────────────────────────── */
const { width: SCREEN_W } = Dimensions.get('window');
const H_PAD = 16;
const COL_GAP = 12;
const CARD_W = Math.floor((SCREEN_W - H_PAD * 2 - COL_GAP) / 2);

/* ─── Sort options ────────────────────────────────────────────────── */
type SortKey = 'default' | 'price_asc' | 'price_desc' | 'discount';
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'default',     label: 'Default'    },
  { key: 'price_asc',  label: 'Price ↑'    },
  { key: 'price_desc', label: 'Price ↓'    },
  { key: 'discount',   label: 'Discount'   },
];

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products];
  switch (sort) {
    case 'price_asc':  return copy.sort((a, b) => a.discountedPrice - b.discountedPrice);
    case 'price_desc': return copy.sort((a, b) => b.discountedPrice - a.discountedPrice);
    case 'discount':   return copy.sort((a, b) => b.discount - a.discount);
    default:           return copy;
  }
}

/* ─── Screen ─────────────────────────────────────────────────────── */
export default function ProductsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();

  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('All');
  const [sort, setSort]           = useState<SortKey>('default');
  const [sortOpen, setSortOpen]   = useState(false);

  // Subtle fade-in on mount
  const fadeAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim]);

  // Filtered + sorted product list
  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS;
    if (category !== 'All') {
      list = list.filter((p) => p.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return sortProducts(list, sort);
  }, [search, category, sort]);

  const renderProduct = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <View style={[styles.cellWrapper, index % 2 === 0 ? styles.cellLeft : styles.cellRight]}>
        <ProductCard product={item} cardWidth={CARD_W} />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  const activeSort = SORT_OPTIONS.find((o) => o.key === sort)!;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          All Products
        </Text>

        <TouchableOpacity
          style={styles.cartBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
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

      {/* ── Search bar ──────────────────────────────────────────────── */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.muted,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
          placeholder="Search products…"
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Feather name="x-circle" size={15} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Category chips + Sort ────────────────────────────────────── */}
      <View style={styles.filterRow}>
        <FlatList
          data={CATEGORY_FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.chipsContainer}
          renderItem={({ item }) => {
            const active = item === category;
            return (
              <TouchableOpacity
                onPress={() => setCategory(item)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.primary : colors.muted,
                    borderColor: active ? colors.primary : colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: active ? colors.primaryForeground : colors.mutedForeground,
                      fontFamily: active ? 'Inter_600SemiBold' : 'Inter_400Regular',
                    },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Sort button */}
        <TouchableOpacity
          style={[styles.sortBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
          onPress={() => setSortOpen((v) => !v)}
          activeOpacity={0.8}
        >
          <Feather name="sliders" size={13} color={colors.primary} />
          <Text style={[styles.sortLabel, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>
            {activeSort.label}
          </Text>
          <Feather name={sortOpen ? 'chevron-up' : 'chevron-down'} size={13} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      {/* ── Sort dropdown ────────────────────────────────────────────── */}
      {sortOpen && (
        <View
          style={[
            styles.sortDropdown,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
              ...Platform.select({
                web: { boxShadow: '0px 8px 24px rgba(0,0,0,0.40)' },
                default: {
                  shadowColor: '#000',
                  shadowOpacity: 0.35,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 10,
                },
              }),
            },
          ]}
        >
          {SORT_OPTIONS.map((opt) => {
            const active = opt.key === sort;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.sortOption,
                  active && { backgroundColor: colors.primary + '18' },
                ]}
                onPress={() => { setSort(opt.key); setSortOpen(false); }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    {
                      color: active ? colors.primary : colors.foreground,
                      fontFamily: active ? 'Inter_600SemiBold' : 'Inter_400Regular',
                    },
                  ]}
                >
                  {opt.label}
                </Text>
                {active && <Feather name="check" size={14} color={colors.primary} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ── Results count ─────────────────────────────────────────────── */}
      <View style={styles.countRow}>
        <Text style={[styles.countText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* ── Product grid ──────────────────────────────────────────────── */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={keyExtractor}
          renderItem={renderProduct}
          contentContainerStyle={[
            styles.gridContent,
            { paddingBottom: 100 + (insets.bottom > 0 ? insets.bottom : 0) },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="package" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
                No products found
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                Try a different search or category
              </Text>
            </View>
          }
          columnWrapperStyle={styles.columnWrapper}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PAD,
    paddingBottom: 12,
  },
  backBtn: { marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 20 },
  cartBtn: { position: 'relative', marginLeft: 12 },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 9, fontFamily: 'Inter_700Bold' },

  /* Search */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: H_PAD,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },

  /* Filters */
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  chipsContainer: {
    paddingLeft: H_PAD,
    paddingRight: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
  },
  chipText: { fontSize: 12 },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 10,
    marginRight: H_PAD,
  },
  sortLabel: { fontSize: 12 },

  /* Sort dropdown */
  sortDropdown: {
    position: 'absolute',
    right: H_PAD,
    top: 170, // approx below the filter row
    zIndex: 999,
    borderWidth: 1,
    overflow: 'hidden',
    minWidth: 140,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  sortOptionText: { fontSize: 14 },

  /* Count */
  countRow: {
    paddingHorizontal: H_PAD,
    paddingTop: 10,
    paddingBottom: 6,
  },
  countText: { fontSize: 12 },

  /* Grid */
  gridContent: {
    paddingHorizontal: H_PAD,
    paddingTop: 4,
  },
  columnWrapper: {
    gap: COL_GAP,
    marginBottom: COL_GAP,
  },
  cellWrapper: { flex: 1 },
  cellLeft:  {},
  cellRight: {},

  /* Empty */
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle:    { fontSize: 18, marginTop: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
});
