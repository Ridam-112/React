import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* App Bar */}
      <View
        style={[styles.appBar, { paddingTop: insets.top + 10 }]}
      >
        <TouchableOpacity
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Feather name="menu" size={24} color={colors.foreground} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoRow}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={20}
            color={colors.primary}
          />
          <Text
            style={[
              styles.logoSwift,
              { color: colors.primary, fontFamily: 'Inter_700Bold' },
            ]}
          >
            Swift
          </Text>
          <Text
            style={[
              styles.logoMart,
              { color: colors.foreground, fontFamily: 'Inter_700Bold' },
            ]}
          >
            Mart
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="bell" size={22} color={colors.foreground} />
            <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="shopping-cart" size={22} color={colors.foreground} />
            {itemCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text
                  style={[styles.badgeText, { color: colors.primaryForeground }]}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Delivery Location Row */}
      <TouchableOpacity style={styles.deliveryRow} activeOpacity={0.7}>
        <Ionicons name="location-sharp" size={14} color={colors.primary} />
        <Text
          style={[
            styles.deliveringTo,
            { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' },
          ]}
        >
          Delivering to{' '}
        </Text>
        <Text
          style={[
            styles.locationText,
            { color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
          ]}
        >
          Balurghat
        </Text>
        <Feather
          name="chevron-down"
          size={14}
          color={colors.primary}
          style={{ marginLeft: 2 }}
        />
      </TouchableOpacity>

      {/* Search Bar */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.muted,
            borderRadius: colors.radius,
            borderColor: colors.border,
          },
        ]}
      >
        <Feather name="search" size={18} color={colors.mutedForeground} />
        <TextInput
          style={[
            styles.searchInput,
            { color: colors.foreground, fontFamily: 'Inter_400Regular' },
          ]}
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

      {/* Scrollable Content */}
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
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Hero Carousel */}
        <HeroBanner />

        {/* Top Categories */}
        <SectionHeader title="Top Categories" />
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          renderItem={({ item }) => <CategoryItem category={item} />}
          scrollEnabled
        />

        {/* Popular Near You */}
        <SectionHeader title="Popular Near You" />
        <FlatList
          data={PRODUCTS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          renderItem={({ item }) => <ProductCard product={item} />}
          scrollEnabled={!!PRODUCTS.length}
        />

        {/* Best Offers */}
        <SectionHeader title="Best Offers For You" />
        {OFFERS.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}

        {/* Recommended Shops */}
        <SectionHeader title="Recommended Shops" />
        <FlatList
          data={SHOPS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          renderItem={({ item }) => <ShopCard shop={item} />}
          scrollEnabled={!!SHOPS.length}
        />
      </ScrollView>
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
    paddingBottom: 10,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  logoSwift: { fontSize: 20 },
  logoMart: { fontSize: 20 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
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
  badgeText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  deliveringTo: { fontSize: 13 },
  locationText: { fontSize: 13 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
});
