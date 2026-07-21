import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';

type Form = {
  name: string; phone: string; email: string;
  dob: string; gender: string;
};

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function EditProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<Form>({
    name: 'Rahul Kumar', phone: '+91 98765 43210',
    email: 'rahul.kumar@email.com', dob: '15 Aug 1995', gender: 'Male',
  });
  const [saved, setSaved] = useState(false);

  const field = (
    key: keyof Form, label: string,
    opts: { keyboard?: any; placeholder?: string } = {}
  ) => (
    <View style={styles.fieldGroup} key={key}>
      <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
        {label}
      </Text>
      <TextInput
        value={form[key]}
        onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
        placeholder={opts.placeholder ?? label}
        placeholderTextColor={colors.mutedForeground + '66'}
        keyboardType={opts.keyboard ?? 'default'}
        style={[styles.input, {
          color: colors.foreground, backgroundColor: colors.secondary,
          borderColor: colors.border, borderRadius: colors.radius - 4,
          fontFamily: 'Inter_400Regular',
        }]}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          Edit Profile
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 120 }}>

        {/* Avatar */}
        <View style={styles.avatarRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.primaryForeground ?? '#07111F', fontFamily: 'Inter_700Bold' }]}>
              RK
            </Text>
          </View>
          <TouchableOpacity style={[styles.changePhotoBtn, { borderColor: colors.primary, borderRadius: colors.radius - 4 }]}>
            <Feather name="camera" size={14} color={colors.primary} />
            <Text style={[styles.changePhotoText, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          {field('name', 'Full Name')}
          {field('phone', 'Phone Number', { keyboard: 'phone-pad' })}
          {field('email', 'Email Address', { keyboard: 'email-address' })}
          {field('dob', 'Date of Birth', { placeholder: 'DD MMM YYYY' })}

          {/* Gender picker */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
              Gender
            </Text>
            <View style={styles.genderRow}>
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setForm((f) => ({ ...f, gender: g }))}
                  style={[styles.genderChip, {
                    backgroundColor: form.gender === g ? colors.primary + '22' : colors.secondary,
                    borderColor: form.gender === g ? colors.primary : colors.border,
                    borderRadius: 20,
                  }]}
                >
                  <Text style={[styles.genderText, {
                    color: form.gender === g ? colors.primary : colors.mutedForeground,
                    fontFamily: form.gender === g ? 'Inter_600SemiBold' : 'Inter_400Regular',
                  }]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
        {saved && (
          <View style={[styles.savedBanner, { backgroundColor: '#4CAF5018', borderColor: '#4CAF5044', borderRadius: colors.radius - 4 }]}>
            <Feather name="check-circle" size={14} color="#4CAF50" />
            <Text style={[styles.savedText, { color: '#4CAF50', fontFamily: 'Inter_500Medium' }]}>
              Changes saved!
            </Text>
          </View>
        )}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => { setSaved(true); setTimeout(() => router.back(), 800); }}
          style={[styles.saveBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
        >
          <Feather name="check" size={18} color={colors.primaryForeground ?? '#07111F'} />
          <Text style={[styles.saveBtnText, { color: colors.primaryForeground ?? '#07111F', fontFamily: 'Inter_700Bold' }]}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 18 },
  avatarRow: { alignItems: 'center', gap: 12, paddingVertical: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28 },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  changePhotoText: { fontSize: 13 },
  card: { padding: 16, borderWidth: 1, gap: 16 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 12 },
  input: { padding: 13, borderWidth: 1, fontSize: 14 },
  genderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genderChip: { paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1 },
  genderText: { fontSize: 13 },
  footer: { padding: 16, borderTopWidth: 1, gap: 10 },
  savedBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderWidth: 1 },
  savedText: { fontSize: 13 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  saveBtnText: { fontSize: 16 },
});
