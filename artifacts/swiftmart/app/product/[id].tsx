import React, { useRef } from 'react';
import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, FLASH_DEALS } from '@/constants/data';

const ALL_PRODUCTS = [...PRODUCTS, ...FLASH_DEALS];

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, addToCart, updateQuantity } = useCart();

  const product = ALL_PRODUCTS.find((p) => p.id === id);

  const btnScale = useRef(new Animated.Value(1)).current;
  const nativeDriver = Platform.OS !== 'web';

  if (!product) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Feather name="package" size={48} color={colors.mutedForeground} />
          <Text style={[styles.notFoundText, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
            Product not found
          </Text>
        </View>
      </View>
    );
  }

  const cartItem = items.find((i) => i.product.id === product.id);
  const qty = cartItem?.quantity ?? 0;

  const punchBtn = () => {
    Animated.sequence([
      Animated.spring(btnScale, { toValue: 0.88, useNativeDriver: nativeDriver, speed: 60, bounciness: 0 }),
      Animated.spring(btnScale, { toValue: 1, useNativeDriver: nativeDriver, speed: 18, bounciness: 14 }),
    ]).start();
  };

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    punchBtn();
    addToCart(product);
  };

  const handleDecrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateQuantity(product.id, qty - 1);
  };

  const handleIncrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToCart(product);
  };

  const savings = product.originalPrice - product.discountedPrice;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
          Product Details
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Image area */}
        <View style={[styles.imageContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Discount badge */}
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.badgeText, { color: colors.primaryForeground, fontFamily: 'Inter_700Bold' }]}>
              {product.discount}% OFF
            </Text>
          </View>
          <Image source={product.image} style={styles.image} resizeMode="contain" />
        </View>

        {/* Info card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          {/* Category pill */}
          {product.category && (
            <View style={[styles.categoryPill, { backgroundColor: colors.primary + '18' }]}>
              <Text style={[styles.categoryText, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>
                {product.category}
              </Text>
            </View>
          )}

          <Text style={[styles.name, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
            {product.name}
          </Text>
          <Text style={[styles.weight, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            {product.weight}
          </Text>

          {/* Price row */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.primary, fontFamily: 'Inter_700Bold' }]}>
              ₹{product.discountedPrice}
            </Text>
            <Text style={[styles.originalPrice, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              ₹{product.originalPrice}
            </Text>
            <View style={[styles.savingsPill, { backgroundColor: '#4CAF5018' }]}>
              <Text style={[styles.savingsText, { fontFamily: 'Inter_600SemiBold', color: '#4CAF50' }]}>
                Save ₹{savings}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {product.description && (
          <View style={[styles.descCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
              About this product
            </Text>
            <Text style={[styles.description, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              {product.description}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
          },
        ]}
      >
        {qty === 0 ? (
          <Animated.View style={[{ transform: [{ scale: btnScale }] }, styles.addBtnWrapper]}>
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
              onPress={handleAdd}
              activeOpacity={0.9}
            >
              <Feather name="shopping-cart" size={18} color={colors.primaryForeground} />
              <Text style={[styles.addBtnText, { color: colors.primaryForeground, fontFamily: 'Inter_700Bold' }]}>
                Add to Cart
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.qtyWrapper}>
            <Text style={[styles.inCartLabel, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              In cart
            </Text>
            <View style={[styles.qtyRow, { backgroundColor: colors.secondary, borderColor: colors.border, borderRadius: colors.radius }]}>
              <TouchableOpacity style={styles.qtyBtn} onPress={handleDecrement} hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
                <Feather name="minus" size={18} color={colors.primary} />
              </TouchableOpacity>
              <Text style={[styles.qty, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>{qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={handleIncrement} hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
                <Feather name="plus" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 17 },
  scroll: { padding: 16, gap: 12 },

  imageContainer: {
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  badgeText: { fontSize: 12 },
  image: { width: '70%', height: 220 },

  infoCard: {
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 4,
  },
  categoryText: { fontSize: 12 },
  name: { fontSize: 22 },
  weight: { fontSize: 14 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  price: { fontSize: 26 },
  originalPrice: { fontSize: 16, textDecorationLine: 'line-through' },
  savingsPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  savingsText: { fontSize: 12 },

  descCard: {
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  sectionTitle: { fontSize: 15 },
  description: { fontSize: 14, lineHeight: 22 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  addBtnWrapper: { width: '100%' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  addBtnText: { fontSize: 16 },
  qtyWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inCartLabel: { fontSize: 14 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  qtyBtn: { paddingHorizontal: 20, paddingVertical: 14 },
  qty: { fontSize: 18, minWidth: 32, textAlign: 'center' },

  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 18 },
});
