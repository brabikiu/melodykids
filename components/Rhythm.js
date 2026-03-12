import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';

const PATTERNS = [
  { id: 1, sequence: [1, 0, 1, 0], label: '🥁 · 🥁 ·' },
  { id: 2, sequence: [1, 1, 0, 1], label: '🥁 🥁 · 🥁' },
  { id: 3, sequence: [1, 0, 0, 1], label: '🥁 · · 🥁'  },
];

export default function Rhythm() {
  const { language, addStars, unlockBadge, badges } = useApp();
  const { t } = useTranslation(language);

  const [pattern]         = useState(PATTERNS[Math.floor(Math.random() * PATTERNS.length)]);
  const [userInput, setUserInput] = useState([]);
  const [result, setResult]       = useState(null);
  const [rhythmWins, setRhythmWins] = useState(0);
  const timeoutRef = useRef(null);

  function handleTap() {
    if (result) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    const newInput = [...userInput, 1];
    setUserInput(newInput);

    // Llenar los espacios automáticamente
    const full = [...newInput];
    while (full.length < pattern.sequence.length) full.push(0);

    if (newInput.length >= pattern.sequence.length) {
      checkResult(full);
    }
  }

  function checkResult(input) {
    const correct = JSON.stringify(input) === JSON.stringify(pattern.sequence);
    setResult(correct ? 'correct' : 'wrong');

    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addStars(3);
      const wins = rhythmWins + 1;
      setRhythmWins(wins);
      if (wins >= 3 && !badges.includes('rhythmPro')) {
        unlockBadge('rhythmPro');
        addStars(15);
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  function reset() {
    setUserInput([]);
    setResult(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('rhythm.title')}</Text>
      <Text style={styles.instruction}>{t('rhythm.instruction')}</Text>

      {/* Patrón a seguir */}
      <View style={styles.patternCard}>
        <Text style={styles.patternLabel}>Patrón:</Text>
        <Text style={styles.patternEmojis}>{pattern.label}</Text>
      </View>

      {/* Input del usuario */}
      <View style={styles.inputRow}>
        {pattern.sequence.map((_, i) => (
          <View
            key={i}
            style={[
              styles.beat,
              userInput[i] === 1 && styles.beatActive,
            ]}
          >
            <Text style={styles.beatText}>
              {userInput[i] === 1 ? '🥁' : '·'}
            </Text>
          </View>
        ))}
      </View>

      {/* Botón tap */}
      {!result && (
        <TouchableOpacity style={styles.tapBtn} onPress={handleTap}>
          <Text style={styles.tapEmoji}>🥁</Text>
          <Text style={styles.tapLabel}>TAP</Text>
        </TouchableOpacity>
      )}

      {/* Resultado */}
      {result && (
        <>
          <Text style={[
            styles.result,
            { color: result === 'correct' ? '#1DD1A1' : '#FF6B6B' }
          ]}>
            {result === 'correct' ? '¡Perfecto! 🎉' : '¡Inténtalo de nuevo!'}
          </Text>
          <TouchableOpacity style={styles.resetBtn} onPress={reset}>
            <Text style={styles.resetText}>🔄 Otra vez</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 24,
  },
  patternCard: {
    backgroundColor: '#1a1a3e',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#1DD1A1',
  },
  patternLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
  },
  patternEmojis: {
    fontSize: 28,
    letterSpacing: 4,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  beat: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#1a1a3e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  beatActive: {
    backgroundColor: '#1DD1A1',
    borderColor: '#1DD1A1',
  },
  beatText: {
    fontSize: 24,
  },
  tapBtn: {
    backgroundColor: '#FF6B6B',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  tapEmoji: {
    fontSize: 36,
  },
  tapLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  result: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
  },
  resetBtn: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#1a1a3e',
    borderRadius: 12,
  },
  resetText: {
    color: '#fff',
    fontSize: 16,
  },
});