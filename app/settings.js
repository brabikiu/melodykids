import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { useTranslation, LANGUAGES } from '../i18n';

export default function Settings() {
  const router = useRouter();
  const { childName, language, updateChild, updateLanguage } = useApp();
  const { t } = useTranslation(language);

  const [name, setName] = useState(childName);

  function handleSave() {
    updateChild(name.trim() || 'Amigo');
    router.back();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('settings.title')}</Text>

      {/* Nombre del niño */}
      <Text style={styles.label}>{t('settings.childName')}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ej: Sofía"
        placeholderTextColor="#555"
        maxLength={20}
      />

      {/* Selector de idioma */}
      <Text style={styles.label}>{t('settings.language')}</Text>
      <View style={styles.languages}>
        {LANGUAGES.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.langBtn,
              language === lang.code && styles.langBtnActive,
            ]}
            onPress={() => updateLanguage(lang.code)}
          >
            <Text style={styles.langFlag}>{lang.flag}</Text>
            <Text style={[
              styles.langLabel,
              language === lang.code && styles.langLabelActive,
            ]}>
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón guardar */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>{t('settings.save')}</Text>
      </TouchableOpacity>

      {/* Botón volver */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>← Volver</Text>
      </TouchableOpacity>
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
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1a1a3e',
    color: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#333',
  },
  languages: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  langBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1a1a3e',
    borderWidth: 1,
    borderColor: '#333',
  },
  langBtnActive: {
    borderColor: '#FECA57',
    backgroundColor: '#2a2a4e',
  },
  langFlag: {
    fontSize: 28,
    marginBottom: 4,
  },
  langLabel: {
    fontSize: 12,
    color: '#aaa',
  },
  langLabelActive: {
    color: '#FECA57',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#FECA57',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveBtnText: {
    color: '#0D0D2B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backBtn: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  backBtnText: {
    color: '#aaa',
    fontSize: 16,
  },
});