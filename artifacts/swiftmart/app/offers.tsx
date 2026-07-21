import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { OFFERS, Offer } from '@/constants/data';

function OfferRow({ offer }: { offer: Offer }) {
  const colors = useColors();
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.card,
        {
          backgroundColor: offer.accentColor + '18',
          borderColor: offer.accentColor + '40',
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: offer.accentColor, fontFamily: 'Inter_700Bold' }]}>
            {offer.title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}>
            {offer.subtitle}
          </Text>
          {offer.code && (
            <View style={[styles.codeBox, { borderColor: offer.accentColor + '60', backgroundColor: colors.card }]}>
              <Text style={[styles.codeLabel, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                USE CODE
              </Text>
              <Text style={[styles.code, { color: offer.accentColor, fontFamily: 'Inter_700Bold' }]}>
                {offer.code}
              </Text>
            </View>
          )}
        </View>
        <Image source={offer.image} style={styles.image} resizeMode="contain" />
      </View>
    </TouchableOpacity>
  );
}

export default function OffersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
          Best Offers For You
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={OFFERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OfferRow offer={item} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={[styles.subheading, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            {OFFERS.length} offers available · Tap to apply at checkout
          </Text>
        }
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
  headerTitle: { fontSize: 18 },
  subheading: { fontSize: 13, paddingHorizontal: 16, paddingBottom: 12 },
  list: { paddingTop: 8 },
  card: { borderWidth: 1, padding: 16, marginHorizontal: 16, marginBottom: 12 },
  content: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  textBlock: { flex: 1, gap: 4 },
  title: { fontSize: 22 },
  subtitle: { fontSize: 13 },
  codeBox: {
    marginTop: 10, paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', alignSelf: 'flex-start',
  },
  codeLabel: { fontSize: 9 },
  code: { fontSize: 14 },
  image: { width: 90, height: 90, marginLeft: 12 },
});
