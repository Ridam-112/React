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
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';
import { ImageSourcePropType } from 'react-native';

export type OrderItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
  image: ImageSourcePropType;
};

export type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Delivered' | 'Processing' | 'Out for Delivery' | 'Cancelled';
  deliveryAddress: string;
  estimatedTime?: string;
};

export const ORDERS: Order[] = [
  {
    id: 'ORD-1024',
    date: 'Today, 10:32 AM',
    deliveryAddress: '12, Green Valley, Mumbai 400001',
    estimatedTime: 'Delivered',
    status: 'Delivered',
    total: 364,
    items: [
      {
        id: 'p1',
        name: 'Fresh Apples (1 kg)',
        qty: 2,
        price: 120,
        image: require('@/assets/images/product1.png'),
      },
      {
        id: 'p2',
        name: 'Whole Milk 1L',
        qty: 1,
        price: 68,
        image: require('@/assets/images/product1.png'),
      },
      {
        id: 'p3',
        name: 'Brown Bread',
        qty: 1,
        price: 56,
        image: require('@/assets/images/product1.png'),
      },
    ],
  },
  {
    id: 'ORD-1023',
    date: 'Yesterday, 7:15 PM',
    deliveryAddress: '12, Green Valley, Mumbai 400001',
    status: 'Out for Delivery',
    estimatedTime: '20–30 min',
    total: 246,
    items: [
      {
        id: 'p4',
        name: 'Paracetamol 500mg × 10',
        qty: 2,
        price: 34,
        image: require('@/assets/images/product1.png'),
      },
      {
        id: 'p5',
        name: 'Hand Sanitizer 500ml',
        qty: 1,
        price: 89,
        image: require('@/assets/images/product1.png'),
      },
      {
        id: 'p6',
        name: 'Vitamin C Tablets',
        qty: 1,
        price: 89,
        image: require('@/assets/images/product1.png'),
      },
    ],
  },
  {
    id: 'ORD-1021',
    date: 'Dec 18, 2:40 PM',
    deliveryAddress: '12, Green Valley, Mumbai 400001',
    status: 'Cancelled',
    total: 352,
    items: [
      {
        id: 'p7',
        name: 'Chicken Biryani',
        qty: 2,
        price: 176,
        image: require('@/assets/images/product1.png'),
      },
    ],
  },
  {
    id: 'ORD-1020',
    date: 'Dec 15, 11:00 AM',
    deliveryAddress: '12, Green Valley, Mumbai 400001',
    status: 'Processing',
    estimatedTime: '45–60 min',
    total: 519,
    items: [
      {
        id: 'p8',
        name: 'Basmati Rice 5kg',
        qty: 1,
        price: 320,
        image: require('@/assets/images/product1.png'),
      },
      {
        id: 'p9',
        name: 'Sunflower Oil 1L',
        qty: 1,
        price: 145,
        image: require('@/assets/images/product1.png'),
      },
      {
        id: 'p10',
        name: 'Turmeric Powder 100g',
        qty: 2,
        price: 27,
        image: require('@/assets/images/product1.png'),
      },
    ],
  },
];

const STATUS_COLORS: Record<string, string> = {
  Delivered: '#4CAF50',
  Processing: '#FFC107',
  'Out for Delivery': '#3B82F6',
  Cancelled: '#EF4444',
};

const STATUS_ICONS: Record<string, string> = {
  Delivered: 'check-circle',
  Processing: 'clock',
  'Out for Delivery': 'truck',
  Cancelled: 'x-circle',
};

export default function OrdersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const renderOrderBucket = ({ item }: { item: Order }) => {
    const statusColor = STATUS_COLORS[item.status];
    const statusIcon = STATUS_ICONS[item.status] as any;
    const previewItems = item.items.slice(0, 2);
    const remaining = item.items.length - 2;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push(`/order/${item.id}`)}
        style={[
          styles.bucket,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        {/* Bucket Header */}
        <View
          style={[
            styles.bucketHeader,
            {
              borderBottomColor: colors.border,
              backgroundColor: colors.secondary + 'CC',
              borderTopLeftRadius: colors.radius,
              borderTopRightRadius: colors.radius,
            },
          ]}
        >
          <View>
            <Text style={[styles.orderId, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
              {item.id}
            </Text>
            <Text style={[styles.orderDate, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              {item.date}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
            <Feather name={statusIcon} size={12} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor, fontFamily: 'Inter_600SemiBold' }]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Product rows */}
        <View style={styles.itemsContainer}>
          {previewItems.map((product, index) => (
            <View
              key={product.id}
              style={[
                styles.productRow,
                index < previewItems.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View style={[styles.productImageBox, { backgroundColor: colors.muted, borderRadius: 8 }]}>
                <Image source={product.image} style={styles.productImage} resizeMode="cover" />
              </View>
              <View style={styles.productInfo}>
                <Text
                  style={[styles.productName, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}
                  numberOfLines={1}
                >
                  {product.name}
                </Text>
                <Text style={[styles.productQty, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                  Qty: {product.qty}
                </Text>
              </View>
              <Text style={[styles.productPrice, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>
                ₹{product.price * product.qty}
              </Text>
            </View>
          ))}

          {remaining > 0 && (
            <View style={[styles.moreRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <Text style={[styles.moreText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                +{remaining} more item{remaining > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Bucket Footer */}
        <View
          style={[
            styles.bucketFooter,
            {
              borderTopColor: colors.border,
              borderBottomLeftRadius: colors.radius,
              borderBottomRightRadius: colors.radius,
            },
          ]}
        >
          <View>
            <Text style={[styles.totalLabel, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              Order Total
            </Text>
            <Text style={[styles.totalAmount, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
              ₹{item.total}
            </Text>
          </View>
          <View style={styles.trackRow}>
            <Text style={[styles.trackText, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>
              {item.status === 'Cancelled' ? 'View Details' : 'Track Order'}
            </Text>
            <Feather name="chevron-right" size={16} color={colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          My Orders
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          {ORDERS.length} order{ORDERS.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={ORDERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="shopping-bag" size={64} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
              No orders yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              Your past orders will appear here
            </Text>
          </View>
        }
        renderItem={renderOrderBucket}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 22 },
  subtitle: { fontSize: 13, marginTop: 2 },

  bucket: { borderWidth: 1, overflow: 'hidden' },

  bucketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  orderId: { fontSize: 14 },
  orderDate: { fontSize: 12, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: { fontSize: 12 },

  itemsContainer: {},
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  productImageBox: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  productImage: { width: 38, height: 38 },
  productInfo: { flex: 1 },
  productName: { fontSize: 13 },
  productQty: { fontSize: 12, marginTop: 2 },
  productPrice: { fontSize: 13 },

  moreRow: { paddingHorizontal: 14, paddingVertical: 8 },
  moreText: { fontSize: 12 },

  bucketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  totalLabel: { fontSize: 11 },
  totalAmount: { fontSize: 17, marginTop: 1 },
  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trackText: { fontSize: 13 },

  emptyState: { alignItems: 'center', marginTop: 100, gap: 10 },
  emptyTitle: { fontSize: 17 },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
});
