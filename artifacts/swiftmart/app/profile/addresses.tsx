import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';
import { useAddresses, SavedAddress } from '@/context/AddressContext';
import { useAuth } from '@/context/AuthContext';

const TAG_ICON: Record<string, string> = { Home: 'home', Work: 'briefcase', Other: 'map-pin' };

type Form = { name: string; line: string; city: string; pincode: string; phone: string; tag: 'Home' | 'Work' | 'Other' };
const EMPTY: Form = { name: '', line: '', city: '', pincode: '', phone: '', tag: 'Home' };

export default function AddressesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addresses, addAddress, removeAddress, setDefault } = useAddresses();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [formErrors, setFormErrors] = useState<Partial<Form>>({});

  function validateForm(): boolean {
    const errs: Partial<Form> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.line.trim()) errs.line = 'Required';
    if (!form.city.trim()) errs.city = 'Required';
    if (!form.pincode.trim()) errs.pincode = 'Required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleAdd() {
    if (!validateForm()) return;
    await addAddress({
      tag: form.tag,
      name: form.name.trim(),
      line: form.line.trim(),
      city: form.city.trim(),
      pincode: form.pincode.trim(),
      phone: form.phone.trim() || user?.phone || '',
      isDefault: addresses.length === 0,
    });
    setForm(EMPTY);
    setFormErrors({});
    setAdding(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          Saved Addresses
        </Text>
        <TouchableOpacity
          onPress={() => { setAdding(true); setFormErrors({}); }}
          style={[styles.addBtn, { backgroundColor: colors.primary + '22', borderRadius: 8 }]}
        >
          <Feather name="plus" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
      >
        {addresses.map((addr: SavedAddress) => (
          <View
            key={addr.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: addr.isDefault ? colors.primary : colors.border,
                borderRadius: colors.radius,
                borderWidth: addr.isDefault ? 2 : 1,
              },
            ]}
          >
            <View style={styles.cardTop}>
              <View style={[styles.tag, { backgroundColor: colors.primary + '22' }]}>
                <Feather name={TAG_ICON[addr.tag] as any} size={12} color={colors.primary} />
                <Text style={[styles.tagText, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>
                  {addr.tag}
                </Text>
              </View>
              {addr.isDefault && (
                <View style={[styles.defaultBadge, { backgroundColor: '#4CAF5018', borderColor: '#4CAF5044' }]}>
                  <Text style={[styles.defaultText, { color: '#4CAF50', fontFamily: 'Inter_600SemiBold' }]}>
                    Default
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.name, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
              {addr.name}
            </Text>
            <Text style={[styles.line, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              {addr.line}
              {addr.city ? `, ${addr.city}` : ''}
              {addr.pincode ? ` – ${addr.pincode}` : ''}
            </Text>
            {addr.phone ? (
              <Text style={[styles.phone, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                {addr.phone}
              </Text>
            ) : null}

            <View style={[styles.actions, { borderTopColor: colors.border }]}>
              {!addr.isDefault && (
                <TouchableOpacity onPress={() => setDefault(addr.id)} style={styles.actionBtn}>
                  <Feather name="star" size={14} color={colors.primary} />
                  <Text style={[styles.actionText, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>
                    Set Default
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => removeAddress(addr.id)}
                style={[styles.actionBtn, { marginLeft: 'auto' }]}
              >
                <Feather name="trash-2" size={14} color={colors.destructive} />
                <Text style={[styles.actionText, { color: colors.destructive, fontFamily: 'Inter_500Medium' }]}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {addresses.length === 0 && !adding && (
          <View style={styles.empty}>
            <Feather name="map-pin" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
              No saved addresses
            </Text>
          </View>
        )}

        {/* ── Add form ─────────────────────────────────────────────── */}
        {adding && (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <View style={styles.formHeader}>
              <Text style={[styles.formTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
                New Address
              </Text>
              <TouchableOpacity onPress={() => { setAdding(false); setForm(EMPTY); setFormErrors({}); }}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            {/* Tag selector */}
            <View style={styles.tagRow}>
              {(['Home', 'Work', 'Other'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setForm((f) => ({ ...f, tag: t }))}
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: form.tag === t ? colors.primary + '22' : colors.secondary,
                      borderColor: form.tag === t ? colors.primary : colors.border,
                      borderRadius: 20,
                    },
                  ]}
                >
                  <Feather name={TAG_ICON[t] as any} size={12} color={form.tag === t ? colors.primary : colors.mutedForeground} />
                  <Text style={[styles.tagChipText, { color: form.tag === t ? colors.primary : colors.mutedForeground, fontFamily: form.tag === t ? 'Inter_600SemiBold' : 'Inter_400Regular' }]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {([
              ['name',    'Full Name',     'default'],
              ['phone',   'Phone',         'phone-pad'],
              ['line',    'Address Line',  'default'],
              ['city',    'City',          'default'],
              ['pincode', 'Pincode',       'number-pad'],
            ] as [keyof Form, string, string][]).map(([k, label, kb]) => (
              <View key={k} style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
                  {label}{k !== 'phone' ? ' *' : ''}
                </Text>
                <TextInput
                  value={form[k]}
                  onChangeText={(v) => {
                    setForm((f) => ({ ...f, [k]: v }));
                    if (formErrors[k]) setFormErrors((e) => ({ ...e, [k]: undefined }));
                  }}
                  placeholder={label}
                  placeholderTextColor={colors.mutedForeground + '66'}
                  keyboardType={kb as any}
                  style={[
                    styles.input,
                    {
                      color: colors.foreground,
                      backgroundColor: colors.secondary,
                      borderColor: formErrors[k] ? '#EF4444' : colors.border,
                      borderRadius: colors.radius - 4,
                      fontFamily: 'Inter_400Regular',
                    },
                  ]}
                />
                {formErrors[k] ? (
                  <Text style={{ color: '#EF4444', fontSize: 11, fontFamily: 'Inter_400Regular' }}>
                    {formErrors[k]}
                  </Text>
                ) : null}
              </View>
            ))}

            <TouchableOpacity
              onPress={handleAdd}
              style={[styles.addAddrBtn, { backgroundColor: colors.primary, borderRadius: colors.radius - 4 }]}
            >
              <Text style={[styles.addAddrText, { color: colors.primaryForeground ?? '#07111F', fontFamily: 'Inter_700Bold' }]}>
                Save Address
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!adding && (
          <TouchableOpacity
            onPress={() => { setAdding(true); setFormErrors({}); }}
            style={[styles.addNewBtn, { borderColor: colors.border, borderRadius: colors.radius, backgroundColor: colors.card }]}
          >
            <Feather name="plus" size={18} color={colors.primary} />
            <Text style={[styles.addNewText, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>
              Add New Address
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 12,
  },
  backBtn: { padding: 4 },
  title: { flex: 1, fontSize: 18 },
  addBtn: { padding: 6 },
  card: { padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 11 },
  defaultBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  defaultText: { fontSize: 11 },
  name: { fontSize: 14, marginBottom: 3 },
  line: { fontSize: 13, lineHeight: 19, marginBottom: 2 },
  phone: { fontSize: 12 },
  actions: { flexDirection: 'row', borderTopWidth: 1, marginTop: 10, paddingTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { fontSize: 13 },
  empty: { alignItems: 'center', marginTop: 60, gap: 10 },
  emptyText: { fontSize: 15 },
  addNewBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderWidth: 1, borderStyle: 'dashed' },
  addNewText: { fontSize: 14 },
  formCard: { padding: 16, borderWidth: 1, gap: 14 },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  formTitle: { fontSize: 15 },
  tagRow: { flexDirection: 'row', gap: 8 },
  tagChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1 },
  tagChipText: { fontSize: 13 },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: 12 },
  input: { padding: 12, borderWidth: 1, fontSize: 14 },
  addAddrBtn: { alignItems: 'center', paddingVertical: 13 },
  addAddrText: { fontSize: 15 },
});
