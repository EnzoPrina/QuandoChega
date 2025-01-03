// src/context/FavoriteStopsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Stop {
  number: number;
  name: string;
  line: string;
  color: string;
}

interface FavoriteStopsContextType {
  favoritos: Stop[];
  addFavorito: (stop: Stop) => void;
  removeFavorito: (stopNumber: number) => void;
}

const FavoriteStopsContext = createContext<FavoriteStopsContextType | undefined>(undefined);

export const useFavoriteStops = () => {
  const context = useContext(FavoriteStopsContext);
  if (!context) {
    throw new Error('useFavoriteStops must be used within a FavoriteStopsProvider');
  }
  return context;
};

export const FavoriteStopsProvider: React.FC = ({ children }) => {
  const [favoritos, setFavoritos] = useState<Stop[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favoritos');
        if (storedFavorites) {
          setFavoritos(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  const addFavorito = async (stop: Stop) => {
    if (!favoritos.some((fav) => fav.number === stop.number)) {
      const updatedFavorites = [...favoritos, stop];
      setFavoritos(updatedFavorites);
      try {
        await AsyncStorage.setItem('favoritos', JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error('Error saving favorite:', error);
      }
    }
  };

  const removeFavorito = async (stopNumber: number) => {
    const updatedFavorites = favoritos.filter((stop) => stop.number !== stopNumber);
    setFavoritos(updatedFavorites);
    try {
      await AsyncStorage.setItem('favoritos', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <FavoriteStopsContext.Provider value={{ favoritos, addFavorito, removeFavorito }}>
      {children}
    </FavoriteStopsContext.Provider>
  );
};
