import React, { useRef } from 'react';
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useCart } from '@/context/CartContext';
import { Product } from '@/constants/data';

type Props = { product: Product; cardWidth?: number };

export function ProductCard({ product, cardWidth }: Props) {
  const colors = useColors();
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const qty = cartItem?.quantity ?? 0;

  // Scale spring for the Add button press
  const btnScale = useRef(new Animated.Value(1)).current;

  const nativeDriver = Platform.OS !== 'web';
  const punchBtn = () => {
    Animated.sequence([
      Animated.spring(btnScale, {
        toValue: 0.86,
        useNativeDriver: nativeDriver,
        speed: 60,
        bounciness: 0,
      }),
      Animated.spring(btnScale, {
        toValue: 1,
        useNativeDriver: nativeDriver,
        speed: 18,
        bounciness: 14,
      }),
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

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          ...(cardWidth !== undefined ? { width: cardWidth } : {}),
        },
      ]}
    >
      {/* Discount Badge */}
      <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
        <Text
          style={[
            styles.discountText,
            { color: colors.primaryForeground, fontFamily: 'Inter_700Bold' },
          ]}
        >
          {product.discount}% OFF
        </Text>
      </View>

      {/* Product Image */}
      <Image source={product.image} style={styles.image} resizeMode="contain" />

      {/* Info */}
      <View style={styles.info}>
        <Text
          style={[
            styles.name,
            { color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
          ]}
          numberOfLines={2}
        >
          {product.name}
        </Text>
        <Text
          style={[
            styles.weight,
            { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' },
          ]}
        >
          {product.weight}
        </Text>
        <View style={styles.priceRow}>
          <Text
            style={[
              styles.price,
              { color: colors.primary, fontFamily: 'Inter_700Bold' },
            ]}
          >
            ₹{product.discountedPrice}
          </Text>
          <Text
            style={[
              styles.originalPrice,
              { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' },
            ]}
          >
            ₹{product.originalPrice}
          </Text>
        </View>

        {/* Add / Quantity controls */}
        {qty === 0 ? (
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={[
                styles.addBtn,
                {
                  backgroundColor: colors.primary,
                  borderRadius: colors.radius - 4,
                },
              ]}
              onPress={handleAdd}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.addBtnText,
                  { color: colors.primaryForeground, fontFamily: 'Inter_600SemiBold' },
                ]}
              >
                Add
              </Text>
              <Feather name="plus" size={14} color={colors.primaryForeground} />
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View
            style={[
              styles.qtyRow,
              {
                backgroundColor: colors.secondary,
                borderRadius: colors.radius - 4,
                borderColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={handleDecrement}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            >
              <Feather name="minus" size={14} color={colors.primary} />
            </TouchableOpacity>
            <Text
              style={[
                styles.qty,
                { color: colors.foreground, fontFamily: 'Inter_700Bold' },
              ]}
            >
              {qty}
            </Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={handleIncrement}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            >
              <Feather name="plus" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 152,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: 12,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 1,
  },
  discountText: { fontSize: 10 },
  image: { width: '100%', height: 110, marginTop: 8 },
  info: { paddingHorizontal: 10, gap: 4 },
  name: { fontSize: 13 },
  weight: { fontSize: 11 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: { fontSize: 15 },
  originalPrice: { fontSize: 12, textDecorationLine: 'line-through' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 4,
    gap: 4,
  },
  addBtnText: { fontSize: 13 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    borderWidth: 1,
  },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { fontSize: 15 },
});
