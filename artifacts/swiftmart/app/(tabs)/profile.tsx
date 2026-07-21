import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { NOTIFICATIONS } from '@/constants/data';
import { useAuth } from '@/context/AuthContext';

type MenuItem = { icon: string; label: string; route?: string };

const MENU: MenuItem[] = [
  { icon: 'map-pin',     label: 'Saved Addresses',  route: '/profile/addresses' },
  { icon: 'credit-card', label: 'Payment Methods',  route: '/profile/payment-methods' },
  { icon: 'file-text',   label: 'Order History',    route: '/profile/order-history' },
  { icon: 'bell',        label: 'Notifications',    route: '/notifications' },
  { icon: 'help-circle', label: 'Help & Support',   route: '/profile/help' },
  { icon: 'settings',    label: 'Settings',         route: '/profile/settings' },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, flex: 1 }]}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
            Profile
          </Text>
        </View>
        <View style={styles.guestState}>
          <View style={[styles.guestAvatar, { backgroundColor: colors.muted }]}>
            <Feather name="user" size={40} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.guestTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
            You're browsing as a guest
          </Text>
          <Text style={[styles.guestSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            Sign in to track orders, save addresses, and shop faster.
          </Text>
          <TouchableOpacity
            style={[styles.signInBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
            activeOpacity={0.85}
            onPress={() => router.push('/auth')}
          >
            <Text style={[styles.signInBtnText, { color: colors.primaryForeground, fontFamily: 'Inter_700Bold' }]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.signUpLink]}
            onPress={() => router.push('/auth/email')}
          >
            <Text style={[styles.signUpLinkText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              Don't have an account?{' '}
              <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold' }}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
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
          Profile
        </Text>
      </View>

      {/* Avatar Card */}
      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              {
                color: colors.primaryForeground,
                fontFamily: 'Inter_700Bold',
              },
            ]}
          >
            {user ? user.name.slice(0, 2).toUpperCase() : 'RK'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text
            style={[
              styles.userName,
              { color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
            ]}
          >
            {user?.name ?? 'Rahul Kumar'}
          </Text>
          <Text
            style={[
              styles.userPhone,
              {
                color: colors.mutedForeground,
                fontFamily: 'Inter_400Regular',
              },
            ]}
          >
            {user?.email ?? user?.phone ?? '+91 98765 43210'}
          </Text>
        </View>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={() => router.push('/profile/edit')}>
          <Feather name="edit-2" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View
        style={[
          styles.menuCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        {MENU.map((item, idx) => {
          const isNotif = item.label === 'Notifications';
          return (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                idx < MENU.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
              activeOpacity={0.7}
              onPress={item.route ? () => router.push(item.route as any) : undefined}
            >
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: colors.primary + '20' },
                ]}
              >
                <Feather name={item.icon as any} size={18} color={colors.primary} />
              </View>
              <Text
                style={[
                  styles.menuLabel,
                  { color: colors.foreground, fontFamily: 'Inter_500Medium' },
                ]}
              >
                {item.label}
              </Text>
              {isNotif && unreadCount > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: '#EF4444' }]}>
                  <Text style={[styles.unreadText, { fontFamily: 'Inter_700Bold' }]}>
                    {unreadCount}
                  </Text>
                </View>
              )}
              <Feather
                name="chevron-right"
                size={18}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        style={[
          styles.signOutBtn,
          {
            backgroundColor: colors.destructive + '18',
            borderColor: colors.destructive + '50',
            borderRadius: colors.radius,
          },
        ]}
        activeOpacity={0.8}
        onPress={handleSignOut}
        disabled={signingOut}
      >
        {signingOut ? (
          <ActivityIndicator size="small" color={colors.destructive} />
        ) : (
          <Feather name="log-out" size={18} color={colors.destructive} />
        )}
        <Text
          style={[
            styles.signOutText,
            {
              color: colors.destructive,
              fontFamily: 'Inter_600SemiBold',
            },
          ]}
        >
          {signingOut ? 'Signing out…' : 'Sign Out'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 22 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20 },
  userInfo: { flex: 1 },
  userName: { fontSize: 16 },
  userPhone: { fontSize: 13, marginTop: 3 },
  menuCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15 },
  unreadBadge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 20, minWidth: 22, alignItems: 'center', marginRight: 4,
  },
  unreadText: { fontSize: 11, color: '#fff' },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginHorizontal: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  signOutText: { fontSize: 15 },

  // Guest state
  guestState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
    marginTop: -40,
  },
  guestAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  guestTitle: { fontSize: 18, textAlign: 'center' },
  guestSub: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 8 },
  signInBtn: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
  },
  signInBtnText: { fontSize: 16 },
  signUpLink: { paddingVertical: 8 },
  signUpLinkText: { fontSize: 14 },
});
