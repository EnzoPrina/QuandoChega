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
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../src/data/firebaseConfig';

interface Ad {
  id: string;
  type: 'square' | 'vertical';
  imageUrl: string;
  linkUrl?: string;
}

export default function Index() {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const styles = getStyles(scheme);

  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adsCollection = collection(db, 'ads');

    const unsubscribe = onSnapshot(
      adsCollection,
      (snapshot) => {
        const adsList: Ad[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Ad, 'id'>),
          linkUrl: doc.data().link,
        }));
        setAds(adsList);
        setLoading(false);
      },
      (error) => {
        console.error('Error al escuchar cambios en las publicidades:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAdPress = (linkUrl?: string) => {
    if (linkUrl) {
      Linking.openURL(linkUrl).catch((err) =>
        console.error('Error al abrir el enlace:', err)
      );
    }
  };

  return (
    <View style={styles.container}>
            {/* Botones con imágenes de DynoBus y BusBird */}
            <Text style={styles.adsTitle}>Aproveite os nossos jogos!</Text>
            <View style={styles.gamesContainer}>
        <TouchableOpacity style={styles.gameButton} onPress={() => navigation.navigate('game')}>
          <Image source={require('../../assets/images/2d/port2.png')} style={styles.gameImage} resizeMode="cover" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.gameButton} onPress={() => navigation.navigate('flappy')}>
          <Image source={require('../../assets/images/2d/port1.png')} style={styles.gameImage} resizeMode="cover" />
        </TouchableOpacity>
      </View>
      {/* Botones de Ver Líneas y Ver Mapas */}
      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.halfButton} onPress={() => navigation.navigate('lineasView')}>
          <Text style={styles.buttonText}>Ver Líneas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.halfButton} onPress={() => navigation.navigate('mapView')}>
          <Text style={styles.buttonText}>Ver Mapas</Text>
        </TouchableOpacity>
      </View>


      {/* Publicidades Locales */}
      <View style={styles.adsContainer}>
        <Text style={styles.adsTitle}>Publicidades Locales</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#5cb32b" />
        ) : ads.length > 0 ? (
          <FlatList
            data={ads}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleAdPress(item.linkUrl)}
                style={styles.adItem}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.adImage} resizeMode="contain" />
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noAdsText}>No hay publicidades disponibles.</Text>
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
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    halfButton: {
      flex: 0.48,
      padding: 15,
      backgroundColor: '#5cb32b',
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    gamesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    gameButton: {
      flex: 0.48,
      aspectRatio: 1,
      borderRadius: 10,
      overflow: 'hidden',
    },
    gameImage: {
      width: '100%',
      height: '100%',
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
    adImage: {
      width: '100%',
      height: '100%',
      aspectRatio: 1,
    },
    noAdsText: {
      fontSize: 16,
      color: scheme === 'dark' ? '#fff' : '#000',
      textAlign: 'center',
    },
  });
