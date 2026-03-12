import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const INITIAL_STATE = {
  childName: 'Amigo',
  language: 'es',
  stars: 0,
  badges: [],
};

export function AppProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);
  const [loaded, setLoaded] = useState(false);

  // Cargar datos guardados al iniciar (= ngOnInit + localStorage)
  useEffect(() => {
    async function loadData() {
      try {
        const saved = await AsyncStorage.getItem('melodykids_state');
        if (saved) setState({ ...INITIAL_STATE, ...JSON.parse(saved) });
      } catch (e) {
        console.warn('Error cargando datos:', e);
      } finally {
        setLoaded(true);
      }
    }
    loadData();
  }, []);

  // Guardar cada vez que cambia el estado (= Angular effect/subscription)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem('melodykids_state', JSON.stringify(state))
      .catch(e => console.warn('Error guardando datos:', e));
  }, [state, loaded]);

  function updateChild(name) {
    setState(prev => ({ ...prev, childName: name }));
  }

  function updateLanguage(lang) {
    setState(prev => ({ ...prev, language: lang }));
  }

  function addStars(amount) {
    setState(prev => ({ ...prev, stars: prev.stars + amount }));
  }

  function unlockBadge(badgeId) {
    setState(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      return { ...prev, badges: [...prev.badges, badgeId] };
    });
  }

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{
      ...state,
      updateChild,
      updateLanguage,
      addStars,
      unlockBadge,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}