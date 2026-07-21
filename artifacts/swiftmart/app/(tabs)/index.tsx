import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Feather, Ionicons } from '@expo/vector-icons';
import { CATEGORIES, PRODUCTS, SHOPS, OFFERS, NOTIFICATIONS } from '@/constants/data';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useAddresses, SavedAddress } from '@/context/AddressContext';
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

function seededShuffle<T>(arr: T[], seed: string): T[] {
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

function firstName(name: string): string {
  return name.split(' ')[0];
}

/** Short label for the location pill — first segment before a comma. */
function shortAddress(addr: SavedAddress): string {
  const first = addr.line.split(',')[0].trim();
  return first.length > 20 ? first.slice(0, 20) + '…' : first;
}

const TAG_ICON: Record<string, React.ComponentProps<typeof Feather>['name']> = {
  Home: 'home',
  Work: 'briefcase',
  Other: 'map-pin',
};

/* ─── Address picker bottom sheet ────────────────────────────────── */
function AddressPicker({
  visible,
  onClose,
  addresses,
  selectedAddress,
  onSelect,
  colors,
  insets,
}: {
  visible: boolean;
  onClose: () => void;
  addresses: SavedAddress[];
  selectedAddress: SavedAddress | null;
  onSelect: (id: string) => void;
  colors: ReturnType<typeof useColors>;
  insets: ReturnType<typeof useSafeAreaInsets>;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Scrim */}
      <TouchableOpacity style={styles.scrim} activeOpacity={1} onPress={onClose} />

      {/* Sheet */}
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.card,
            paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 24,
            ...Platform.select({
              web: { boxShadow: '0px -8px 32px rgba(0,0,0,0.5)' },
              default: {
                shadowColor: '#000',
                shadowOpacity: 0.5,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: -6 },
                elevation: 20,
              },
            }),
          },
        ]}
      >
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        <Text style={[styles.sheetTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          Deliver to
        </Text>

        {addresses.length === 0 ? (
          <View style={styles.noAddr}>
            <Feather name="map-pin" size={32} color={colors.mutedForeground} />
            <Text style={[styles.noAddrText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              No saved addresses yet
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 320 }}
            contentContainerStyle={{ gap: 10 }}
          >
            {addresses.map((addr) => {
              const isSelected = selectedAddress?.id === addr.id;
              return (
                <TouchableOpacity
                  key={addr.id}
                  activeOpacity={0.8}
                  onPress={() => { onSelect(addr.id); onClose(); }}
                  style={[
                    styles.addrRow,
                    {
                      backgroundColor: isSelected ? colors.primary + '14' : colors.background,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderRadius: colors.radius,
                    },
                  ]}
                >
                  <View style={[styles.addrIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Feather name={TAG_ICON[addr.tag]} size={16} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.addrTag, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
                      {addr.tag}
                      {addr.isDefault ? (
                        <Text style={{ color: colors.primary, fontFamily: 'Inter_400Regular', fontSize: 11 }}>
                          {'  '}Default
                        </Text>
                      ) : null}
                    </Text>
                    <Text
                      style={[styles.addrLine, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}
                      numberOfLines={2}
                    >
                      {addr.line}
                      {addr.city ? `, ${addr.city}` : ''}
                      {addr.pincode ? ` – ${addr.pincode}` : ''}
                    </Text>
                  </View>
                  {isSelected && (
                    <Feather name="check-circle" size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Add new */}
        <TouchableOpacity
          style={[styles.addNewBtn, { borderColor: colors.border, borderRadius: colors.radius }]}
          activeOpacity={0.8}
          onPress={() => { onClose(); router.push('/profile/addresses'); }}
        >
          <Feather name="plus" size={16} color={colors.primary} />
          <Text style={[styles.addNewText, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>
            Add New Address
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

/* ─── Screen ─────────────────────────────────────────────────────── */
export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addresses, selectedAddress, selectAddress } = useAddresses();
  useCart();

  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => { setLoading(false); setRefreshing(false); }, 1500);
  }, []);

  const personalizedProducts = useMemo(
    () => (user ? seededShuffle(PRODUCTS, user.id) : PRODUCTS),
    [user?.id],
  );
  const personalizedShops = useMemo(
    () => (user ? seededShuffle(SHOPS, user.id + '_shops') : SHOPS),
    [user?.id],
  );
  const personalizedOffers = useMemo(() => {
    if (!user) return OFFERS;
    return seededShuffle(OFFERS, user.id + '_offers').slice(0, 2);
  }, [user?.id]);

  const unreadCount = user ? NOTIFICATIONS.filter((n) => !n.read).length : 0;
  const scrollPaddingBottom = 96 + (insets.bottom > 0 ? insets.bottom : 0);

  /* Location pill label */
  const locationLabel = useMemo(() => {
    if (!user) return 'Set location';
    if (selectedAddress) return shortAddress(selectedAddress);
    return 'Add address';
  }, [user, selectedAddress]);

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
        <TouchableOpacity
          style={styles.deliveryRow}
          activeOpacity={0.7}
          onPress={() => {
            if (user) {
              if (addresses.length > 0) {
                setPickerVisible(true);
              } else {
                router.push('/profile/addresses');
              }
            }
          }}
        >
          <View style={[styles.locationPill, { backgroundColor: colors.primary + '18', borderColor: colors.primary + '40' }]}>
            <Ionicons name="location-sharp" size={13} color={colors.primary} />
            <Text style={[styles.deliveringTo, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              Delivering to{' '}
            </Text>
            <Text
              style={[styles.locationText, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}
              numberOfLines={1}
            >
              {locationLabel}
            </Text>
            {user && (
              <Feather name="chevron-down" size={13} color={colors.primary} style={{ marginLeft: 2 }} />
            )}
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

        <FlashDeals loading={loading} onSeeAll={() => router.push('/flash-deals')} />

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

        <SectionHeader
          title={user ? 'Your Offers' : 'Best Offers For You'}
          onSeeAll={() => router.push('/offers')}
        />
        {personalizedOffers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}

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

      {/* ── Address picker modal ─────────────────────────────────── */}
      <AddressPicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelect={selectAddress}
        colors={colors}
        insets={insets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

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
    position: 'absolute', top: -6, right: -6,
    minWidth: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  badgeText: { fontSize: 9, color: '#FFFFFF', fontFamily: 'Inter_700Bold' },

  greetingRow: { paddingHorizontal: 16, paddingTop: 2, paddingBottom: 10, gap: 2 },
  greeting: { fontSize: 18 },
  greetingSub: { fontSize: 13 },

  deliveryRow: { paddingHorizontal: 16, paddingBottom: 10 },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
    maxWidth: '85%',
  },
  deliveringTo: { fontSize: 12 },
  locationText: { fontSize: 12, flexShrink: 1 },

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

  skeletonRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingBottom: 4 },

  /* Address picker */
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 14,
  },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 6 },
  sheetTitle: { fontSize: 18 },
  noAddr: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  noAddrText: { fontSize: 14 },
  addrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1.5,
  },
  addrIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  addrTag: { fontSize: 14, marginBottom: 2 },
  addrLine: { fontSize: 12, lineHeight: 17 },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addNewText: { fontSize: 14 },
});
