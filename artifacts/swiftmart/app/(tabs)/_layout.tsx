import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';

const TAB_H = 64;
const FLOAT_BOTTOM = 16;
const FLOAT_H = 16; // horizontal margin on each side

function SwiftMartTabs() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();

  // Bottom of floating bar sits FLOAT_BOTTOM above the safe-area edge
  const bottomOffset = insets.bottom > 0 ? insets.bottom + FLOAT_BOTTOM - 8 : FLOAT_BOTTOM;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          position: 'absolute',
          bottom: bottomOffset,
          left: FLOAT_H,
          right: FLOAT_H,
          height: TAB_H,
          backgroundColor: colors.card,
          borderRadius: 28,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: colors.border,
          paddingBottom: 6,
          paddingTop: 8,
          // Shadows
          elevation: 24,
          shadowColor: '#000000',
          shadowOpacity: 0.55,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 8 },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter_500Medium',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Category',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-grid-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={styles.cartBtnOuter}>
              <View
                style={[
                  styles.cartBtn,
                  {
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="cart-outline"
                  size={26}
                  color={colors.primaryForeground}
                />
                {itemCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>
                      {itemCount > 9 ? '9+' : itemCount}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => (
            <Feather name="file-text" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return <SwiftMartTabs />;
}

const styles = StyleSheet.create({
  cartBtnOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
  },
  cartBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
  },
});
