import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { CATEGORIES } from '@/constants/data';

export default function CategoriesScreen() {
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
          All Categories
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' },
          ]}
        >
          Browse {CATEGORIES.length} categories
        </Text>
      </View>

      <FlatList
        data={CATEGORIES}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        columnWrapperStyle={{ gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
                flex: 1,
              },
            ]}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: item.color + '25' },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={30}
                color={item.color}
              />
            </View>
            <Text
              style={[
                styles.catName,
                { color: colors.foreground, fontFamily: 'Inter_500Medium' },
              ]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.catShops,
                {
                  color: colors.mutedForeground,
                  fontFamily: 'Inter_400Regular',
                },
              ]}
            >
              {item.shops}+ shops
            </Text>
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
  subtitle: { fontSize: 13, marginTop: 2 },
  card: {
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  catName: { fontSize: 12, textAlign: 'center' },
  catShops: { fontSize: 10, marginTop: 3 },
});
