import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { Category } from '@/constants/data';

type Props = {
  category: Category;
  onPress?: () => void;
};

export function CategoryItem({ category, onPress }: Props) {
  const colors = useColors();
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: category.color + '25',
            borderColor: category.color + '50',
          },
        ]}
      >
        <MaterialCommunityIcons
          name={category.icon as any}
          size={26}
          color={category.color}
        />
      </View>
      <Text
        style={[
          styles.name,
          { color: colors.foreground, fontFamily: 'Inter_500Medium' },
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
      <Text
        style={[
          styles.shops,
          { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' },
        ]}
      >
        {category.shops}+ shops
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 76,
  },
  iconWrapper: {
    width: 62,
    height: 62,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 7,
  },
  name: { fontSize: 11, textAlign: 'center' },
  shops: { fontSize: 10, textAlign: 'center', marginTop: 2 },
});
