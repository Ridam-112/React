import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function EditProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, completeProfile } = useAuth();

  const [name,   setName]   = useState(user?.name  ?? '');
  const [phone,  setPhone]  = useState(user?.phone ?? '');
  const [email,  setEmail]  = useState(user?.email ?? '');
  const [dob,    setDob]    = useState('');
  const [gender, setGender] = useState('');

  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [errors,  setErrors]  = useState<Record<string,string>>({});

  const isTruecaller = user?.provider === 'truecaller';
  const initials = name.trim()
    ? name.trim().split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '??';

  function validate() {
    const e: Record<string,string> = {};
    if (!name.trim())  e.name  = 'Name is required';
    if (!isTruecaller && !phone.trim()) e.phone = 'Phone number is required';
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSaving(true);
    try {
      await completeProfile({
        name:  name.trim(),
        phone: isTruecaller ? (user?.phone ?? '') : phone.trim(),
        address: user?.address ?? '',
      });
      setSaved(true);
      setTimeout(() => router.back(), 900);
    } finally {
      setSaving(false);
    }
  }

  function field(
    label: string,
    value: string,
    onChange: (v: string) => void,
    opts: { keyboard?: any; placeholder?: string; readonly?: boolean; errorKey?: string } = {}
  ) {
    const err = opts.errorKey ? errors[opts.errorKey] : undefined;
    return (
      <View style={styles.fieldGroup} key={label}>
        <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
          {label}
        </Text>
        <TextInput
          value={value}
          onChangeText={(v) => { onChange(v); if (opts.errorKey) setErrors((prev) => ({ ...prev, [opts.errorKey!]: '' })); }}
          placeholder={opts.placeholder ?? label}
          placeholderTextColor={colors.mutedForeground + '66'}
          keyboardType={opts.keyboard ?? 'default'}
          editable={!opts.readonly}
          style={[
            styles.input,
            {
              color: opts.readonly ? colors.mutedForeground : colors.foreground,
              backgroundColor: opts.readonly ? colors.muted : colors.secondary,
              borderColor: err ? '#EF4444' : colors.border,
              borderRadius: colors.radius - 4,
              fontFamily: 'Inter_400Regular',
            },
          ]}
        />
        {err ? (
          <Text style={{ color: '#EF4444', fontSize: 11, fontFamily: 'Inter_400Regular' }}>{err}</Text>
        ) : null}
        {opts.readonly && (
          <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: -2 }}>
            Verified via Truecaller · cannot be changed here
          </Text>
        )}
      </View>
    );
  }

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={styles.avatarRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.primaryForeground ?? '#07111F', fontFamily: 'Inter_700Bold' }]}>
              {initials}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.changePhotoBtn, { borderColor: colors.primary, borderRadius: colors.radius - 4 }]}
          >
            <Feather name="camera" size={14} color={colors.primary} />
            <Text style={[styles.changePhotoText, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          {field('Full Name',     name,  setName,  { errorKey: 'name' })}
          {field('Phone Number',  phone, setPhone, {
            keyboard: 'phone-pad',
            readonly: isTruecaller,
            errorKey: 'phone',
          })}
          {field('Email Address', email, setEmail, { keyboard: 'email-address' })}
          {field('Date of Birth', dob,   setDob,   { placeholder: 'DD MMM YYYY' })}

          {/* Gender picker */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
              Gender
            </Text>
            <View style={styles.genderRow}>
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g)}
                  style={[
                    styles.genderChip,
                    {
                      backgroundColor: gender === g ? colors.primary + '22' : colors.secondary,
                      borderColor:     gender === g ? colors.primary : colors.border,
                      borderRadius: 20,
                    },
                  ]}
                >
                  <Text style={[styles.genderText, {
                    color:      gender === g ? colors.primary : colors.mutedForeground,
                    fontFamily: gender === g ? 'Inter_600SemiBold' : 'Inter_400Regular',
                  }]}>
                    {g}
                  </Text>
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
          onPress={handleSave}
          disabled={saving}
          style={[styles.saveBtn, { backgroundColor: colors.primary, borderRadius: colors.radius, opacity: saving ? 0.85 : 1 }]}
        >
          {saving ? (
            <ActivityIndicator color={colors.primaryForeground ?? '#07111F'} />
          ) : (
            <>
              <Feather name="check" size={18} color={colors.primaryForeground ?? '#07111F'} />
              <Text style={[styles.saveBtnText, { color: colors.primaryForeground ?? '#07111F', fontFamily: 'Inter_700Bold' }]}>
                Save Changes
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1 },
  header:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 12 },
  backBtn:         { padding: 4 },
  title:           { fontSize: 18 },
  avatarRow:       { alignItems: 'center', gap: 12, paddingVertical: 8 },
  avatar:          { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  avatarText:      { fontSize: 28 },
  changePhotoBtn:  { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  changePhotoText: { fontSize: 13 },
  card:            { padding: 16, borderWidth: 1, gap: 16 },
  fieldGroup:      { gap: 6 },
  label:           { fontSize: 12 },
  input:           { padding: 13, borderWidth: 1, fontSize: 14 },
  genderRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genderChip:      { paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1 },
  genderText:      { fontSize: 13 },
  footer:          { padding: 16, borderTopWidth: 1, gap: 10 },
  savedBanner:     { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderWidth: 1 },
  savedText:       { fontSize: 13 },
  saveBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  saveBtnText:     { fontSize: 16 },
});
