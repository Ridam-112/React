import React, { useState, useCallback, useRef } from 'react';
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { AppNotification, NotificationKind } from '@/constants/data';
import { useNotifications } from '@/context/NotificationContext';

/* ─── Icon config per kind ──────────────────────────────────────── */
type IconConfig = { name: string; bg: string; fg: string };

function getIconConfig(kind: NotificationKind, primary: string): IconConfig {
  switch (kind) {
    case 'delivery': return { name: 'truck-delivery',    bg: '#3B82F6', fg: '#fff' };
    case 'order':    return { name: 'receipt',           bg: '#10B981', fg: '#fff' };
    case 'offer':    return { name: 'tag-outline',       bg: primary,   fg: '#fff' };
    case 'system':   return { name: 'bell-ring-outline', bg: '#8B5CF6', fg: '#fff' };
    default:         return { name: 'bell-outline',      bg: '#6B7280', fg: '#fff' };
  }
}

/* ─── Filter tabs ───────────────────────────────────────────────── */
const TABS = [
  { key: 'all',      label: 'All' },
  { key: 'order',    label: 'Orders' },
  { key: 'offer',    label: 'Offers' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'system',   label: 'System' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

/* ─── Single notification row ───────────────────────────────────── */
function NotifRow({
  item,
  onMarkRead,
}: {
  item: AppNotification;
  onMarkRead: (id: string) => void;
}) {
  const colors = useColors();
  const cfg = getIconConfig(item.kind, colors.primary);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onMarkRead(item.id)}
      style={[
        styles.row,
        {
          backgroundColor: item.read ? colors.card : colors.primary + '0D',
          borderColor: item.read ? colors.border : colors.primary + '30',
          borderRadius: colors.radius,
        },
      ]}
    >
      {/* Unread dot */}
      {!item.read && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}

      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
        <MaterialCommunityIcons name={cfg.name as any} size={18} color={cfg.fg} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              {
                color: colors.foreground,
                fontFamily: item.read ? 'Inter_500Medium' : 'Inter_700Bold',
                flex: 1,
              },
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.time,
              { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' },
            ]}
          >
            {item.time}
          </Text>
        </View>

        <Text
          style={[
            styles.bodyText,
            { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' },
          ]}
          numberOfLines={2}
        >
          {item.body}
        </Text>

        {item.actionLabel && item.actionRoute && (
          <TouchableOpacity
            onPress={() => {
              onMarkRead(item.id);
              router.push(item.actionRoute as any);
            }}
            style={[
              styles.actionBtn,
              { borderColor: colors.primary + '60', backgroundColor: colors.primary + '12' },
            ]}
          >
            <Text style={[styles.actionText, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>
              {item.actionLabel}
            </Text>
            <Feather name="arrow-right" size={12} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

/* ─── Screen ────────────────────────────────────────────────────── */
export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const filtered =
    activeTab === 'all' ? notifications : notifications.filter((n) => n.kind === activeTab);

  /* ── Auto-mark-read when item scrolls into view ── */
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      viewableItems.forEach((vi) => {
        const n = vi.item as AppNotification;
        if (vi.isViewable && !n.read) {
          markRead(n.id);
        }
      });
    },
    [markRead]
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  /* ── Empty state ── */
  const EmptyState = (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
        <MaterialCommunityIcons name="bell-sleep-outline" size={40} color={colors.mutedForeground} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
        All caught up!
      </Text>
      <Text style={[styles.emptyBody, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
        No {activeTab === 'all' ? '' : activeTab + ' '}notifications yet.
      </Text>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} translucent={false} />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'android' ? 12 : 12) }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View style={[styles.headerBadge, { backgroundColor: '#EF4444' }]}>
              <Text style={[styles.headerBadgeText, { fontFamily: 'Inter_700Bold' }]}>
                {unreadCount}
              </Text>
            </View>
          )}
        </View>

        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[styles.markAll, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>
              Mark all read
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      {/* ── Filter tabs ── */}
      <FlatList
        data={TABS as unknown as typeof TABS[number][]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(t) => t.key}
        contentContainerStyle={styles.tabsContainer}
        style={[styles.tabsRow, { borderBottomColor: colors.border }]}
        renderItem={({ item: tab }) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              onPress={() => setActiveTab(tab.key as TabKey)}
              style={[
                styles.tab,
                { borderBottomColor: active ? colors.primary : 'transparent' },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: active ? colors.primary : colors.mutedForeground,
                    fontFamily: active ? 'Inter_600SemiBold' : 'Inter_400Regular',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* ── List ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotifRow item={item} onMarkRead={markRead} />}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 32 },
          filtered.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyState}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20 },
  headerBadge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 20, minWidth: 22, alignItems: 'center',
  },
  headerBadgeText: { fontSize: 11, color: '#fff' },
  markAll: { fontSize: 13 },

  tabsRow: { borderBottomWidth: 1, maxHeight: 44, flexShrink: 0 },
  tabsContainer: { paddingHorizontal: 12 },
  tab: {
    paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 2,
  },
  tabText: { fontSize: 13 },

  list: { paddingHorizontal: 16, paddingTop: 12 },
  listEmpty: { flex: 1, justifyContent: 'center' },

  row: {
    flexDirection: 'row',
    padding: 14,
    borderWidth: 1,
    gap: 12,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    left: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  body: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 14 },
  time: { fontSize: 11, flexShrink: 0 },
  bodyText: { fontSize: 13, lineHeight: 18 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  actionText: { fontSize: 12 },

  empty: { alignItems: 'center', gap: 12, paddingVertical: 48 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: 18 },
  emptyBody: { fontSize: 14 },
});
