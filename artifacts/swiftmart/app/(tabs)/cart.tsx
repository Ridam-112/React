import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

export default function CartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, itemCount, total, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 16, backgroundColor: colors.background },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: colors.foreground, fontFamily: 'Inter_700Bold' },
          ]}
        >
          My Cart
        </Text>
        {items.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              clearCart();
            }}
          >
            <Text
              style={[
                styles.clearText,
                { color: colors.destructive, fontFamily: 'Inter_500Medium' },
              ]}
            >
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="shopping-cart" size={64} color={colors.mutedForeground} />
          <Text
            style={[
              styles.emptyTitle,
              { color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
            ]}
          >
            Your cart is empty
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              {
                color: colors.mutedForeground,
                fontFamily: 'Inter_400Regular',
              },
            ]}
          >
            Add items from the home screen to get started
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.cartItem,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Image
                  source={item.product.image}
                  style={styles.productImg}
                  resizeMode="contain"
                />
                <View style={styles.productInfo}>
                  <Text
                    style={[
                      styles.productName,
                      {
                        color: colors.foreground,
                        fontFamily: 'Inter_600SemiBold',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.product.name}
                  </Text>
                  <Text
                    style={[
                      styles.productWeight,
                      {
                        color: colors.mutedForeground,
                        fontFamily: 'Inter_400Regular',
                      },
                    ]}
                  >
                    {item.product.weight}
                  </Text>
                  <Text
                    style={[
                      styles.productPrice,
                      { color: colors.primary, fontFamily: 'Inter_700Bold' },
                    ]}
                  >
                    ₹{item.product.discountedPrice}
                  </Text>
                </View>
                <View style={styles.qtyControls}>
                  <TouchableOpacity
                    style={[
                      styles.qtyBtn,
                      { backgroundColor: colors.secondary },
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      updateQuantity(item.product.id, item.quantity - 1);
                    }}
                  >
                    <Feather name="minus" size={14} color={colors.primary} />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.qty,
                      { color: colors.foreground, fontFamily: 'Inter_700Bold' },
                    ]}
                  >
                    {item.quantity}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.qtyBtn,
                      { backgroundColor: colors.secondary },
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      updateQuantity(item.product.id, item.quantity + 1);
                    }}
                  >
                    <Feather name="plus" size={14} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          {/* Checkout Footer — must clear the floating tab bar (70px) + its 16px gap */}
          <View
            style={[
              styles.footer,
              {
                backgroundColor: colors.card,
                borderTopColor: colors.border,
                paddingBottom: insets.bottom + 86,
              },
            ]}
          >
            <View style={styles.totalRow}>
              <Text
                style={[
                  styles.totalLabel,
                  {
                    color: colors.mutedForeground,
                    fontFamily: 'Inter_400Regular',
                  },
                ]}
              >
                Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </Text>
              <Text
                style={[
                  styles.totalAmount,
                  { color: colors.foreground, fontFamily: 'Inter_700Bold' },
                ]}
              >
                ₹{total}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.checkoutBtn,
                {
                  backgroundColor: colors.primary,
                  borderRadius: colors.radius,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                if (!user) {
                  router.push('/auth/index');
                } else {
                  router.push('/checkout/address');
                }
              }}
            >
              <Text
                style={[
                  styles.checkoutText,
                  {
                    color: colors.primaryForeground,
                    fontFamily: 'Inter_700Bold',
                  },
                ]}
              >
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 22 },
  clearText: { fontSize: 14 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyTitle: { fontSize: 18, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  productImg: { width: 64, height: 64 },
  productInfo: { flex: 1, gap: 3 },
  productName: { fontSize: 14 },
  productWeight: { fontSize: 12 },
  productPrice: { fontSize: 16 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { fontSize: 16, minWidth: 22, textAlign: 'center' },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { fontSize: 14 },
  totalAmount: { fontSize: 22 },
  checkoutBtn: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  checkoutText: { fontSize: 16 },
});
