import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Offer } from '@/constants/data';

type Props = { offer: Offer };

export function OfferCard({ offer }: Props) {
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
          marginHorizontal: 16,
          marginBottom: 12,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.textBlock}>
          <Text
            style={[
              styles.title,
              { color: offer.accentColor, fontFamily: 'Inter_700Bold' },
            ]}
          >
            {offer.title}
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.foreground,
                fontFamily: 'Inter_400Regular',
              },
            ]}
          >
            {offer.subtitle}
          </Text>
          {offer.code && (
            <View
              style={[
                styles.codeBox,
                {
                  borderColor: offer.accentColor + '60',
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.codeLabel,
                  {
                    color: colors.mutedForeground,
                    fontFamily: 'Inter_400Regular',
                  },
                ]}
              >
                USE CODE
              </Text>
              <Text
                style={[
                  styles.code,
                  {
                    color: offer.accentColor,
                    fontFamily: 'Inter_700Bold',
                  },
                ]}
              >
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

const styles = StyleSheet.create({
  card: { borderWidth: 1, padding: 16 },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textBlock: { flex: 1, gap: 4 },
  title: { fontSize: 22 },
  subtitle: { fontSize: 13 },
  codeBox: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignSelf: 'flex-start',
  },
  codeLabel: { fontSize: 9 },
  code: { fontSize: 14 },
  image: { width: 90, height: 90, marginLeft: 12 },
});
