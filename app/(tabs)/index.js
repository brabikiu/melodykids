import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n';
import Piano from '../../components/Piano';
import Quiz from '../../components/Quiz';
import Rhythm from '../../components/Rhythm';

const ACTIVITIES = [
  { id: 'piano',  emoji: '🎹', color: '#A29BFE' },
  { id: 'quiz',   emoji: '🎓', color: '#48DBFB' },
  { id: 'rhythm', emoji: '🥁', color: '#1DD1A1' },
];

export default function Home() {
  const router = useRouter();
  const { childName, language } = useApp();
  const { t } = useTranslation(language);
  const [active, setActive] = useState('piano');
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {t('home.greeting', { name: childName })}
        </Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Text style={styles.settingsBtn}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {ACTIVITIES.map(act => (
          <TouchableOpacity
            key={act.id}
            style={[
              styles.tab,
              active === act.id && { borderColor: act.color, borderBottomWidth: 3 },
            ]}
            onPress={() => setActive(act.id)}
          >
            <Text style={styles.tabEmoji}>{act.emoji}</Text>
            <Text style={[
              styles.tabLabel,
              active === act.id && { color: act.color },
            ]}>
              {t(`${act.id}.title`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        {active === 'piano'  && <Piano />}
        {active === 'quiz'   && <Quiz />}
        {active === 'rhythm' && <Rhythm />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D2B',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  settingsBtn: {
    fontSize: 28,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a3e',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderColor: 'transparent',
  },
  tabEmoji: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 11,
    color: '#555',
    marginTop: 2,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
});