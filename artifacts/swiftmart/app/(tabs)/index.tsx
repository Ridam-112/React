import React, { useState, useCallback, useEffect } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { CATEGORIES, PRODUCTS, SHOPS, OFFERS } from '@/constants/data';
import { useCart } from '@/context/CartContext';
import { SectionHeader } from '@/components/SectionHeader';
import { ProductCard } from '@/components/ProductCard';
import { ShopCard } from '@/components/ShopCard';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryItem } from '@/components/CategorySection';
import { OfferCard } from '@/components/OfferCard';
import { FlashDeals } from '@/components/FlashDeals';
import {
  ProductCardSkeleton,
  ShopCardSkeleton,
  BannerSkeleton,
} from '@/components/SkeletonLoader';

/* ─── Helpers ────────────────────────────────────────────────────── */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good Morning';
  if (h >= 12 && h < 17) return 'Good Afternoon';
  if (h >= 17 && h < 21) return 'Good Evening';
  return 'Good Night';
}

/* ─── Screen ─────────────────────────────────────────────────────── */
export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();

  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, 1500);
  }, []);

  const scrollPaddingBottom = 96 + (insets.bottom > 0 ? insets.bottom : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Scrollable Content ────────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={{ paddingBottom: scrollPaddingBottom, paddingTop: insets.top }}
      >
        {/* ── Header (scrolls with content) ─────────────────────── */}
        <View style={styles.appBar}>
          <Image
            source={require('@/assets/images/swiftmart-logo.png')}
            style={{ width: 120, height: 48 }}
            resizeMode="contain"
          />
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={() => router.push('/notifications')}>
              <Feather name="bell" size={22} color={colors.foreground} />
              <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* Greeting — scrolls away */}
        <View style={styles.greetingRow}>
          <Text style={[styles.greeting, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
            {getGreeting()}, Ridam 👋
          </Text>
          <Text style={[styles.greetingSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            What do you need today?
          </Text>
        </View>

        {/* Delivery Location — scrolls away */}
        <TouchableOpacity style={styles.deliveryRow} activeOpacity={0.7}>
          <View style={[styles.locationPill, { backgroundColor: colors.primary + '18', borderColor: colors.primary + '40' }]}>
            <Ionicons name="location-sharp" size={13} color={colors.primary} />
            <Text style={[styles.deliveringTo, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              Delivering to{' '}
            </Text>
            <Text style={[styles.locationText, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
              Balurghat
            </Text>
            <Feather name="chevron-down" size={13} color={colors.primary} style={{ marginLeft: 2 }} />
          </View>
        </TouchableOpacity>

        {/* Search Bar — scrolls away */}
        <View style={[styles.searchBar, { backgroundColor: colors.muted, borderRadius: colors.radius, borderColor: colors.border }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
            placeholder="Search groceries, medicines, food..."
            placeholderTextColor={colors.mutedForeground}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Feather name="x-circle" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        {/* Hero Carousel */}
        {loading ? <BannerSkeleton /> : <HeroBanner />}

        {/* Top Categories */}
        <SectionHeader title="Top Categories" onSeeAll={() => router.push('/(tabs)/categories')} />
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          renderItem={({ item }) => <CategoryItem category={item} />}
          scrollEnabled
        />

        {/* Flash Deals */}
        <FlashDeals loading={loading} onSeeAll={() => router.push('/flash-deals')} />

        {/* Popular Near You */}
        <SectionHeader title="Popular Near You" onSeeAll={() => router.push('/products')} />
        {loading ? (
          <View style={styles.skeletonRow}>
            {[0, 1, 2].map((i) => <ProductCardSkeleton key={i} />)}
          </View>
        ) : (
          <FlatList
            data={PRODUCTS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            renderItem={({ item }) => <ProductCard product={item} />}
            scrollEnabled
          />
        )}

        {/* Best Offers */}
        <SectionHeader title="Best Offers For You" onSeeAll={() => router.push('/offers')} />
        {OFFERS.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}

        {/* Recommended Shops */}
        <SectionHeader title="Recommended Shops" onSeeAll={() => router.push('/shops')} />
        {loading ? (
          <View style={styles.skeletonRow}>
            {[0, 1, 2].map((i) => <ShopCardSkeleton key={i} />)}
          </View>
        ) : (
          <FlatList
            data={SHOPS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 4 }}
            renderItem={({ item }) => <ShopCard shop={item} />}
            scrollEnabled
          />
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Fixed overlay header */
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },

  /* App bar */
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  logoSwift: { fontSize: 20 },
  logoMart: { fontSize: 20 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  iconBtn: { position: 'relative' },
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
  badgeText: { fontSize: 9, color: '#FFFFFF', fontFamily: 'Inter_700Bold' },

  /* Greeting */
  greetingRow: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 10,
    gap: 2,
  },
  greeting: { fontSize: 18 },
  greetingSub: { fontSize: 13 },

  /* Delivery row */
  deliveryRow: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  deliveringTo: { fontSize: 12 },
  locationText: { fontSize: 12 },

  /* Search */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 4,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },

  /* Skeleton rows */
  skeletonRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
});
