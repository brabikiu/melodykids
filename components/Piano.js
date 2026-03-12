
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';

const NOTES = [
  { name: 'DO', emoji: '🐶', color: '#FF6B6B', freq: 261.63 },
  { name: 'RE', emoji: '🐱', color: '#FF9F43', freq: 293.66 },
  { name: 'MI', emoji: '🐭', color: '#FECA57', freq: 329.63 },
  { name: 'FA', emoji: '🐸', color: '#48DBFB', freq: 349.23 },
  { name: 'SOL', emoji: '🐻', color: '#1DD1A1', freq: 392.00 },
  { name: 'LA', emoji: '🦊', color: '#A29BFE', freq: 440.00 },
  { name: 'SI', emoji: '🦁', color: '#FF9FF3', freq: 493.88 },
];

function playWebSound(freq) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1);
  } catch (e) {}
}

function PianoKey({ note, onPress }) {
  const scale = useSharedValue(1);
  const brightness = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: brightness.value,
  }));

  function handlePress() {
    // Animación: tecla se presiona hacia abajo y rebota
    scale.value = withSequence(
      withTiming(0.88, { duration: 80 }),
      withSpring(1, { damping: 4, stiffness: 200 }),
    );
    brightness.value = withSequence(
      withTiming(0.7, { duration: 80 }),
      withTiming(1, { duration: 300 }),
    );
    onPress(note);
  }

  return (
    <Animated.View style={animatedStyle}>
      <Animated.View
        style={[styles.key, { backgroundColor: note.color }]}
        onStartShouldSetResponder={() => true}
        onResponderGrant={handlePress}
      >
        <Text style={styles.keyEmoji}>{note.emoji}</Text>
        <Text style={styles.keyName}>{note.name}</Text>
      </Animated.View>
    </Animated.View>
  );
}

function NoteDisplay({ lastNote, hint }) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (lastNote) {
      scale.value = withSequence(
        withTiming(0.8, { duration: 0 }),
        withSpring(1, { damping: 6, stiffness: 180 }),
      );
      opacity.value = withTiming(1, { duration: 150 });
    }
  }, [lastNote]);

  return (
    <View style={[styles.display, lastNote && { borderColor: lastNote.color }]}>
      {lastNote ? (
        <Animated.View style={[animatedStyle, { alignItems: 'center' }]}>
          <Text style={styles.displayEmoji}>{lastNote.emoji}</Text>
          <Text style={[styles.displayNote, { color: lastNote.color }]}>
            {lastNote.name}
          </Text>
          <Text style={styles.displayAnimal}>{lastNote.animal}</Text>
        </Animated.View>
      ) : (
        <Text style={styles.displayHint}>{hint}</Text>
      )}
    </View>
  );
}

export default function Piano() {
  const { language, addStars, unlockBadge, badges } = useApp();
  const { t } = useTranslation(language);
  const [lastNote, setLastNote] = useState(null);
  const [playedNotes, setPlayedNotes] = useState(new Set());

  async function handleNotePress(note) {
    if (Platform.OS === 'web') {
      playWebSound(note.freq);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const noteWithAnimal = { ...note, animal: t(`piano.${note.name}`) };
    setLastNote(noteWithAnimal);

    if (!badges.includes('firstNote')) {
      unlockBadge('firstNote');
      addStars(5);
    }

    const newPlayed = new Set(playedNotes).add(note.name);
    setPlayedNotes(newPlayed);

    if (newPlayed.size === 7 && !badges.includes('explorer')) {
      unlockBadge('explorer');
      addStars(10);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('piano.title')}</Text>

      <NoteDisplay
        lastNote={lastNote}
        hint={t('piano.instruction')}
      />

      <View style={styles.keys}>
        {NOTES.map(note => (
          <PianoKey
            key={note.name}
            note={note}
            onPress={handleNotePress}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  display: {
    backgroundColor: '#1a1a3e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#333',
    minHeight: 120,
    justifyContent: 'center',
  },
  displayEmoji: { fontSize: 48 },
  displayNote: { fontSize: 32, fontWeight: 'bold', marginTop: 4 },
  displayAnimal: { fontSize: 16, color: '#aaa', marginTop: 4 },
  displayHint: { fontSize: 16, color: '#555' },
keys: {
  flexDirection: 'row',
  gap: 6,
  justifyContent: 'center',
  flexWrap: 'nowrap',
},
 key: {
  width: 42,
  height: 74,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingBottom: 8,
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
},
  keyEmoji: { fontSize: 20 },
  keyName: { fontSize: 10, fontWeight: 'bold', color: '#000', marginTop: 2 },
});