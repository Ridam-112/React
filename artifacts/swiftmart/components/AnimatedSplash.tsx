import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
} from 'react-native';

const { width: W } = Dimensions.get('window');

interface Props {
  ready: boolean;
  onDone: () => void;
}

export default function AnimatedSplash({ ready, onDone }: Props) {
  // --- entry animations ---
  const logoScale   = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringScale1  = useRef(new Animated.Value(0)).current;
  const ringOpacity1= useRef(new Animated.Value(0)).current;
  const ringScale2  = useRef(new Animated.Value(0)).current;
  const ringOpacity2= useRef(new Animated.Value(0)).current;
  const tagOpacity  = useRef(new Animated.Value(0)).current;
  const tagY        = useRef(new Animated.Value(12)).current;
  const dot1        = useRef(new Animated.Value(0.3)).current;
  const dot2        = useRef(new Animated.Value(0.3)).current;
  const dot3        = useRef(new Animated.Value(0.3)).current;

  // --- exit animation ---
  const wrapOpacity = useRef(new Animated.Value(1)).current;
  const wrapScale   = useRef(new Animated.Value(1)).current;

  const native = Platform.OS !== 'web';

  /* ── Entry sequence ─────────────────────────────────────────── */
  useEffect(() => {
    // 1. Logo scales in with a spring
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: native,
        tension: 60,
        friction: 7,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: native,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start(() => {
      // 2. First pulse ring
      Animated.parallel([
        Animated.timing(ringScale1, {
          toValue: 2.0,
          duration: 700,
          useNativeDriver: native,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(ringOpacity1, {
          toValue: 0,
          duration: 700,
          useNativeDriver: native,
        }),
      ]).start();

      // 3. Second ring slightly delayed
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(ringScale2, {
            toValue: 2.4,
            duration: 800,
            useNativeDriver: native,
            easing: Easing.out(Easing.quad),
          }),
          Animated.timing(ringOpacity2, {
            toValue: 0,
            duration: 800,
            useNativeDriver: native,
          }),
        ]).start();
      }, 150);

      // 4. Tagline slides up
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(tagOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: native,
            easing: Easing.out(Easing.cubic),
          }),
          Animated.timing(tagY, {
            toValue: 0,
            duration: 400,
            useNativeDriver: native,
            easing: Easing.out(Easing.cubic),
          }),
        ]).start();
      }, 200);

      // 5. Loading dots bounce loop
      setTimeout(() => startDots(), 500);
    });
  }, []);

  function startDots() {
    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 380,
            useNativeDriver: native,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 380,
            useNativeDriver: native,
            easing: Easing.inOut(Easing.ease),
          }),
        ]),
      );
    Animated.parallel([
      pulse(dot1, 0),
      pulse(dot2, 130),
      pulse(dot3, 260),
    ]).start();
  }

  /* ── Exit sequence when ready ────────────────────────────────── */
  useEffect(() => {
    if (!ready) return;
    // Brief pause so user sees the loaded state, then fade + scale out
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(wrapOpacity, {
          toValue: 0,
          duration: 420,
          useNativeDriver: native,
          easing: Easing.in(Easing.cubic),
        }),
        Animated.timing(wrapScale, {
          toValue: 1.06,
          duration: 420,
          useNativeDriver: native,
          easing: Easing.in(Easing.cubic),
        }),
      ]).start(() => onDone());
    }, 300);
    return () => clearTimeout(timer);
  }, [ready]);

  const RING_SIZE = 120;

  return (
    <Animated.View
      style={[
        styles.root,
        { opacity: wrapOpacity, transform: [{ scale: wrapScale }] },
      ]}
      pointerEvents="none"
    >
      {/* Subtle radial glow */}
      <View style={styles.glow} />

      {/* Pulse rings */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: RING_SIZE,
            height: RING_SIZE,
            borderRadius: RING_SIZE / 2,
            transform: [{ scale: ringScale1 }],
            opacity: ringOpacity1,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: RING_SIZE,
            height: RING_SIZE,
            borderRadius: RING_SIZE / 2,
            transform: [{ scale: ringScale2 }],
            opacity: ringOpacity2,
          },
        ]}
      />

      {/* Logo */}
      <Animated.View
        style={{
          transform: [{ scale: logoScale }],
          opacity: logoOpacity,
          alignItems: 'center',
        }}
      >
        <Image
          source={require('@/assets/images/swiftmart-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Tagline */}
      <Animated.View
        style={{
          opacity: tagOpacity,
          transform: [{ translateY: tagY }],
          alignItems: 'center',
          marginTop: 16,
        }}
      >
        <Text style={styles.tagline}>Groceries, delivered in minutes.</Text>
      </Animated.View>

      {/* Loading dots */}
      <Animated.View
        style={[styles.dotsRow, { opacity: tagOpacity }]}
      >
        {[dot1, dot2, dot3].map((d, i) => (
          <Animated.View
            key={i}
            style={[styles.dot, { opacity: d }]}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#07111F',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#FFC107',
    opacity: 0.04,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: '#FFC107',
  },
  logo: {
    width: 200,
    height: 74,
  },
  tagline: {
    color: '#FFFFFF88',
    fontSize: 14,
    letterSpacing: 0.3,
    fontFamily: 'Inter_400Regular',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 48,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFC107',
  },
});
