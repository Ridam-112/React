import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

type Order = {
  id: string;
  date: string;
  items: string;
  total: number;
  status: 'Delivered' | 'Processing' | 'Cancelled';
};

const ORDERS: Order[] = [
  {
    id: '1',
    date: 'Today, 10:32 AM',
    items: 'Fresh Apples, Whole Milk',
    total: 141,
    status: 'Delivered',
  },
  {
    id: '2',
    date: 'Yesterday, 7:15 PM',
    items: 'Brown Bread, Paracetamol 500mg',
    total: 70,
    status: 'Delivered',
  },
  {
    id: '3',
    date: 'Dec 18, 2:40 PM',
    items: 'Chicken Biryani',
    total: 176,
    status: 'Cancelled',
  },
];

const STATUS_COLORS: Record<string, string> = {
  Delivered: '#4CAF50',
  Processing: '#FFC107',
  Cancelled: '#EF4444',
};

export default function OrdersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          My Orders
        </Text>
      </View>

      <FlatList
        data={ORDERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="file-text" size={64} color={colors.mutedForeground} />
            <Text
              style={[
                styles.emptyText,
                {
                  color: colors.mutedForeground,
                  fontFamily: 'Inter_500Medium',
                },
              ]}
            >
              No orders yet
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.orderCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
            activeOpacity={0.8}
          >
            <View style={styles.orderTop}>
              <Text
                style={[
                  styles.orderDate,
                  {
                    color: colors.mutedForeground,
                    fontFamily: 'Inter_400Regular',
                  },
                ]}
              >
                {item.date}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: STATUS_COLORS[item.status] + '25',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: STATUS_COLORS[item.status],
                      fontFamily: 'Inter_600SemiBold',
                    },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.orderItems,
                { color: colors.foreground, fontFamily: 'Inter_500Medium' },
              ]}
              numberOfLines={2}
            >
              {item.items}
            </Text>
            <View style={styles.orderBottom}>
              <Text
                style={[
                  styles.orderTotal,
                  { color: colors.primary, fontFamily: 'Inter_700Bold' },
                ]}
              >
                ₹{item.total}
              </Text>
              <TouchableOpacity
                style={[
                  styles.reorderBtn,
                  {
                    borderColor: colors.primary,
                    borderRadius: colors.radius - 6,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.reorderText,
                    { color: colors.primary, fontFamily: 'Inter_500Medium' },
                  ]}
                >
                  Reorder
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 22 },
  emptyState: { alignItems: 'center', marginTop: 80, gap: 12 },
  emptyText: { fontSize: 16 },
  orderCard: { padding: 14, borderWidth: 1 },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderDate: { fontSize: 12 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { fontSize: 12 },
  orderItems: { fontSize: 14, lineHeight: 20 },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  orderTotal: { fontSize: 18 },
  reorderBtn: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  reorderText: { fontSize: 13 },
});
