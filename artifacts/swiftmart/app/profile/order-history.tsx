import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';
import { ORDERS } from '../(tabs)/orders';

const FILTERS = ['All', 'Delivered', 'Processing', 'Out for Delivery', 'Cancelled'] as const;
type Filter = typeof FILTERS[number];

const STATUS_COLORS: Record<string, string> = {
  Delivered: '#4CAF50', Processing: '#FFC107',
  'Out for Delivery': '#3B82F6', Cancelled: '#EF4444',
};
const STATUS_ICONS: Record<string, string> = {
  Delivered: 'check-circle', Processing: 'clock',
  'Out for Delivery': 'truck', Cancelled: 'x-circle',
};

export default function OrderHistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = filter === 'All' ? ORDERS : ORDERS.filter((o) => o.status === filter);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          Order History
        </Text>
        <Text style={[styles.count, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          {filtered.length} orders
        </Text>
      </View>

      {/* Filter chips */}
      <FlatList
        data={FILTERS as unknown as Filter[]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(f) => f}
        contentContainerStyle={styles.filterList}
        renderItem={({ item: f }) => (
          <TouchableOpacity
            onPress={() => setFilter(f)}
            style={[styles.chip, {
              backgroundColor: filter === f ? colors.primary : colors.card,
              borderColor: filter === f ? colors.primary : colors.border,
              borderRadius: 20,
            }]}
          >
            <Text style={[styles.chipText, {
              color: filter === f ? (colors.primaryForeground ?? '#07111F') : colors.mutedForeground,
              fontFamily: filter === f ? 'Inter_600SemiBold' : 'Inter_400Regular',
            }]}>{f}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="file-text" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
              No {filter !== 'All' ? filter.toLowerCase() : ''} orders
            </Text>
          </View>
        }
        renderItem={({ item: order }) => {
          const sc = STATUS_COLORS[order.status];
          const si = STATUS_ICONS[order.status] as any;
          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push(`/order/${order.id}`)}
              style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
            >
              <View style={styles.orderTop}>
                <View>
                  <Text style={[styles.orderId, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>{order.id}</Text>
                  <Text style={[styles.orderDate, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>{order.date}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: sc + '22' }]}>
                  <Feather name={si} size={11} color={sc} />
                  <Text style={[styles.badgeText, { color: sc, fontFamily: 'Inter_600SemiBold' }]}>{order.status}</Text>
                </View>
              </View>
              <Text style={[styles.items, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]} numberOfLines={1}>
                {order.items.map((i) => i.name).join(' · ')}
              </Text>
              <View style={[styles.orderBottom, { borderTopColor: colors.border }]}>
                <Text style={[styles.total, { color: colors.primary, fontFamily: 'Inter_700Bold' }]}>₹{order.total}</Text>
                <View style={styles.viewRow}>
                  <Text style={[styles.viewText, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>View Details</Text>
                  <Feather name="chevron-right" size={14} color={colors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 10 },
  backBtn: { padding: 4 },
  title: { flex: 1, fontSize: 18 },
  count: { fontSize: 13 },
  filterList: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1 },
  chipText: { fontSize: 13 },
  orderCard: { padding: 14, borderWidth: 1 },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  orderId: { fontSize: 14 },
  orderDate: { fontSize: 12, marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { fontSize: 11 },
  items: { fontSize: 13, marginBottom: 10 },
  orderBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: 10 },
  total: { fontSize: 17 },
  viewRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  viewText: { fontSize: 13 },
  empty: { alignItems: 'center', marginTop: 80, gap: 10 },
  emptyText: { fontSize: 15 },
});
