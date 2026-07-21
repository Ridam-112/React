import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';

type Card = { id: string; type: 'visa' | 'mastercard' | 'rupay'; last4: string; expiry: string; default: boolean };
type Upi = { id: string; handle: string; app: string; default: boolean };

const INIT_CARDS: Card[] = [
  { id: 'c1', type: 'visa', last4: '4242', expiry: '08/27', default: true },
  { id: 'c2', type: 'mastercard', last4: '5353', expiry: '03/26', default: false },
];
const INIT_UPIS: Upi[] = [
  { id: 'u1', handle: 'rahul@okicici', app: 'PhonePe', default: false },
];

const CARD_ICON: Record<string, string> = { visa: 'credit-card', mastercard: 'credit-card', rupay: 'credit-card' };
const CARD_COLOR: Record<string, string> = { visa: '#1A1F71', mastercard: '#EB001B', rupay: '#00693E' };
const CARD_LABEL: Record<string, string> = { visa: 'VISA', mastercard: 'Mastercard', rupay: 'RuPay' };

export default function PaymentMethodsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [cards, setCards] = useState<Card[]>(INIT_CARDS);
  const [upis, setUpis] = useState<Upi[]>(INIT_UPIS);
  const [addingCard, setAddingCard] = useState(false);
  const [addingUpi, setAddingUpi] = useState(false);
  const [newUpi, setNewUpi] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  function removeCard(id: string) { setCards((c) => c.filter((x) => x.id !== id)); }
  function removeUpi(id: string) { setUpis((u) => u.filter((x) => x.id !== id)); }
  function setDefaultCard(id: string) { setCards((c) => c.map((x) => ({ ...x, default: x.id === id }))); }
  function setDefaultUpi(id: string) { setUpis((u) => u.map((x) => ({ ...x, default: x.id === id }))); }
  function saveCard() {
    if (!cardNum || !cardExp) return;
    const last4 = cardNum.replace(/\s/g, '').slice(-4);
    setCards((c) => [...c, { id: Date.now().toString(), type: 'visa', last4, expiry: cardExp, default: false }]);
    setCardNum(''); setCardExp(''); setCardCvv(''); setCardName('');
    setAddingCard(false);
  }
  function saveUpi() {
    if (!newUpi.includes('@')) return;
    setUpis((u) => [...u, { id: Date.now().toString(), handle: newUpi, app: 'UPI', default: false }]);
    setNewUpi(''); setAddingUpi(false);
  }

  const SectionHead = ({ label }: { label: string }) => (
    <Text style={[styles.sectionHead, { color: colors.mutedForeground, fontFamily: 'Inter_600SemiBold' }]}>{label}</Text>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          Payment Methods
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}>

        {/* Cards */}
        <SectionHead label="SAVED CARDS" />
        {cards.map((card) => (
          <View key={card.id} style={[styles.cardRow, { backgroundColor: colors.card, borderColor: card.default ? colors.primary : colors.border, borderRadius: colors.radius, borderWidth: card.default ? 2 : 1 }]}>
            <View style={[styles.cardBrand, { backgroundColor: CARD_COLOR[card.type] + '22' }]}>
              <Text style={[styles.cardBrandText, { color: CARD_COLOR[card.type], fontFamily: 'Inter_700Bold' }]}>
                {CARD_LABEL[card.type]}
              </Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardNum, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
                •••• •••• •••• {card.last4}
              </Text>
              <Text style={[styles.cardExp, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                Expires {card.expiry}
              </Text>
            </View>
            {card.default && (
              <View style={[styles.defBadge, { backgroundColor: '#4CAF5018', borderColor: '#4CAF5040' }]}>
                <Text style={[styles.defText, { color: '#4CAF50', fontFamily: 'Inter_600SemiBold' }]}>Default</Text>
              </View>
            )}
            <View style={styles.cardActions}>
              {!card.default && (
                <TouchableOpacity onPress={() => setDefaultCard(card.id)}>
                  <Feather name="star" size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => removeCard(card.id)}>
                <Feather name="trash-2" size={16} color={colors.destructive} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {addingCard ? (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <View style={styles.formHead}>
              <Text style={[styles.formTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>New Card</Text>
              <TouchableOpacity onPress={() => setAddingCard(false)}><Feather name="x" size={20} color={colors.mutedForeground} /></TouchableOpacity>
            </View>
            {([['cardName', 'Name on Card', cardName, setCardName, 'default'],
               ['cardNum', 'Card Number', cardNum, setCardNum, 'number-pad'],
               ['cardExp', 'Expiry (MM/YY)', cardExp, setCardExp, 'number-pad'],
               ['cardCvv', 'CVV', cardCvv, setCardCvv, 'number-pad'],
            ] as [string, string, string, any, string][]).map(([k, l, v, setter, kb]) => (
              <View key={k} style={styles.fieldGroup}>
                <Text style={[styles.fLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>{l}</Text>
                <TextInput value={v} onChangeText={setter} placeholder={l}
                  placeholderTextColor={colors.mutedForeground + '66'} keyboardType={kb as any}
                  secureTextEntry={k === 'cardCvv'}
                  style={[styles.input, { color: colors.foreground, backgroundColor: colors.secondary, borderColor: colors.border, borderRadius: colors.radius - 4, fontFamily: 'Inter_400Regular' }]} />
              </View>
            ))}
            <TouchableOpacity onPress={saveCard} style={[styles.saveBtn, { backgroundColor: colors.primary, borderRadius: colors.radius - 4 }]}>
              <Text style={[styles.saveBtnText, { color: colors.primaryForeground ?? '#07111F', fontFamily: 'Inter_700Bold' }]}>Save Card</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setAddingCard(true)}
            style={[styles.addBtn, { borderColor: colors.border, borderRadius: colors.radius, backgroundColor: colors.card }]}>
            <Feather name="plus" size={16} color={colors.primary} />
            <Text style={[styles.addBtnText, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>Add New Card</Text>
          </TouchableOpacity>
        )}

        {/* UPI */}
        <SectionHead label="UPI IDs" />
        {upis.map((u) => (
          <View key={u.id} style={[styles.upiRow, { backgroundColor: colors.card, borderColor: u.default ? colors.primary : colors.border, borderRadius: colors.radius, borderWidth: u.default ? 2 : 1 }]}>
            <View style={[styles.upiIcon, { backgroundColor: colors.primary + '22' }]}>
              <MaterialCommunityIcons name="bank-transfer" size={20} color={colors.primary} />
            </View>
            <View style={styles.upiInfo}>
              <Text style={[styles.upiHandle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>{u.handle}</Text>
              <Text style={[styles.upiApp, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>{u.app}</Text>
            </View>
            {u.default && (
              <View style={[styles.defBadge, { backgroundColor: '#4CAF5018', borderColor: '#4CAF5040' }]}>
                <Text style={[styles.defText, { color: '#4CAF50', fontFamily: 'Inter_600SemiBold' }]}>Default</Text>
              </View>
            )}
            <View style={styles.cardActions}>
              {!u.default && (
                <TouchableOpacity onPress={() => setDefaultUpi(u.id)}>
                  <Feather name="star" size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => removeUpi(u.id)}>
                <Feather name="trash-2" size={16} color={colors.destructive} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {addingUpi ? (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <View style={styles.formHead}>
              <Text style={[styles.formTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>Add UPI ID</Text>
              <TouchableOpacity onPress={() => { setAddingUpi(false); setNewUpi(''); }}><Feather name="x" size={20} color={colors.mutedForeground} /></TouchableOpacity>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>UPI ID</Text>
              <TextInput value={newUpi} onChangeText={setNewUpi} placeholder="yourname@upi"
                placeholderTextColor={colors.mutedForeground + '66'} autoCapitalize="none"
                style={[styles.input, { color: colors.foreground, backgroundColor: colors.secondary, borderColor: colors.border, borderRadius: colors.radius - 4, fontFamily: 'Inter_400Regular' }]} />
            </View>
            <TouchableOpacity onPress={saveUpi} style={[styles.saveBtn, { backgroundColor: colors.primary, borderRadius: colors.radius - 4 }]}>
              <Text style={[styles.saveBtnText, { color: colors.primaryForeground ?? '#07111F', fontFamily: 'Inter_700Bold' }]}>Verify & Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setAddingUpi(true)}
            style={[styles.addBtn, { borderColor: colors.border, borderRadius: colors.radius, backgroundColor: colors.card }]}>
            <Feather name="plus" size={16} color={colors.primary} />
            <Text style={[styles.addBtnText, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>Add UPI ID</Text>
          </TouchableOpacity>
        )}

        {/* COD */}
        <SectionHead label="OTHER" />
        <View style={[styles.codRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <View style={[styles.upiIcon, { backgroundColor: '#FFC10722' }]}>
            <MaterialCommunityIcons name="cash-multiple" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.codLabel, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>Cash on Delivery</Text>
          <View style={[styles.defBadge, { backgroundColor: '#4CAF5018', borderColor: '#4CAF5040' }]}>
            <Text style={[styles.defText, { color: '#4CAF50', fontFamily: 'Inter_600SemiBold' }]}>Available</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  title: { flex: 1, fontSize: 18 },
  sectionHead: { fontSize: 11, letterSpacing: 0.8, marginTop: 6 },
  cardRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  cardBrand: { width: 44, height: 28, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  cardBrandText: { fontSize: 10 },
  cardInfo: { flex: 1 },
  cardNum: { fontSize: 14 },
  cardExp: { fontSize: 12, marginTop: 2 },
  cardActions: { flexDirection: 'row', gap: 14 },
  defBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  defText: { fontSize: 11 },
  upiRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  upiIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  upiInfo: { flex: 1 },
  upiHandle: { fontSize: 14 },
  upiApp: { fontSize: 12, marginTop: 2 },
  codRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderWidth: 1 },
  codLabel: { flex: 1, fontSize: 14 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderWidth: 1, borderStyle: 'dashed' },
  addBtnText: { fontSize: 14 },
  formCard: { padding: 16, borderWidth: 1, gap: 14 },
  formHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  formTitle: { fontSize: 15 },
  fieldGroup: { gap: 6 },
  fLabel: { fontSize: 12 },
  input: { padding: 12, borderWidth: 1, fontSize: 14 },
  saveBtn: { alignItems: 'center', paddingVertical: 13 },
  saveBtnText: { fontSize: 15 },
});
