import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';
import { useAddresses, type SavedAddress } from '@/context/AddressContext';

type Form = { name: string; phone: string; line: string; city: string; pincode: string; tag: 'Home' | 'Work' | 'Other' };
const EMPTY_FORM: Form = { name: '', phone: '', line: '', city: '', pincode: '', tag: 'Home' };

export default function AddressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addresses, selectedAddress, selectAddress, addAddress } = useAddresses();

  const [selected, setSelected] = useState<string>(selectedAddress?.id ?? addresses[0]?.id ?? '');
  const [addingNew, setAddingNew] = useState(addresses.length === 0);
  const [form, setForm]     = useState<Form>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const canContinue = addingNew
    ? !!(form.name && form.phone && form.line && form.city && form.pincode)
    : !!selected;

  async function handleSelect(id: string) {
    setSelected(id);
    await selectAddress(id);
  }

  async function handleAddNew() {
    setSaving(true);
    try {
      await addAddress({
        tag:       form.tag,
        name:      form.name.trim(),
        line:      form.line.trim(),
        city:      form.city.trim(),
        pincode:   form.pincode.trim(),
        phone:     form.phone.trim(),
        isDefault: addresses.length === 0,
      });
      setAddingNew(false);
      setForm(EMPTY_FORM);
    } finally {
      setSaving(false);
    }
  }

  async function handleContinue() {
    if (addingNew) {
      await handleAddNew();
    }
    router.push('/checkout/payment');
  }

  const tagIcon = (tag: SavedAddress['tag']) =>
    tag === 'Home' ? 'home' : tag === 'Work' ? 'briefcase' : 'map-pin';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
            Delivery Address
          </Text>
        </View>
        <StepDots current={0} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}>

        {/* Saved addresses */}
        {!addingNew && addresses.map((addr) => {
          const isActive = selected === addr.id;
          return (
            <TouchableOpacity
              key={addr.id}
              activeOpacity={0.8}
              onPress={() => handleSelect(addr.id)}
              style={[
                styles.addrCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isActive ? colors.primary : colors.border,
                  borderRadius: colors.radius,
                  borderWidth: isActive ? 2 : 1,
                },
              ]}
            >
              <View style={styles.addrTop}>
                <View style={[styles.tag, { backgroundColor: colors.primary + '22' }]}>
                  <Feather name={tagIcon(addr.tag)} size={12} color={colors.primary} />
                  <Text style={[styles.tagText, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>
                    {addr.tag}
                  </Text>
                </View>
                {isActive && (
                  <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                    <Feather name="check" size={11} color={colors.primaryForeground ?? '#07111F'} />
                  </View>
                )}
              </View>
              <Text style={[styles.addrName, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
                {addr.name}
              </Text>
              <Text style={[styles.addrLine, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                {addr.line}, {addr.city} – {addr.pincode}
              </Text>
              <Text style={[styles.addrPhone, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                {addr.phone}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Add new address toggle */}
        {!addingNew && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => { setAddingNew(true); setSelected(''); }}
            style={[styles.addNewBtn, { borderColor: colors.border, borderRadius: colors.radius, backgroundColor: colors.card }]}
          >
            <Feather name="plus" size={18} color={colors.primary} />
            <Text style={[styles.addNewText, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>
              Add New Address
            </Text>
          </TouchableOpacity>
        )}

        {/* New address form */}
        {addingNew && (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <View style={styles.formHeader}>
              <Text style={[styles.formTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
                New Address
              </Text>
              {addresses.length > 0 && (
                <TouchableOpacity onPress={() => { setAddingNew(false); setSelected(addresses[0].id); setForm(EMPTY_FORM); }}>
                  <Feather name="x" size={20} color={colors.mutedForeground} />
                </TouchableOpacity>
              )}
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
                  <Feather name={tagIcon(t)} size={12} color={form.tag === t ? colors.primary : colors.mutedForeground} />
                  <Text style={[styles.tagChipText, { color: form.tag === t ? colors.primary : colors.mutedForeground, fontFamily: form.tag === t ? 'Inter_600SemiBold' : 'Inter_400Regular' }]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {(
              [
                { key: 'name',    label: 'Full Name',     placeholder: 'e.g. Ridam Sharma' },
                { key: 'phone',   label: 'Phone Number',  placeholder: '+91 00000 00000' },
                { key: 'line',    label: 'Address Line',  placeholder: 'Street, building, area' },
                { key: 'city',    label: 'City',          placeholder: 'Mumbai' },
                { key: 'pincode', label: 'Pincode',       placeholder: '400001' },
              ] as { key: keyof Omit<Form, 'tag'>; label: string; placeholder: string }[]
            ).map(({ key, label, placeholder }) => (
              <View key={key} style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
                  {label}
                </Text>
                <TextInput
                  value={form[key] as string}
                  onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
                  placeholder={placeholder}
                  placeholderTextColor={colors.mutedForeground + '88'}
                  style={[
                    styles.input,
                    {
                      color: colors.foreground,
                      backgroundColor: colors.secondary,
                      borderColor: colors.border,
                      borderRadius: colors.radius - 4,
                      fontFamily: 'Inter_400Regular',
                    },
                  ]}
                  keyboardType={key === 'phone' || key === 'pincode' ? 'phone-pad' : 'default'}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Continue button */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!canContinue || saving}
          onPress={handleContinue}
          style={[
            styles.continueBtn,
            { backgroundColor: canContinue ? colors.primary : colors.border, borderRadius: colors.radius },
          ]}
        >
          {saving ? (
            <ActivityIndicator color={colors.primaryForeground ?? '#07111F'} />
          ) : (
            <>
              <Text style={[styles.continueBtnText, { color: colors.primaryForeground ?? '#07111F', fontFamily: 'Inter_700Bold' }]}>
                Continue to Payment
              </Text>
              <Feather name="arrow-right" size={18} color={colors.primaryForeground ?? '#07111F'} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StepDots({ current }: { current: number }) {
  const colors = useColors();
  return (
    <View style={styles.dots}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i === current ? colors.primary : i < current ? colors.primary + '55' : colors.border,
              width: i === current ? 18 : 7,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 10 },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 16 },
  dots: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  dot: { height: 7, borderRadius: 4 },

  addrCard: { padding: 14 },
  addrTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 11 },
  checkCircle: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  addrName: { fontSize: 14, marginBottom: 3 },
  addrLine: { fontSize: 13, lineHeight: 19, marginBottom: 3 },
  addrPhone: { fontSize: 12 },

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

  footer: { padding: 16, borderTopWidth: 1 },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  continueBtnText: { fontSize: 16 },
});
