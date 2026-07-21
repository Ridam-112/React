import React, { useMemo, useCallback } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';
import { SHOPS, PRODUCTS, FLASH_DEALS, Product } from '@/constants/data';

const ALL_PRODUCTS = [...PRODUCTS, ...FLASH_DEALS];

const { width: SCREEN_W } = Dimensions.get('window');
const H_PAD = 16;
const COL_GAP = 12;
const CARD_W = Math.floor((SCREEN_W - H_PAD * 2 - COL_GAP) / 2);

export default function ShopDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();

  const shop = SHOPS.find((s) => s.id === id);

  const shopProducts = useMemo(() => {
    if (!shop) return [];
    return ALL_PRODUCTS.filter(
      (p) => p.category && shop.productCategories.includes(p.category)
    );
  }, [shop]);

  const renderProduct = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <View style={[styles.cellWrapper, index % 2 === 0 ? styles.cellLeft : styles.cellRight]}>
        <ProductCard product={item} cardWidth={CARD_W} />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  if (!shop) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        <View style={styles.centered}>
          <Feather name="shopping-bag" size={48} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
            Shop not found
          </Text>
        </View>
      </View>
    );
  }

  const ListHeader = (
    <>
      {/* Shop hero image */}
      <View style={[styles.heroContainer, { backgroundColor: colors.card }]}>
        <Image source={shop.image} style={styles.heroImage} resizeMode="cover" />
        {/* Overlay gradient hint */}
        <View style={styles.heroOverlay} />
      </View>

      {/* Shop info card */}
      <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
        {/* Category pill */}
        <View style={[styles.categoryPill, { backgroundColor: colors.primary + '18' }]}>
          <Text style={[styles.categoryText, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>
            {shop.category}
          </Text>
        </View>

        <Text style={[styles.shopName, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          {shop.name}
        </Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <MaterialCommunityIcons name="star" size={14} color="#FFC107" />
            <Text style={[styles.statText, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
              {shop.rating}
            </Text>
            <Text style={[styles.statSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              rating
            </Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

          <View style={styles.statChip}>
            <MaterialCommunityIcons name="clock-fast" size={14} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
              {shop.deliveryTime}
            </Text>
            <Text style={[styles.statSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              delivery
            </Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

          <View style={styles.statChip}>
            <Feather name="package" size={14} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
              {shopProducts.length}
            </Text>
            <Text style={[styles.statSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              items
            </Text>
          </View>
        </View>

        {/* FSSAI verified badge */}
        {shop.category !== 'Pharmacy' && (
          <View style={styles.fssaiRow}>
            <View style={[styles.fssaiBadge, { backgroundColor: '#0a7c3e' }]}>
              <MaterialCommunityIcons name="check-decagram" size={13} color="#fff" />
              <Text style={[styles.fssaiText, { fontFamily: 'Inter_600SemiBold' }]}>
                FSSAI Verified
              </Text>
            </View>
            <Text style={[styles.fssaiSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              Lic. No. 10019022000149
            </Text>
          </View>
        )}
      </View>

      {/* Section heading */}
      <View style={styles.sectionHeading}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          Our Products
        </Text>
        <Text style={[styles.sectionCount, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          {shopProducts.length} item{shopProducts.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Floating header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: colors.card + 'e0', borderColor: colors.border }]}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: colors.card + 'e0', borderColor: colors.border }]}
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

      <FlatList
        data={shopProducts}
        numColumns={2}
        keyExtractor={keyExtractor}
        renderItem={renderProduct}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Feather name="package" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
              No products yet
            </Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              Check back soon
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  /* Floating top bar */
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: H_PAD,
    paddingBottom: 8,
    zIndex: 10,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 9, fontFamily: 'Inter_700Bold' },

  /* Hero */
  heroContainer: { width: '100%', height: 220 },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },

  /* Info card */
  infoCard: {
    margin: H_PAD,
    marginTop: -20,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    ...Platform.select({
      web: { boxShadow: '0px 4px 16px rgba(0,0,0,0.10)' },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
      },
    }),
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: { fontSize: 12 },
  shopName: { fontSize: 22 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  statChip: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center' },
  statText: { fontSize: 15 },
  statSub: { fontSize: 11 },
  statDivider: { width: 1, height: 28, marginHorizontal: 4 },
  fssaiRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 },
  fssaiBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  fssaiText: { fontSize: 11, color: '#fff' },
  fssaiSub: { fontSize: 11 },

  /* Products section */
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: H_PAD,
    paddingBottom: 10,
  },
  sectionTitle: { fontSize: 18 },
  sectionCount: { fontSize: 13 },

  /* Grid */
  listContent: { paddingHorizontal: H_PAD },
  columnWrapper: { gap: COL_GAP, marginBottom: COL_GAP },
  cellWrapper: { flex: 1 },
  cellLeft: {},
  cellRight: {},

  /* Empty / not found */
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: { fontSize: 18, marginTop: 8 },
  emptySub: { fontSize: 14 },
});
