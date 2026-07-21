import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

type MenuItem = { icon: string; label: string };

const MENU: MenuItem[] = [
  { icon: 'map-pin', label: 'Saved Addresses' },
  { icon: 'credit-card', label: 'Payment Methods' },
  { icon: 'file-text', label: 'Order History' },
  { icon: 'bell', label: 'Notifications' },
  { icon: 'help-circle', label: 'Help & Support' },
  { icon: 'settings', label: 'Settings' },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

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
            RK
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text
            style={[
              styles.userName,
              { color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
            ]}
          >
            Rahul Kumar
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
            +91 98765 43210
          </Text>
        </View>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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
        {MENU.map((item, idx) => (
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
            <Feather
              name="chevron-right"
              size={18}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        ))}
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
      >
        <Feather name="log-out" size={18} color={colors.destructive} />
        <Text
          style={[
            styles.signOutText,
            {
              color: colors.destructive,
              fontFamily: 'Inter_600SemiBold',
            },
          ]}
        >
          Sign Out
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
});
