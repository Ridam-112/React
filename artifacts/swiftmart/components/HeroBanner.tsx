import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  ViewToken,
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

// Stable outside component — viewabilityConfig must never change reference
const VIEWABILITY_CONFIG = { viewAreaCoveragePercentThreshold: 50 };

export function HeroBanner() {
  const colors = useColors();
  const flatListRef = useRef<FlatList>(null);
  const currentIndexRef = useRef(0);
  const [, setDisplayIndex] = useState(0);

  // One Animated.Value per dot
  const dotAnims = useRef(
    BANNERS.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))
  ).current;

  // Keep animateDots in a ref so the stable onViewableItemsChanged callback
  // can always call the latest version without being recreated itself.
  const animateDotsRef = useRef((idx: number) => {
    dotAnims.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === idx ? 1 : 0,
        useNativeDriver: false,
        speed: 20,
        bounciness: 0,
      }).start();
    });
  });

  // Stable reference — created once, never replaced.
  // FlatList throws if onViewableItemsChanged changes after mount.
  const onViewableItemsChangedRef = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const idx = viewableItems[0]?.index;
      if (idx != null && idx !== currentIndexRef.current) {
        currentIndexRef.current = idx;
        setDisplayIndex(idx);
        animateDotsRef.current(idx);
      }
    }
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (currentIndexRef.current + 1) % BANNERS.length;
      currentIndexRef.current = next;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setDisplayIndex(next);
      animateDotsRef.current(next);
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
        onViewableItemsChanged={onViewableItemsChangedRef.current}
        viewabilityConfig={VIEWABILITY_CONFIG}
        renderItem={({ item }) => (
          <Image
            source={item.image}
            style={[styles.banner, { borderRadius: colors.radius }]}
            resizeMode="cover"
          />
        )}
      />

      {/* Animated page dots */}
      <View style={styles.dots}>
        {BANNERS.map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                width: dotAnims[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [6, 22],
                }),
                opacity: dotAnims[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 1],
                }),
                backgroundColor: colors.primary,
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
