import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { SHOPS, Shop } from '@/constants/data';

const { width: SCREEN_W } = Dimensions.get('window');
const H_PAD = 16;
const COL_GAP = 12;
const CARD_W = Math.floor((SCREEN_W - H_PAD * 2 - COL_GAP) / 2);

function ShopGridCard({ shop }: { shop: Shop }) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, width: CARD_W }]}
      activeOpacity={0.85}
      onPress={() => router.push(`/shop/${shop.id}`)}
    >
      <Image
        source={shop.image}
        style={[styles.cardImage, { borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius }]}
        resizeMode="cover"
      />
      <View style={styles.cardInfo}>
        <Text style={[styles.shopName, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]} numberOfLines={1}>
          {shop.name}
        </Text>
        <Text style={[styles.shopCategory, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          {shop.category}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.chip}>
            <MaterialCommunityIcons name="star" size={11} color="#FFC107" />
            <Text style={[styles.chipText, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>
              {shop.rating}
            </Text>
          </View>
          <View style={[styles.chip, { backgroundColor: colors.primary + '20' }]}>
            <Feather name="package" size={10} color={colors.primary} />
            <Text style={[styles.chipText, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>
              {shop.productCategories.length} dept{shop.productCategories.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        {shop.category !== 'Pharmacy' && (
          <View style={[styles.fssaiBadge, { backgroundColor: '#0a7c3e' }]}>
            <MaterialCommunityIcons name="check-decagram" size={10} color="#fff" />
            <Text style={[styles.fssaiText, { fontFamily: 'Inter_600SemiBold' }]}>FSSAI</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ShopsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          All Shops
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={SHOPS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ShopGridCard shop={item} />}
        contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 32 }]}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={[styles.subheading, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            {SHOPS.length} shops near Balurghat
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PAD,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 20 },
  subheading: { fontSize: 13, paddingHorizontal: H_PAD, paddingBottom: 12 },
  grid: { paddingHorizontal: H_PAD, paddingTop: 8 },
  columnWrapper: { gap: COL_GAP, marginBottom: COL_GAP },

  card: { borderWidth: 1, overflow: 'hidden' },
  cardImage: { width: '100%', height: 100 },
  cardInfo: { padding: 10, gap: 4 },
  shopName: { fontSize: 14 },
  shopCategory: { fontSize: 11 },
  metaRow: { flexDirection: 'row', gap: 6, marginTop: 2 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#FFFFFF15', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 20,
  },
  chipText: { fontSize: 11 },
  fssaiBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 20, marginTop: 2,
  },
  fssaiText: { fontSize: 10, color: '#fff' },
});
