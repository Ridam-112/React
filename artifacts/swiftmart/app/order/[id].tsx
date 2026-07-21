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
import { router, useLocalSearchParams } from 'expo-router';
import { ORDERS, Order } from '../(tabs)/orders';

const ALL_STEPS = ['Order Placed', 'Processing', 'Out for Delivery', 'Delivered'] as const;

const STATUS_STEP: Record<string, number> = {
  Processing: 1,
  'Out for Delivery': 2,
  Delivered: 3,
  Cancelled: -1,
};

const STATUS_COLORS: Record<string, string> = {
  Delivered: '#4CAF50',
  Processing: '#FFC107',
  'Out for Delivery': '#3B82F6',
  Cancelled: '#EF4444',
};

const STEP_ICONS: Record<string, string> = {
  'Order Placed': 'check-square',
  Processing: 'package',
  'Out for Delivery': 'truck',
  Delivered: 'home',
};

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const order: Order | undefined = ORDERS.find((o) => o.id === id);

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Feather name="alert-circle" size={48} color={colors.mutedForeground} />
          <Text style={[styles.notFoundText, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
            Order not found
          </Text>
        </View>
      </View>
    );
  }

  const currentStep = STATUS_STEP[order.status] ?? 0;
  const isCancelled = order.status === 'Cancelled';
  const statusColor = STATUS_COLORS[order.status];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 16,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
            {order.id}
          </Text>
          <Text style={[styles.headerDate, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            {order.date}
          </Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusColor + '22' }]}>
          <Text style={[styles.statusPillText, { color: statusColor, fontFamily: 'Inter_600SemiBold' }]}>
            {order.status}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Tracking Timeline */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
            {isCancelled ? 'Order Status' : 'Track Your Order'}
          </Text>

          {isCancelled ? (
            <View style={styles.cancelledBox}>
              <View style={[styles.cancelledIcon, { backgroundColor: '#EF444422' }]}>
                <Feather name="x-circle" size={32} color="#EF4444" />
              </View>
              <Text style={[styles.cancelledTitle, { color: '#EF4444', fontFamily: 'Inter_700Bold' }]}>
                Order Cancelled
              </Text>
              <Text style={[styles.cancelledSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                This order was cancelled. Your refund will be processed in 3–5 business days.
              </Text>
            </View>
          ) : (
            <View style={styles.timeline}>
              {ALL_STEPS.map((step, index) => {
                const isCompleted = index <= currentStep;
                const isActive = index === currentStep;
                const isLast = index === ALL_STEPS.length - 1;
                const stepColor = isCompleted ? colors.primary : colors.border;

                return (
                  <View key={step} style={styles.timelineRow}>
                    {/* Connector line + dot column */}
                    <View style={styles.timelineLeft}>
                      <View
                        style={[
                          styles.timelineDot,
                          {
                            backgroundColor: isCompleted ? colors.primary : colors.card,
                            borderColor: stepColor,
                            borderWidth: isActive ? 3 : 2,
                          },
                        ]}
                      >
                        {isCompleted && !isActive && (
                          <Feather name="check" size={10} color={colors.primaryForeground ?? '#07111F'} />
                        )}
                      </View>
                      {!isLast && (
                        <View
                          style={[
                            styles.timelineLine,
                            { backgroundColor: index < currentStep ? colors.primary : colors.border },
                          ]}
                        />
                      )}
                    </View>

                    {/* Step content */}
                    <View style={styles.timelineContent}>
                      <View style={styles.stepRow}>
                        <Feather
                          name={STEP_ICONS[step] as any}
                          size={14}
                          color={isCompleted ? colors.primary : colors.mutedForeground}
                        />
                        <Text
                          style={[
                            styles.stepLabel,
                            {
                              color: isCompleted ? colors.foreground : colors.mutedForeground,
                              fontFamily: isActive ? 'Inter_700Bold' : 'Inter_500Medium',
                            },
                          ]}
                        >
                          {step}
                        </Text>
                        {isActive && order.estimatedTime && (
                          <View style={[styles.etaBadge, { backgroundColor: colors.primary + '22' }]}>
                            <Text style={[styles.etaText, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>
                              {order.estimatedTime}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Delivery Address */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <View style={styles.sectionRow}>
            <Feather name="map-pin" size={16} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
              Delivery Address
            </Text>
          </View>
          <Text style={[styles.addressText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            {order.deliveryAddress}
          </Text>
        </View>

        {/* Items in this Order */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <View style={styles.sectionRow}>
            <Feather name="shopping-bag" size={16} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
              Items ({order.items.length})
            </Text>
          </View>

          {order.items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                index < order.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <View style={[styles.itemImageBox, { backgroundColor: colors.muted, borderRadius: 8 }]}>
                <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
              </View>
              <View style={styles.itemInfo}>
                <Text
                  style={[styles.itemName, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
                <Text style={[styles.itemQty, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                  Qty: {item.qty}  ×  ₹{item.price}
                </Text>
              </View>
              <Text style={[styles.itemTotal, { color: colors.primary, fontFamily: 'Inter_700Bold' }]}>
                ₹{item.qty * item.price}
              </Text>
            </View>
          ))}

          {/* Order total */}
          <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
              Order Total
            </Text>
            <Text style={[styles.totalAmount, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
              ₹{order.total}
            </Text>
          </View>
        </View>

        {/* Help CTA */}
        {!isCancelled && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.helpBtn,
              { borderColor: colors.border, borderRadius: colors.radius, backgroundColor: colors.card },
            ]}
          >
            <Feather name="help-circle" size={16} color={colors.mutedForeground} />
            <Text style={[styles.helpText, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
              Need help with this order?
            </Text>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 15 },
  headerDate: { fontSize: 12, marginTop: 1 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusPillText: { fontSize: 11 },

  section: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
  },
  sectionTitle: { fontSize: 14 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },

  /* Timeline */
  timeline: { paddingTop: 4 },
  timelineRow: { flexDirection: 'row', gap: 14 },
  timelineLeft: { alignItems: 'center', width: 20 },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: { width: 2, flex: 1, minHeight: 28, marginVertical: 3 },
  timelineContent: { flex: 1, paddingBottom: 20 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepLabel: { fontSize: 13 },
  etaBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 4 },
  etaText: { fontSize: 11 },

  /* Cancelled */
  cancelledBox: { alignItems: 'center', paddingVertical: 12, gap: 10 },
  cancelledIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  cancelledTitle: { fontSize: 16 },
  cancelledSub: { fontSize: 13, textAlign: 'center', lineHeight: 20 },

  /* Address */
  addressText: { fontSize: 13, lineHeight: 20 },

  /* Items */
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  itemImageBox: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  itemImage: { width: 42, height: 42 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, lineHeight: 18 },
  itemQty: { fontSize: 12, marginTop: 3 },
  itemTotal: { fontSize: 14 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: { fontSize: 13 },
  totalAmount: { fontSize: 18 },

  /* Help */
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
  },
  helpText: { fontSize: 13 },

  /* Not found */
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  notFoundText: { fontSize: 15 },
});
