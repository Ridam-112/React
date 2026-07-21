import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';
import { useCart } from '@/context/CartContext';

type Method = 'upi' | 'card' | 'cod' | 'wallet';

const METHODS: { id: Method; label: string; sub: string; icon: string; iconSet: 'feather' | 'mci' }[] = [
  { id: 'upi',    label: 'UPI',               sub: 'Pay via any UPI app',         icon: 'smartphone',        iconSet: 'feather' },
  { id: 'card',   label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay',    icon: 'credit-card',       iconSet: 'feather' },
  { id: 'cod',    label: 'Cash on Delivery',   sub: 'Pay when your order arrives', icon: 'cash-multiple',     iconSet: 'mci'     },
  { id: 'wallet', label: 'Wallet',             sub: 'SwiftMart wallet balance',    icon: 'wallet-outline',    iconSet: 'mci'     },
];

export default function PaymentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { total, itemCount } = useCart();
  const [selected, setSelected] = useState<Method>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const deliveryFee = 29;
  const grandTotal = total + deliveryFee;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
            Payment Method
          </Text>
        </View>
        <StepDots current={1} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 140 }}>

        {/* Order summary pill */}
        <View style={[styles.summaryPill, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <View>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'} · Delivery ₹{deliveryFee}
            </Text>
            <Text style={[styles.summaryTotal, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
              Total ₹{grandTotal}
            </Text>
          </View>
          <View style={[styles.lockBadge, { backgroundColor: '#4CAF5022' }]}>
            <Feather name="lock" size={13} color="#4CAF50" />
            <Text style={[styles.lockText, { color: '#4CAF50', fontFamily: 'Inter_500Medium' }]}>Secure</Text>
          </View>
        </View>

        {/* Payment methods */}
        {METHODS.map((m) => {
          const isActive = selected === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.8}
              onPress={() => setSelected(m.id)}
              style={[
                styles.methodCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isActive ? colors.primary : colors.border,
                  borderRadius: colors.radius,
                  borderWidth: isActive ? 2 : 1,
                },
              ]}
            >
              <View style={[styles.methodIcon, { backgroundColor: isActive ? colors.primary + '22' : colors.secondary }]}>
                {m.iconSet === 'feather'
                  ? <Feather name={m.icon as any} size={20} color={isActive ? colors.primary : colors.mutedForeground} />
                  : <MaterialCommunityIcons name={m.icon as any} size={20} color={isActive ? colors.primary : colors.mutedForeground} />
                }
              </View>
              <View style={styles.methodInfo}>
                <Text style={[styles.methodLabel, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
                  {m.label}
                </Text>
                <Text style={[styles.methodSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                  {m.sub}
                </Text>
              </View>
              <View style={[
                styles.radioOuter,
                { borderColor: isActive ? colors.primary : colors.border },
              ]}>
                {isActive && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* UPI input */}
        {selected === 'upi' && (
          <View style={[styles.extraCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
              UPI ID
            </Text>
            <TextInput
              value={upiId}
              onChangeText={setUpiId}
              placeholder="yourname@upi"
              placeholderTextColor={colors.mutedForeground + '88'}
              autoCapitalize="none"
              style={[styles.input, {
                color: colors.foreground,
                backgroundColor: colors.secondary,
                borderColor: colors.border,
                borderRadius: colors.radius - 4,
                fontFamily: 'Inter_400Regular',
              }]}
            />
          </View>
        )}

        {/* Card inputs */}
        {selected === 'card' && (
          <View style={[styles.extraCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>Card Number</Text>
            <TextInput
              value={cardNum}
              onChangeText={setCardNum}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor={colors.mutedForeground + '88'}
              keyboardType="number-pad"
              maxLength={19}
              style={[styles.input, {
                color: colors.foreground,
                backgroundColor: colors.secondary,
                borderColor: colors.border,
                borderRadius: colors.radius - 4,
                fontFamily: 'Inter_400Regular',
              }]}
            />
            <View style={styles.cardRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>Expiry</Text>
                <TextInput
                  value={cardExpiry}
                  onChangeText={setCardExpiry}
                  placeholder="MM / YY"
                  placeholderTextColor={colors.mutedForeground + '88'}
                  keyboardType="number-pad"
                  maxLength={5}
                  style={[styles.input, {
                    color: colors.foreground,
                    backgroundColor: colors.secondary,
                    borderColor: colors.border,
                    borderRadius: colors.radius - 4,
                    fontFamily: 'Inter_400Regular',
                  }]}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>CVV</Text>
                <TextInput
                  value={cardCvv}
                  onChangeText={setCardCvv}
                  placeholder="•••"
                  placeholderTextColor={colors.mutedForeground + '88'}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                  style={[styles.input, {
                    color: colors.foreground,
                    backgroundColor: colors.secondary,
                    borderColor: colors.border,
                    borderRadius: colors.radius - 4,
                    fontFamily: 'Inter_400Regular',
                  }]}
                />
              </View>
            </View>
          </View>
        )}

        {/* COD note */}
        {selected === 'cod' && (
          <View style={[styles.noteBox, { backgroundColor: '#FFC10714', borderColor: '#FFC10744', borderRadius: colors.radius }]}>
            <Feather name="info" size={14} color={colors.primary} />
            <Text style={[styles.noteText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              Keep exact change ready. Our delivery partner may not carry change above ₹500.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Continue button */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/checkout/confirm')}
          style={[styles.continueBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
        >
          <Text style={[styles.continueBtnText, { color: colors.primaryForeground ?? '#07111F', fontFamily: 'Inter_700Bold' }]}>
            Review Order
          </Text>
          <Feather name="arrow-right" size={18} color={colors.primaryForeground ?? '#07111F'} />
        </TouchableOpacity>
      </View>
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
              backgroundColor: i === current ? colors.primary : i < current ? colors.primary + '88' : colors.border,
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

  summaryPill: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderWidth: 1 },
  summaryLabel: { fontSize: 12, marginBottom: 2 },
  summaryTotal: { fontSize: 18 },
  lockBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  lockText: { fontSize: 12 },

  methodCard: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  methodIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  methodInfo: { flex: 1 },
  methodLabel: { fontSize: 14 },
  methodSub: { fontSize: 12, marginTop: 2 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5 },

  extraCard: { padding: 14, borderWidth: 1, gap: 12 },
  cardRow: { flexDirection: 'row', gap: 12 },
  fieldLabel: { fontSize: 12, marginBottom: 6 },
  input: { padding: 12, borderWidth: 1, fontSize: 14 },

  noteBox: { flexDirection: 'row', gap: 10, padding: 12, borderWidth: 1, alignItems: 'flex-start' },
  noteText: { flex: 1, fontSize: 13, lineHeight: 19 },

  footer: { padding: 16, borderTopWidth: 1 },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  continueBtnText: { fontSize: 16 },
});
