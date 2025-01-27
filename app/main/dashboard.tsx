import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  FlatList,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFavoriteStops } from '../../src/context/FavoriteStopsContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../src/data/firebaseConfig';

interface Ad {
  id: string;
  type: 'square' | 'vertical';
  imageUrl: string;
  linkUrl?: string; // Nuevo campo para el enlace
}

export default function Index() {
  const { favoritos, removeFavorito } = useFavoriteStops();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const styles = getStyles(scheme);

  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  // Escucha cambios en las publicidades en Firebase Firestore
  useEffect(() => {
    const adsCollection = collection(db, 'ads');
  
    const unsubscribe = onSnapshot(
      adsCollection,
      (snapshot) => {
        const adsList: Ad[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Ad, 'id'>),
          linkUrl: doc.data().link, // Mapear el campo 'link' a 'linkUrl'
        }));
        setAds(adsList);
        setLoading(false);
      },
      (error) => {
        console.error('Error al escuchar cambios en las publicidades:', error);
        setLoading(false);
      }
    );
  
    return () => unsubscribe(); // Limpia el listener al desmontar el componente
  }, []);

  const handleRemoveFavorite = (stopNumber: number) => {
    removeFavorito(stopNumber);
  };

  const handleAdPress = (linkUrl?: string) => {
    if (linkUrl) {
      console.log('Intentando abrir enlace:', linkUrl);
      Linking.openURL(linkUrl).catch((err) =>
        console.error('Error al abrir el enlace:', err)
      );
    } else {
      console.log('El enlace está vacío o no existe.');
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('lineasView')}>
        <Text style={styles.buttonText}>Ver Líneas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('mapView')}>
        <Text style={styles.buttonText}>Ver Mapas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('game')}>
        <Text style={styles.buttonText}>Game</Text>
      </TouchableOpacity>

      

      <View style={styles.adsContainer}>
        <Text style={styles.adsTitle}>Publicidades Locales</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#5cb32b" />
        ) : ads.length > 0 ? (
          <FlatList
            data={ads}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleAdPress(item.linkUrl)} // Maneja el clic en la publicidad
                style={[styles.adItem, item.type === 'vertical' ? styles.adVertical : styles.adSquare]}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.adImage} resizeMode="cover" />
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noAdsText}>No hay publicidades disponibles.</Text>
        )}
      </View>

      <View style={styles.favoritesContainer}>
        <Text style={styles.favoritesTitle}>Paradas Favoritas</Text>
        {favoritos.length > 0 ? (
          <FlatList
            data={favoritos}
            keyExtractor={(item, index) =>
              item.number ? item.number.toString() : `key-${index}-${Math.random()}`
            }
            renderItem={({ item }) => (
              <View style={[styles.favoriteItem, { backgroundColor: item.color || '#ccc' }]}>
                <Text style={styles.favoriteText}>
                  {item.number ? `Parada ${item.number}` : 'Parada desconocida'} -{' '}
                  {item.name || 'Sin nombre'} ({item.line || 'Sin línea'})
                </Text>
                <TouchableOpacity onPress={() => handleRemoveFavorite(item.number)}>
                  <Text style={styles.removeButton}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noFavoritesText}>No hay paradas favoritas aún.</Text>
        )}
      </View>
    </View>
  );
}

const getStyles = (scheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: scheme === 'dark' ? '#333' : '#f5f5f5',
      paddingTop: 180,
    },
    button: {
      padding: 10,
      backgroundColor: '#5cb32b',
      marginBottom: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    adsContainer: {
      marginVertical: 20,
    },
    adsTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: scheme === 'dark' ? '#fff' : '#000',
      marginBottom: 10,
    },
    adItem: {
      flex: 1,
      margin: 5,
      borderRadius: 10,
      overflow: 'hidden',
    },
    adVertical: {
      height: 200,
    },
    adSquare: {
      height: 100,
    },
    adImage: {
      width: '100%',
      height: '100%',
    },
    noAdsText: {
      fontSize: 16,
      color: scheme === 'dark' ? '#fff' : '#000',
      textAlign: 'center',
    },
    favoritesContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
    favoritesTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: scheme === 'dark' ? '#fff' : '#000',
      marginBottom: 10,
    },
    favoriteItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      justifyContent: 'space-between',
    },
    favoriteText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    removeButton: {
      fontSize: 20,
      color: '#fff',
    },
    noFavoritesText: {
      color: scheme === 'dark' ? '#232323' : '#000',
      fontSize: 18,
      textAlign: 'center',
    },
  });
