import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, TextInput, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';

const FAQS = [
  { q: 'How do I track my order?', a: 'Go to the Orders tab and tap on any order bucket. You\'ll see a live tracking timeline showing exactly where your order is.' },
  { q: 'Can I cancel my order?', a: 'You can cancel within 5 minutes of placing the order. Open the order, tap "Need help?" and select "Cancel Order". After dispatch, cancellation is not possible.' },
  { q: 'What is the return policy?', a: 'We accept returns within 24 hours of delivery for perishable items and 7 days for non-perishable items. Tap "Report an Issue" on the order page to start a return.' },
  { q: 'How long does delivery take?', a: 'Most orders are delivered within 20–40 minutes depending on your location and the store\'s preparation time.' },
  { q: 'Why was my payment declined?', a: 'Check that your card details are correct and have sufficient balance. For UPI, ensure your app is connected. Contact your bank if the issue persists.' },
  { q: 'How do I add a new delivery address?', a: 'Go to Profile → Saved Addresses and tap "Add New Address". Fill in your details and save.' },
];

const CONTACT = [
  { icon: 'message-circle', label: 'Live Chat', sub: 'Typically replies in 2 min', color: '#3B82F6', action: null },
  { icon: 'phone', label: 'Call Support', sub: '1800-XXX-XXXX · 8 AM – 10 PM', color: '#4CAF50', action: 'tel:1800XXXXXXX' },
  { icon: 'mail', label: 'Email Us', sub: 'support@swiftmart.in', color: '#FFC107', action: 'mailto:support@swiftmart.in' },
];

export default function HelpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filtered = query.trim()
    ? FAQS.filter((f) => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()))
    : FAQS;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          Help & Support
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>

        {/* Search FAQs */}
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search FAQs…"
            placeholderTextColor={colors.mutedForeground + '88'}
            style={[styles.searchInput, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        {/* FAQs */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
            Frequently Asked Questions
          </Text>
          <View style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            {filtered.length === 0 && (
              <Text style={[styles.noResult, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                No results for "{query}"
              </Text>
            )}
            {filtered.map((faq, i) => (
              <View key={i} style={[styles.faqItem, i < filtered.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <TouchableOpacity
                  style={styles.faqQ}
                  activeOpacity={0.7}
                  onPress={() => setExpanded(expanded === i ? null : i)}
                >
                  <Text style={[styles.qText, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]} numberOfLines={expanded === i ? undefined : 2}>
                    {faq.q}
                  </Text>
                  <Feather name={expanded === i ? 'chevron-up' : 'chevron-down'} size={16} color={colors.mutedForeground} />
                </TouchableOpacity>
                {expanded === i && (
                  <Text style={[styles.aText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                    {faq.a}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Contact options */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
            Contact Us
          </Text>
          <View style={styles.contactGrid}>
            {CONTACT.map((c) => (
              <TouchableOpacity
                key={c.label}
                activeOpacity={0.8}
                onPress={() => c.action && Linking.openURL(c.action)}
                style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
              >
                <View style={[styles.contactIcon, { backgroundColor: c.color + '22' }]}>
                  <Feather name={c.icon as any} size={22} color={c.color} />
                </View>
                <Text style={[styles.contactLabel, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>{c.label}</Text>
                <Text style={[styles.contactSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>{c.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Write to us */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
            Write to Us
          </Text>
          <View style={[styles.writeCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            {submitted ? (
              <View style={styles.thankYou}>
                <Feather name="check-circle" size={32} color="#4CAF50" />
                <Text style={[styles.thankTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>Message Sent!</Text>
                <Text style={[styles.thankSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                  We'll get back to you within 24 hours.
                </Text>
                <TouchableOpacity onPress={() => setSubmitted(false)}>
                  <Text style={[styles.newMsg, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>Send another message</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <WriteForm colors={colors} onSubmit={() => setSubmitted(true)} />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function WriteForm({ colors, onSubmit }: { colors: any; onSubmit: () => void }) {
  const [issue, setIssue] = useState('');
  const [msg, setMsg] = useState('');
  const ISSUES = ['Order Issue', 'Payment', 'Delivery', 'Product Quality', 'App Bug', 'Other'];
  const [sel, setSel] = useState('');

  return (
    <View style={styles.writeForm}>
      <Text style={[styles.fLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>Issue Type</Text>
      <View style={styles.issueGrid}>
        {ISSUES.map((iss) => (
          <TouchableOpacity key={iss} onPress={() => setSel(iss)}
            style={[styles.issueChip, { backgroundColor: sel === iss ? colors.primary + '22' : colors.secondary, borderColor: sel === iss ? colors.primary : colors.border, borderRadius: 20 }]}>
            <Text style={[styles.issueText, { color: sel === iss ? colors.primary : colors.mutedForeground, fontFamily: sel === iss ? 'Inter_600SemiBold' : 'Inter_400Regular' }]}>{iss}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={[styles.fLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium', marginTop: 8 }]}>Message</Text>
      <TextInput value={msg} onChangeText={setMsg} placeholder="Describe your issue…"
        placeholderTextColor={colors.mutedForeground + '66'} multiline numberOfLines={4}
        style={[styles.textarea, { color: colors.foreground, backgroundColor: colors.secondary, borderColor: colors.border, borderRadius: colors.radius - 4, fontFamily: 'Inter_400Regular' }]} />
      <TouchableOpacity onPress={onSubmit} disabled={!sel || !msg}
        style={[styles.submitBtn, { backgroundColor: sel && msg ? colors.primary : colors.border, borderRadius: colors.radius - 4 }]}>
        <Text style={[styles.submitText, { color: colors.primaryForeground ?? '#07111F', fontFamily: 'Inter_700Bold' }]}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  title: { fontSize: 18 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14 },
  sectionTitle: { fontSize: 15, marginBottom: 10 },
  faqCard: { borderWidth: 1, overflow: 'hidden' },
  faqItem: { padding: 14 },
  faqQ: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  qText: { flex: 1, fontSize: 14, lineHeight: 20 },
  aText: { fontSize: 13, lineHeight: 20, marginTop: 10 },
  noResult: { padding: 14, fontSize: 13, textAlign: 'center' },
  contactGrid: { gap: 10 },
  contactCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderWidth: 1 },
  contactIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  contactLabel: { fontSize: 14 },
  contactSub: { fontSize: 12, marginTop: 1 },
  writeCard: { padding: 16, borderWidth: 1 },
  writeForm: { gap: 10 },
  fLabel: { fontSize: 12 },
  issueGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  issueChip: { paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1 },
  issueText: { fontSize: 13 },
  textarea: { padding: 12, borderWidth: 1, fontSize: 14, minHeight: 100, textAlignVertical: 'top' },
  submitBtn: { alignItems: 'center', paddingVertical: 13 },
  submitText: { fontSize: 15 },
  thankYou: { alignItems: 'center', gap: 10, paddingVertical: 16 },
  thankTitle: { fontSize: 17 },
  thankSub: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  newMsg: { fontSize: 13, marginTop: 4 },
});
