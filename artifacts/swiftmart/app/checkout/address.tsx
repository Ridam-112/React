import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';

type Address = {
  id: string;
  tag: string;
  name: string;
  line: string;
  city: string;
  pincode: string;
  phone: string;
};

const SAVED: Address[] = [
  {
    id: 'a1',
    tag: 'Home',
    name: 'Ridam Sharma',
    line: '12, Green Valley Apartments, MG Road',
    city: 'Mumbai',
    pincode: '400001',
    phone: '+91 98765 43210',
  },
  {
    id: 'a2',
    tag: 'Work',
    name: 'Ridam Sharma',
    line: 'Floor 4, Nexus Tower, BKC',
    city: 'Mumbai',
    pincode: '400051',
    phone: '+91 98765 43210',
  },
];

type Form = { name: string; phone: string; line: string; city: string; pincode: string };
const EMPTY_FORM: Form = { name: '', phone: '', line: '', city: '', pincode: '' };

export default function AddressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string>('a1');
  const [addingNew, setAddingNew] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY_FORM);

  const canContinue = addingNew
    ? !!(form.name && form.phone && form.line && form.city && form.pincode)
    : !!selected;

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
        {!addingNew && SAVED.map((addr) => {
          const isActive = selected === addr.id;
          return (
            <TouchableOpacity
              key={addr.id}
              activeOpacity={0.8}
              onPress={() => setSelected(addr.id)}
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
                  <Feather
                    name={addr.tag === 'Home' ? 'home' : 'briefcase'}
                    size={12}
                    color={colors.primary}
                  />
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
              <TouchableOpacity onPress={() => { setAddingNew(false); setSelected('a1'); setForm(EMPTY_FORM); }}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            {(
              [
                { key: 'name', label: 'Full Name', placeholder: 'e.g. Ridam Sharma' },
                { key: 'phone', label: 'Phone Number', placeholder: '+91 00000 00000' },
                { key: 'line', label: 'Address Line', placeholder: 'Street, building, area' },
                { key: 'city', label: 'City', placeholder: 'Mumbai' },
                { key: 'pincode', label: 'Pincode', placeholder: '400001' },
              ] as { key: keyof Form; label: string; placeholder: string }[]
            ).map(({ key, label, placeholder }) => (
              <View key={key} style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
                  {label}
                </Text>
                <TextInput
                  value={form[key]}
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
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!canContinue}
          onPress={() => router.push('/checkout/payment')}
          style={[
            styles.continueBtn,
            {
              backgroundColor: canContinue ? colors.primary : colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text style={[styles.continueBtnText, { color: colors.primaryForeground ?? '#07111F', fontFamily: 'Inter_700Bold' }]}>
            Continue to Payment
          </Text>
          <Feather name="arrow-right" size={18} color={colors.primaryForeground ?? '#07111F'} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
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

  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addNewText: { fontSize: 14 },

  formCard: { padding: 16, borderWidth: 1, gap: 14 },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  formTitle: { fontSize: 15 },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: 12 },
  input: { padding: 12, borderWidth: 1, fontSize: 14 },

  footer: { padding: 16, borderTopWidth: 1 },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  continueBtnText: { fontSize: 16 },
});
