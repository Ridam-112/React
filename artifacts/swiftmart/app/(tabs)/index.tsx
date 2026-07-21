import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import { Feather, Ionicons } from '@expo/vector-icons';
import { CATEGORIES, PRODUCTS, SHOPS, OFFERS, NOTIFICATIONS } from '@/constants/data';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
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

/** Deterministic seeded shuffle so each user sees a stable, different order. */
function seededShuffle<T>(arr: T[], seed: string): T[] {
  // Simple hash of the seed string → integer
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0;
  }
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    hash = (Math.imul(hash, 1664525) + 1013904223) | 0;
    const j = Math.abs(hash) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** First name only from a full name string. */
function firstName(name: string): string {
  return name.split(' ')[0];
}

/* ─── Screen ─────────────────────────────────────────────────────── */
export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  useCart();

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

  // Each signed-in user sees products and shops in a different order,
  // deterministically shuffled by their user ID. Guests see the default order.
  const personalizedProducts = useMemo(
    () => (user ? seededShuffle(PRODUCTS, user.id) : PRODUCTS),
    [user?.id],
  );
  const personalizedShops = useMemo(
    () => (user ? seededShuffle(SHOPS, user.id + '_shops') : SHOPS),
    [user?.id],
  );
  // Each user also gets a different subset of offers (rotate by user hash)
  const personalizedOffers = useMemo(() => {
    if (!user) return OFFERS;
    const shuffled = seededShuffle(OFFERS, user.id + '_offers');
    return shuffled.slice(0, 2); // show 2 personalised offers
  }, [user?.id]);

  const unreadCount = user
    ? NOTIFICATIONS.filter((n) => !n.read).length
    : 0;

  const scrollPaddingBottom = 96 + (insets.bottom > 0 ? insets.bottom : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

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
        {/* ── App bar ─────────────────────────────────────────────── */}
        <View style={styles.appBar}>
          <Image
            source={require('@/assets/images/swiftmart-logo.png')}
            style={{ width: 120, height: 48 }}
            resizeMode="contain"
          />
          <View style={styles.headerActions}>
            {user && (
              <TouchableOpacity
                style={styles.iconBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => router.push('/notifications')}
              >
                <Feather name="bell" size={22} color={colors.foreground} />
                {unreadCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
                    <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── Greeting ────────────────────────────────────────────── */}
        <View style={styles.greetingRow}>
          <Text style={[styles.greeting, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
            {getGreeting()}, {user ? firstName(user.name) : 'there'} 👋
          </Text>
          <Text style={[styles.greetingSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            {user ? 'What do you need today?' : 'Browse and shop without signing in.'}
          </Text>
        </View>

        {/* ── Delivery Location ────────────────────────────────────── */}
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

        {/* ── Search Bar ───────────────────────────────────────────── */}
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

        {/* ── Guest sign-in banner ─────────────────────────────────── */}
        {!user && (
          <TouchableOpacity
            style={[styles.guestBanner, { backgroundColor: colors.primary + '14', borderColor: colors.primary + '35' }]}
            activeOpacity={0.8}
            onPress={() => router.push('/auth')}
          >
            <Feather name="user" size={16} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.guestBannerTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
                Sign in for personalised deals
              </Text>
              <Text style={[styles.guestBannerSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                Exclusive offers, order tracking & more
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}

        {/* ── Hero Carousel ────────────────────────────────────────── */}
        {loading ? <BannerSkeleton /> : <HeroBanner />}

        {/* ── Top Categories ───────────────────────────────────────── */}
        <SectionHeader title="Top Categories" onSeeAll={() => router.push('/(tabs)/categories')} />
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          renderItem={({ item }) => (
            <CategoryItem category={item} onPress={() => router.push(`/category/${item.id}`)} />
          )}
          scrollEnabled
        />

        {/* ── Flash Deals ──────────────────────────────────────────── */}
        <FlashDeals loading={loading} onSeeAll={() => router.push('/flash-deals')} />

        {/* ── Products: personalised order for signed-in users ─────── */}
        <SectionHeader
          title={user ? 'Recommended for You' : 'Popular Near You'}
          onSeeAll={() => router.push('/products')}
        />
        {loading ? (
          <View style={styles.skeletonRow}>
            {[0, 1, 2].map((i) => <ProductCardSkeleton key={i} />)}
          </View>
        ) : (
          <FlatList
            data={personalizedProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            renderItem={({ item }) => <ProductCard product={item} />}
            scrollEnabled
          />
        )}

        {/* ── Offers: personalised for signed-in users ─────────────── */}
        <SectionHeader
          title={user ? 'Your Offers' : 'Best Offers For You'}
          onSeeAll={() => router.push('/offers')}
        />
        {personalizedOffers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}

        {/* ── Shops: personalised order for signed-in users ────────── */}
        <SectionHeader
          title={user ? 'Top Picks Near You' : 'Recommended Shops'}
          onSeeAll={() => router.push('/shops')}
        />
        {loading ? (
          <View style={styles.skeletonRow}>
            {[0, 1, 2].map((i) => <ShopCardSkeleton key={i} />)}
          </View>
        ) : (
          <FlatList
            data={personalizedShops}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 4 }}
            renderItem={({ item }) => <ShopCard shop={item} />}
            scrollEnabled
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* App bar */
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  iconBtn: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
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

  /* Guest banner */
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  guestBannerTitle: { fontSize: 13 },
  guestBannerSub: { fontSize: 11, marginTop: 1 },

  /* Skeleton rows */
  skeletonRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
});
