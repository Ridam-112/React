import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';
import { useCart } from '@/context/CartContext';

export default function ConfirmScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, total, itemCount, clearCart } = useCart();

  const deliveryFee = 29;
  const grandTotal = total + deliveryFee;

  function handlePlaceOrder() {
    clearCart();
    router.replace('/checkout/success');
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
            Order Summary
          </Text>
        </View>
        <StepDots current={2} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 140 }}>

        {/* Delivery address */}
        <SectionCard colors={colors} icon="map-pin" title="Delivering to">
          <View style={styles.addrRow}>
            <View style={[styles.addrTag, { backgroundColor: colors.primary + '22' }]}>
              <Feather name="home" size={11} color={colors.primary} />
              <Text style={[styles.addrTagText, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>Home</Text>
            </View>
          </View>
          <Text style={[styles.addrName, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>Ridam Sharma</Text>
          <Text style={[styles.addrLine, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            12, Green Valley Apartments, MG Road, Mumbai – 400001
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.changeLink, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>Change</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* Payment method */}
        <SectionCard colors={colors} icon="credit-card" title="Payment Method">
          <View style={styles.payRow}>
            <View style={[styles.payIcon, { backgroundColor: colors.primary + '22' }]}>
              <Feather name="smartphone" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.payLabel, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>UPI</Text>
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 'auto' }}>
              <Text style={[styles.changeLink, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>Change</Text>
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* Items */}
        <SectionCard colors={colors} icon="shopping-bag" title={`Items (${itemCount})`}>
          {items.length === 0 ? (
            <Text style={[styles.emptyNote, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              Your cart is empty.
            </Text>
          ) : (
            items.map((item, index) => (
              <View
                key={item.product.id}
                style={[
                  styles.itemRow,
                  index < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
              >
                <View style={[styles.itemImg, { backgroundColor: colors.muted, borderRadius: 8 }]}>
                  <Image source={item.product.image} style={styles.imgContent} resizeMode="contain" />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]} numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  <Text style={[styles.itemWeight, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                    {item.product.weight} · Qty {item.quantity}
                  </Text>
                </View>
                <Text style={[styles.itemPrice, { color: colors.primary, fontFamily: 'Inter_700Bold' }]}>
                  ₹{item.product.discountedPrice * item.quantity}
                </Text>
              </View>
            ))
          )}
        </SectionCard>

        {/* Price breakdown */}
        <SectionCard colors={colors} icon="tag" title="Price Details">
          <PriceLine label="Item Total" value={`₹${total}`} colors={colors} />
          <PriceLine label="Delivery Fee" value={`₹${deliveryFee}`} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <PriceLine label="Grand Total" value={`₹${grandTotal}`} colors={colors} bold />
        </SectionCard>

        {/* Estimated delivery */}
        <View style={[styles.etaBanner, { backgroundColor: '#4CAF5014', borderColor: '#4CAF5033', borderRadius: colors.radius }]}>
          <Feather name="clock" size={15} color="#4CAF50" />
          <Text style={[styles.etaText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            Estimated delivery: <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold' }}>20–35 min</Text>
          </Text>
        </View>

      </ScrollView>

      {/* Place Order */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.footerTop}>
          <Text style={[styles.footerLabel, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>Grand Total</Text>
          <Text style={[styles.footerTotal, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>₹{grandTotal}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePlaceOrder}
          style={[styles.placeBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
        >
          <Feather name="check-circle" size={18} color={colors.primaryForeground ?? '#07111F'} />
          <Text style={[styles.placeBtnText, { color: colors.primaryForeground ?? '#07111F', fontFamily: 'Inter_700Bold' }]}>
            Place Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SectionCard({
  colors,
  icon,
  title,
  children,
}: {
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
      <View style={styles.cardHeader}>
        <Feather name={icon as any} size={15} color={colors.primary} />
        <Text style={[styles.cardTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function PriceLine({
  label,
  value,
  colors,
  bold,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof import('@/hooks/useColors').useColors>;
  bold?: boolean;
}) {
  return (
    <View style={styles.priceLine}>
      <Text style={[styles.priceLabel, { color: bold ? colors.foreground : colors.mutedForeground, fontFamily: bold ? 'Inter_700Bold' : 'Inter_400Regular' }]}>
        {label}
      </Text>
      <Text style={[styles.priceValue, { color: bold ? colors.primary : colors.foreground, fontFamily: bold ? 'Inter_700Bold' : 'Inter_500Medium' }]}>
        {value}
      </Text>
    </View>
  );
}

function StepDots({ current }: { current: number }) {
  const colors = useColors();
  return (
    <View style={styles.dots}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i <= current ? colors.primary : colors.border,
              width: i === current ? 18 : 7,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 10 },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 16 },
  dots: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  dot: { height: 7, borderRadius: 4 },

  card: { padding: 14, borderWidth: 1, gap: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 14 },

  addrRow: { flexDirection: 'row' },
  addrTag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  addrTagText: { fontSize: 11 },
  addrName: { fontSize: 14 },
  addrLine: { fontSize: 13, lineHeight: 19 },
  changeLink: { fontSize: 13, marginTop: 4 },

  payRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  payIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  payLabel: { fontSize: 14 },

  emptyNote: { fontSize: 13 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  itemImg: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  imgContent: { width: 40, height: 40 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, lineHeight: 18 },
  itemWeight: { fontSize: 12, marginTop: 2 },
  itemPrice: { fontSize: 14 },

  priceLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 3 },
  priceLabel: { fontSize: 13 },
  priceValue: { fontSize: 13 },
  divider: { height: 1, marginVertical: 4 },

  etaBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderWidth: 1 },
  etaText: { fontSize: 13 },

  footer: { padding: 16, borderTopWidth: 1, gap: 10 },
  footerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { fontSize: 13 },
  footerTotal: { fontSize: 20 },
  placeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  placeBtnText: { fontSize: 16 },
});
