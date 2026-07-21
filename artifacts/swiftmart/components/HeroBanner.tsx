import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { useColors } from '@/hooks/useColors';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;
const BANNER_HEIGHT = 175;
const ITEM_SIZE = BANNER_WIDTH + 12; // banner + gap

const BANNERS = [
  { id: '1', image: require('@/assets/images/banner1.png') },
  { id: '2', image: require('@/assets/images/banner2.png') },
  { id: '3', image: require('@/assets/images/banner3.png') },
];

export function HeroBanner() {
  const colors = useColors();
  const flatListRef = useRef<FlatList>(null);
  const currentIndexRef = useRef(0);
  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (currentIndexRef.current + 1) % BANNERS.length;
      currentIndexRef.current = next;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setDisplayIndex(next);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={BANNERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        onScrollToIndexFailed={() => {}}
        getItemLayout={(_, index) => ({
          length: ITEM_SIZE,
          offset: ITEM_SIZE * index,
          index,
        })}
        onViewableItemsChanged={({ viewableItems }) => {
          const idx = viewableItems[0]?.index;
          if (idx != null) {
            currentIndexRef.current = idx;
            setDisplayIndex(idx);
          }
        }}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <Image
            source={item.image}
            style={[styles.banner, { borderRadius: colors.radius }]}
            resizeMode="cover"
          />
        )}
      />
      {/* Page Dots */}
      <View style={styles.dots}>
        {BANNERS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === displayIndex ? colors.primary : colors.border,
                width: i === displayIndex ? 20 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 8 },
  banner: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
