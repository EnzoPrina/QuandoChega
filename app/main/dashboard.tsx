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
        console.error('Erro ao ouvir mudanças nos anúncios:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAdPress = (linkUrl?: string) => {
    if (linkUrl) {
      Linking.openURL(linkUrl).catch((err) =>
        console.error('Erro ao abrir o link:', err)
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Seção de Jogos */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Jogos Disponíveis</Text>
        <View style={styles.gamesContainer}>
          <TouchableOpacity style={styles.gameButton} onPress={() => navigation.navigate('game')}>
            <Image source={require('../../assets/images/2d/port3.png')} style={styles.gameImage} resizeMode="cover" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.gameButton} onPress={() => navigation.navigate('flappy')}>
            <Image source={require('../../assets/images/2d/port1.png')} style={styles.gameImage} resizeMode="cover" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Botões de Navegação */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Explorar</Text>
        <View style={styles.rowContainer}>
          <TouchableOpacity style={styles.halfButton} onPress={() => navigation.navigate('lineasView')}>
            <Text style={styles.buttonText}>Ver Linhas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.halfButton} onPress={() => navigation.navigate('mapView')}>
            <Text style={styles.buttonText}>Ver Mapas</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Separador */}
      <View style={styles.divider} />

      {/* Anúncios Locais */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Anúncios Locais</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#5cb32b" />
        ) : ads.length > 0 ? (
          <FlatList
            data={ads}
            keyExtractor={(item) => item.id}
            numColumns={2} // Organiza os anúncios em um grid de 2 colunas
            columnWrapperStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleAdPress(item.linkUrl)} style={styles.adItem}>
                <Image source={{ uri: item.imageUrl }} style={styles.adImage} resizeMode="cover" />
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noAdsText}>Nenhum anúncio disponível.</Text>
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
      paddingTop: 120,
    },
    sectionContainer: {
      marginBottom: 25,
      padding: 15,
      borderRadius: 10,
      backgroundColor: scheme === 'dark' ? '#444' : '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: scheme === 'dark' ? '#fff' : '#000',
      marginBottom: 10,
      textAlign: 'center',
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
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
    gridContainer: {
      justifyContent: 'space-between',
    },
    adItem: {
      flex: 1,
      margin: 5,
      aspectRatio: 1,
      borderRadius: 8, // Bordas arredondadas mínimas
      overflow: 'hidden',
      backgroundColor: '#ddd',
    },
    adImage: {
      width: '100%',
      height: '100%',
      borderRadius: 8, // Bordas arredondadas mínimas
    },
    noAdsText: {
      fontSize: 16,
      color: scheme === 'dark' ? '#fff' : '#000',
      textAlign: 'center',
    },
    divider: {
      height: 2,
      backgroundColor: '#ccc',
      marginVertical: 10,
    },
  });
