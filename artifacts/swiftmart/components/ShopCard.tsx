import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { Shop } from '@/constants/data';

type Props = { shop: Shop };

export function ShopCard({ shop }: Props) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
      activeOpacity={0.8}
    >
      <Image
        source={shop.image}
        style={[styles.image, { borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius }]}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text
          style={[
            styles.name,
            { color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
          ]}
          numberOfLines={1}
        >
          {shop.name}
        </Text>
        <Text
          style={[
            styles.category,
            {
              color: colors.mutedForeground,
              fontFamily: 'Inter_400Regular',
            },
          ]}
        >
          {shop.category}
        </Text>
        <View style={styles.meta}>
          <View style={styles.chip}>
            <MaterialCommunityIcons name="star" size={11} color="#FFC107" />
            <Text
              style={[
                styles.chipText,
                {
                  color: colors.foreground,
                  fontFamily: 'Inter_500Medium',
                },
              ]}
            >
              {shop.rating}
            </Text>
          </View>
          <View style={[styles.chip, { backgroundColor: colors.primary + '20' }]}>
            <MaterialCommunityIcons
              name="clock-fast"
              size={11}
              color={colors.primary}
            />
            <Text
              style={[
                styles.chipText,
                { color: colors.primary, fontFamily: 'Inter_500Medium' },
              ]}
            >
              {shop.deliveryTime}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 155, borderWidth: 1, overflow: 'hidden' },
  image: { width: '100%', height: 100 },
  info: { padding: 10, gap: 3 },
  name: { fontSize: 13 },
  category: { fontSize: 11 },
  meta: { flexDirection: 'row', gap: 6, marginTop: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF15',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 20,
  },
  chipText: { fontSize: 11 },
});
