import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';
import { CATEGORIES, PRODUCTS, FLASH_DEALS, SHOPS, Product, Shop } from '@/constants/data';

const { width: SCREEN_W } = Dimensions.get('window');
const H_PAD = 16;
const COL_GAP = 12;
const CARD_W = Math.floor((SCREEN_W - H_PAD * 2 - COL_GAP) / 2);

const ALL_PRODUCTS: Product[] = [...PRODUCTS, ...FLASH_DEALS];

type SortKey = 'default' | 'price_asc' | 'price_desc' | 'discount';
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'default',    label: 'Default'   },
  { key: 'price_asc',  label: 'Price ↑'  },
  { key: 'price_desc', label: 'Price ↓'  },
  { key: 'discount',   label: 'Discount'  },
];

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const copy = [...list];
  switch (sort) {
    case 'price_asc':  return copy.sort((a, b) => a.discountedPrice - b.discountedPrice);
    case 'price_desc': return copy.sort((a, b) => b.discountedPrice - a.discountedPrice);
    case 'discount':   return copy.sort((a, b) => b.discount - a.discount);
    default:           return copy;
  }
}

function ShopRow({ shop, accentColor }: { shop: Shop; accentColor: string }) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[styles.shopCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
      onPress={() => router.push(`/shop/${shop.id}`)}
      activeOpacity={0.85}
    >
      <Image
        source={shop.image}
        style={[styles.shopImage, { borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius }]}
        resizeMode="cover"
      />
      <View style={styles.shopInfo}>
        <Text style={[styles.shopName, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]} numberOfLines={1}>
          {shop.name}
        </Text>
        <View style={styles.shopMeta}>
          <View style={[styles.metaChip, { backgroundColor: '#FFC10720' }]}>
            <MaterialCommunityIcons name="star" size={10} color="#FFC107" />
            <Text style={[styles.metaText, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>
              {shop.rating}
            </Text>
          </View>
          <View style={[styles.metaChip, { backgroundColor: accentColor + '20' }]}>
            <Feather name="clock" size={10} color={accentColor} />
            <Text style={[styles.metaText, { color: accentColor, fontFamily: 'Inter_500Medium' }]}>
              {shop.deliveryTime}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();

  const [sort, setSort] = useState<SortKey>('default');
  const [sortOpen, setSortOpen] = useState(false);

  const category = CATEGORIES.find((c) => c.id === id);

  const products = useMemo(() => {
    if (!category) return [];
    const filtered = ALL_PRODUCTS.filter((p) => p.category === category.name);
    return sortProducts(filtered, sort);
  }, [category, sort]);

  const shops = useMemo(() => {
    if (!category) return [];
    return SHOPS.filter((s) => s.productCategories.includes(category.name));
  }, [category]);

  if (!category) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Feather name="alert-circle" size={48} color={colors.mutedForeground} />
          <Text style={[styles.notFoundText, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
            Category not found
          </Text>
        </View>
      </View>
    );
  }

  const accentColor = category.color;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ── Hero Header ───────────────────────────────────────────── */}
      <View style={[styles.hero, { paddingTop: insets.top + 12, backgroundColor: accentColor + '18', borderBottomColor: accentColor + '30', borderBottomWidth: 1 }]}>
        {/* Back + Cart row */}
        <View style={styles.heroTopRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[styles.iconCircle, { backgroundColor: colors.background + 'CC' }]}
          >
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconCircle, { backgroundColor: colors.background + 'CC' }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="shopping-cart" size={20} color={colors.foreground} />
            {itemCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.badgeText, { color: colors.primaryForeground }]}>
                  {itemCount > 9 ? '9+' : itemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Category identity */}
        <View style={styles.heroContent}>
          <View style={[styles.heroIcon, { backgroundColor: accentColor + '30', borderColor: accentColor + '60' }]}>
            <MaterialCommunityIcons name={category.icon as any} size={38} color={accentColor} />
          </View>
          <View style={styles.heroText}>
            <Text style={[styles.heroName, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
              {category.name}
            </Text>
            <Text style={[styles.heroSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              {category.shops}+ shops · {products.length} product{products.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Stats pills */}
        <View style={styles.statsRow}>
          <View style={[styles.statPill, { backgroundColor: accentColor + '20', borderColor: accentColor + '40' }]}>
            <MaterialCommunityIcons name="store-outline" size={13} color={accentColor} />
            <Text style={[styles.statText, { color: accentColor, fontFamily: 'Inter_600SemiBold' }]}>
              {shops.length} shop{shops.length !== 1 ? 's' : ''} nearby
            </Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: accentColor + '20', borderColor: accentColor + '40' }]}>
            <Feather name="package" size={12} color={accentColor} />
            <Text style={[styles.statText, { color: accentColor, fontFamily: 'Inter_600SemiBold' }]}>
              {products.length} product{products.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>

        {/* Shops section */}
        {shops.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
                Shops
              </Text>
              <TouchableOpacity onPress={() => router.push('/shops')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={[styles.seeAll, { color: accentColor, fontFamily: 'Inter_500Medium' }]}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: H_PAD, gap: 12 }}>
              {shops.map((shop) => (
                <ShopRow key={shop.id} shop={shop} accentColor={accentColor} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Products section */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: H_PAD }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
              Products
            </Text>
            {/* Sort button */}
            <TouchableOpacity
              style={[styles.sortBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setSortOpen((v) => !v)}
              activeOpacity={0.8}
            >
              <Feather name="sliders" size={12} color={accentColor} />
              <Text style={[styles.sortLabel, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>
                {SORT_OPTIONS.find((o) => o.key === sort)?.label}
              </Text>
              <Feather name={sortOpen ? 'chevron-up' : 'chevron-down'} size={12} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {/* Sort dropdown */}
          {sortOpen && (
            <View style={[styles.sortDropdown, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              {SORT_OPTIONS.map((opt) => {
                const active = opt.key === sort;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[styles.sortOption, active && { backgroundColor: accentColor + '18' }]}
                    onPress={() => { setSort(opt.key); setSortOpen(false); }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.sortOptionText, { color: active ? accentColor : colors.foreground, fontFamily: active ? 'Inter_600SemiBold' : 'Inter_400Regular' }]}>
                      {opt.label}
                    </Text>
                    {active && <Feather name="check" size={13} color={accentColor} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {products.length === 0 ? (
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: accentColor + '18' }]}>
                <MaterialCommunityIcons name={category.icon as any} size={40} color={accentColor} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
                No products yet
              </Text>
              <Text style={[styles.emptySub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                Check back soon — new {category.name.toLowerCase()} items are on the way.
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {products.map((item, index) => (
                <View
                  key={item.id}
                  style={[styles.gridCell, index % 2 === 0 ? styles.cellLeft : styles.cellRight]}
                >
                  <ProductCard product={item} cardWidth={CARD_W} />
                </View>
              ))}
              {/* Spacer if odd number */}
              {products.length % 2 !== 0 && <View style={[styles.gridCell, styles.cellRight]} />}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  /* Not found */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PAD,
    paddingBottom: 12,
  },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 18 },

  /* Hero */
  hero: {
    paddingHorizontal: H_PAD,
    paddingBottom: 16,
    gap: 12,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 15,
    height: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 9, fontFamily: 'Inter_700Bold' },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  heroText: { flex: 1, gap: 4 },
  heroName: { fontSize: 24 },
  heroSub: { fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statText: { fontSize: 12 },

  /* Sections */
  section: { marginTop: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: H_PAD,
  },
  sectionTitle: { fontSize: 17 },
  seeAll: { fontSize: 13 },

  /* Sort */
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 10,
  },
  sortLabel: { fontSize: 12 },
  sortDropdown: {
    position: 'absolute',
    right: H_PAD,
    top: 40,
    zIndex: 999,
    borderWidth: 1,
    overflow: 'hidden',
    minWidth: 140,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sortOptionText: { fontSize: 14 },

  /* Shop cards */
  shopCard: { width: 160, borderWidth: 1, overflow: 'hidden' },
  shopImage: { width: '100%', height: 90 },
  shopInfo: { padding: 10, gap: 6 },
  shopName: { fontSize: 13 },
  shopMeta: { flexDirection: 'row', gap: 6 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaText: { fontSize: 10 },

  /* Product grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: H_PAD,
    gap: COL_GAP,
  },
  gridCell: { width: CARD_W },
  cellLeft: {},
  cellRight: {},

  /* Empty */
  empty: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 32, gap: 12 },
  emptyIcon: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 17, marginTop: 4 },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
