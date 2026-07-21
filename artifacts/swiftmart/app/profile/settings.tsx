import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';

type Toggle = {
  id: string; label: string; sub: string; icon: string; value: boolean;
};
type Section = { title: string; items: Toggle[] };

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [sections, setSections] = useState<Section[]>([
    {
      title: 'Notifications',
      items: [
        { id: 'order_updates', label: 'Order Updates', sub: 'Get notified about your order status', icon: 'package', value: true },
        { id: 'offers', label: 'Offers & Deals', sub: 'Promotions, flash deals and coupons', icon: 'tag', value: true },
        { id: 'delivery', label: 'Delivery Alerts', sub: 'When your rider is nearby or arriving', icon: 'truck', value: true },
        { id: 'system', label: 'App Announcements', sub: 'New features and service updates', icon: 'bell', value: false },
      ],
    },
    {
      title: 'Privacy',
      items: [
        { id: 'location', label: 'Location Access', sub: 'Allow app to detect your location', icon: 'map-pin', value: true },
        { id: 'analytics', label: 'Usage Analytics', sub: 'Help improve SwiftMart anonymously', icon: 'bar-chart-2', value: false },
        { id: 'personalised', label: 'Personalised Ads', sub: 'See ads relevant to your interests', icon: 'target', value: false },
      ],
    },
    {
      title: 'Orders & Delivery',
      items: [
        { id: 'contactless', label: 'Contactless Delivery', sub: 'Leave order at door by default', icon: 'home', value: true },
        { id: 'instructions', label: 'Save Delivery Notes', sub: 'Remember notes for each address', icon: 'clipboard', value: true },
      ],
    },
    {
      title: 'Appearance',
      items: [
        { id: 'haptics', label: 'Haptic Feedback', sub: 'Vibration on interactions', icon: 'activity', value: true },
      ],
    },
  ]);

  const [language, setLanguage] = useState('English');
  const LANGS = ['English', 'हिंदी', 'বাংলা', 'தமிழ்', 'తెలుగు'];
  const [showLangs, setShowLangs] = useState(false);

  function toggle(sectionIdx: number, id: string) {
    setSections((secs) =>
      secs.map((sec, si) =>
        si !== sectionIdx ? sec : {
          ...sec,
          items: sec.items.map((item) =>
            item.id === id ? { ...item, value: !item.value } : item
          ),
        }
      )
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          Settings
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 40 }}>

        {sections.map((sec, si) => (
          <View key={sec.title}>
            <Text style={[styles.sectionHead, { color: colors.mutedForeground, fontFamily: 'Inter_600SemiBold' }]}>
              {sec.title.toUpperCase()}
            </Text>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              {sec.items.map((item, ii) => (
                <View
                  key={item.id}
                  style={[
                    styles.row,
                    ii < sec.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  ]}
                >
                  <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
                    <Feather name={item.icon as any} size={16} color={colors.primary} />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={[styles.rowLabel, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.rowSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                      {item.sub}
                    </Text>
                  </View>
                  <Switch
                    value={item.value}
                    onValueChange={() => toggle(si, item.id)}
                    trackColor={{ false: colors.border, true: colors.primary + '88' }}
                    thumbColor={item.value ? colors.primary : colors.mutedForeground}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Language */}
        <View>
          <Text style={[styles.sectionHead, { color: colors.mutedForeground, fontFamily: 'Inter_600SemiBold' }]}>
            LANGUAGE
          </Text>
          <TouchableOpacity
            onPress={() => setShowLangs((v) => !v)}
            style={[styles.card, styles.langBtn, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
              <Feather name="globe" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.foreground, fontFamily: 'Inter_600SemiBold', flex: 1 }]}>
              App Language
            </Text>
            <Text style={[styles.langValue, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>
              {language}
            </Text>
            <Feather name={showLangs ? 'chevron-up' : 'chevron-down'} size={16} color={colors.mutedForeground} />
          </TouchableOpacity>

          {showLangs && (
            <View style={[styles.langList, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              {LANGS.map((l, i) => (
                <TouchableOpacity
                  key={l}
                  onPress={() => { setLanguage(l); setShowLangs(false); }}
                  style={[styles.langItem, i < LANGS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                >
                  <Text style={[styles.langItemText, {
                    color: l === language ? colors.primary : colors.foreground,
                    fontFamily: l === language ? 'Inter_600SemiBold' : 'Inter_400Regular',
                  }]}>{l}</Text>
                  {l === language && <Feather name="check" size={16} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Danger zone */}
        <View>
          <Text style={[styles.sectionHead, { color: colors.mutedForeground, fontFamily: 'Inter_600SemiBold' }]}>
            ACCOUNT
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <TouchableOpacity style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <View style={[styles.iconBox, { backgroundColor: '#EF444420' }]}>
                <Feather name="trash-2" size={16} color={colors.destructive} />
              </View>
              <Text style={[styles.rowLabel, { color: colors.destructive, fontFamily: 'Inter_600SemiBold', flex: 1 }]}>
                Clear App Cache
              </Text>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#EF444420' }]}>
                <Feather name="user-x" size={16} color={colors.destructive} />
              </View>
              <Text style={[styles.rowLabel, { color: colors.destructive, fontFamily: 'Inter_600SemiBold', flex: 1 }]}>
                Delete Account
              </Text>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* App info */}
        <View style={[styles.appInfo, { borderColor: colors.border }]}>
          <Text style={[styles.appName, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            SwiftMart v1.0.0
          </Text>
          <Text style={[styles.appName, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            © 2026 SwiftMart Inc.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 18 },
  sectionHead: { fontSize: 11, letterSpacing: 0.8, marginBottom: 8 },
  card: { borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 14 },
  rowSub: { fontSize: 12, marginTop: 2, lineHeight: 17 },
  langBtn: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  langValue: { fontSize: 14 },
  langList: { borderWidth: 1, marginTop: 4, overflow: 'hidden' },
  langItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  langItemText: { fontSize: 15 },
  appInfo: { alignItems: 'center', gap: 4, paddingVertical: 8, borderTopWidth: 1 },
  appName: { fontSize: 12 },
});
