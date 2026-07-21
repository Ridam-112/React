import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useColors';

type Props = {
  title: string;
  onSeeAll?: () => void;
};

export function SectionHeader({ title, onSeeAll }: Props) {
  const colors = useColors();
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
        ]}
      >
        {title}
      </Text>
      <TouchableOpacity onPress={onSeeAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text
          style={[
            styles.seeAll,
            { color: colors.primary, fontFamily: 'Inter_500Medium' },
          ]}
        >
          See All
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 18 },
  seeAll: { fontSize: 13 },
});
