import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';

const NOTES = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'];
const COLORS = {
  DO: '#FF6B6B', RE: '#FF9F43', MI: '#FECA57',
  FA: '#48DBFB', SOL: '#1DD1A1', LA: '#A29BFE', SI: '#FF9FF3',
};

function getOptions(correct) {
  const others = NOTES.filter(n => n !== correct)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return [...others, correct].sort(() => Math.random() - 0.5);
}

export default function Quiz() {
  const { language, addStars, unlockBadge, badges } = useApp();
  const { t } = useTranslation(language);

  const [correct, setCorrect]   = useState(() => NOTES[Math.floor(Math.random() * 7)]);
  const [options, setOptions]   = useState(() => getOptions(correct));
  const [selected, setSelected] = useState(null);
  const [streak, setStreak]     = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  function nextQuestion(note) {
    setCorrect(note);
    setOptions(getOptions(note));
    setSelected(null);
  }

  async function handleAnswer(note) {
    if (selected) return;
    setSelected(note);

    if (note === correct) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addStars(2);
      const newStreak = streak + 1;
      const newTotal  = totalCorrect + 1;
      setStreak(newStreak);
      setTotalCorrect(newTotal);

      if (newStreak >= 5 && !badges.includes('fireStreak')) {
        unlockBadge('fireStreak');
        addStars(15);
      }
      if (newTotal >= 10 && !badges.includes('quizMaster')) {
        unlockBadge('quizMaster');
        addStars(20);
      }
      setTimeout(() => nextQuestion(NOTES[Math.floor(Math.random() * 7)]), 1200);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setStreak(0);
      setTimeout(() => nextQuestion(NOTES[Math.floor(Math.random() * 7)]), 1500);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('quiz.title')}</Text>

      {/* Streak */}
      {streak > 0 && (
        <Text style={styles.streak}>🔥 Racha: {streak}</Text>
      )}

      {/* Pregunta */}
      <View style={[styles.question, { borderColor: COLORS[correct] }]}>
        <Text style={styles.questionEmoji}>🎵</Text>
        <Text style={[styles.questionNote, { color: COLORS[correct] }]}>
          {correct}
        </Text>
        <Text style={styles.questionText}>{t('quiz.question')}</Text>
      </View>

      {/* Opciones */}
      <View style={styles.options}>
        {options.map(note => {
          let bgColor = '#1a1a3e';
          if (selected === note) {
            bgColor = note === correct ? '#1DD1A1' : '#FF6B6B';
          }
          return (
            <TouchableOpacity
              key={note}
              style={[styles.option, { backgroundColor: bgColor }]}
              onPress={() => handleAnswer(note)}
              disabled={!!selected}
            >
              <Text style={styles.optionText}>{note}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback */}
      {selected && (
        <Text style={[
          styles.feedback,
          { color: selected === correct ? '#1DD1A1' : '#FF6B6B' }
        ]}>
          {selected === correct
            ? t('quiz.correct')
            : t('quiz.wrong', { note: correct })}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  streak: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FF9F43',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  question: {
    backgroundColor: '#1a1a3e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
  },
  questionEmoji: {
    fontSize: 40,
  },
  questionNote: {
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 4,
  },
  questionText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  option: {
    width: '45%',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  optionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  feedback: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
});