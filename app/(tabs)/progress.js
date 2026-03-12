import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n';

const BADGES_CONFIG = [
  { id: 'firstNote',  emoji: '🎹', color: '#A29BFE' },
  { id: 'explorer',   emoji: '🌈', color: '#48DBFB' },
  { id: 'quizMaster', emoji: '🏆', color: '#FECA57' },
  { id: 'rhythmPro',  emoji: '🥁', color: '#1DD1A1' },
  { id: 'fireStreak', emoji: '🔥', color: '#FF9F43' },
  { id: 'superStar',  emoji: '⭐', color: '#FF6B6B' },
];

export default function Progress() {
  const { stars, badges, language } = useApp();
  const { t } = useTranslation(language);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('progress.title')}</Text>

      {/* Estrellas */}
      <View style={styles.starsCard}>
        <Text style={styles.starsEmoji}>⭐</Text>
        <Text style={styles.starsCount}>{stars}</Text>
        <Text style={styles.starsLabel}>{t('progress.stars')}</Text>
      </View>

      {/* Medallas */}
      <Text style={styles.sectionTitle}>{t('progress.badges')}</Text>

      {badges.length === 0 ? (
        <Text style={styles.empty}>{t('progress.empty')}</Text>
      ) : (
        <View style={styles.badgesGrid}>
          {BADGES_CONFIG.filter(b => badges.includes(b.id)).map(badge => (
            <View key={badge.id} style={[styles.badgeCard, { borderColor: badge.color }]}>
              <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
              <Text style={styles.badgeName}>{t(`badges.${badge.id}`)}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Todas las medallas (bloqueadas) */}
      <Text style={styles.sectionTitle}>Por desbloquear</Text>
      <View style={styles.badgesGrid}>
        {BADGES_CONFIG.filter(b => !badges.includes(b.id)).map(badge => (
          <View key={badge.id} style={styles.badgeCardLocked}>
            <Text style={styles.badgeEmojiLocked}>{badge.emoji}</Text>
            <Text style={styles.badgeNameLocked}>{t(`badges.${badge.id}`)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D2B',
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FECA57',
    marginBottom: 24,
  },
  starsCard: {
    backgroundColor: '#1a1a3e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FECA57',
  },
  starsEmoji: {
    fontSize: 40,
  },
  starsCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FECA57',
  },
  starsLabel: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    marginTop: 8,
  },
  empty: {
    color: '#555',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 24,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  badgeCard: {
    width: '30%',
    backgroundColor: '#1a1a3e',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  badgeEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  badgeName: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  badgeCardLocked: {
    width: '30%',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
    opacity: 0.4,
  },
  badgeEmojiLocked: {
    fontSize: 32,
    marginBottom: 4,
  },
  badgeNameLocked: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
  },
});