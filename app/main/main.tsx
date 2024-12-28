import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FavoriteStopsModel from '../../src/models/FavoriteStopsModel';

export default function Index() {
  const navigation = useNavigation();
  const scheme = useColorScheme();

  const styles = getStyles(scheme);

  // Obtener paradas favoritas desde el modelo
  const favoriteStops = FavoriteStopsModel.getFavorites();

  return (
    <View style={styles.container}>
      {/* Botón personalizado para "Ver Líneas" */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('lineasView')}
      >
        <Text style={styles.buttonText}>Ver Líneas</Text>
      </TouchableOpacity>

      {/* Botón personalizado para "Ver Mapas" */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('mapView')}
      >
        <Text style={styles.buttonText}>Ver Mapas</Text>
      </TouchableOpacity>

      {/* Lista de paradas favoritas */}
      <View style={styles.favoritesContainer}>
        <Text style={styles.favoritesTitle}>Paradas Favoritas</Text>
        {favoriteStops.length > 0 ? (
          <FlatList
            data={favoriteStops}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Text style={styles.favoriteItem}>{item.name}</Text>
            )}
          />
        ) : (
          <Text style={styles.noFavoritesText}>No tienes paradas favoritas aún.</Text>
        )}
      </View>
    </View>
  );
}

const getStyles = (scheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: scheme === 'dark' ? '#333' : '#f5f5f5',
      padding: 16,
      paddingTop: 120,
    },
    button: {
      width: '100%',
      backgroundColor: 'red',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 10,
      alignSelf: 'center',
      shadowColor: scheme === 'dark' ? '#000' : '#000',
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 5,
    },
    buttonText: {
      color: scheme === 'dark' ? '#fff' : '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    favoritesContainer: {
      marginTop: 20,
      padding: 16,
      alignSelf: 'center',
      width: '100%',
      backgroundColor: scheme === 'dark' ? '#262626' : '#fff',
      borderRadius: 10,
      shadowColor: scheme === 'dark' ? '#000' : '#000',
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 5,
      alignItems: 'center',
    },
    favoritesTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: scheme === 'dark' ? '#fff' : '#000',
      marginBottom: 10,
      textAlign: 'center',
    },
    favoriteItem: {
      fontSize: 16,
      color: scheme === 'dark' ? '#fff' : '#000',
      marginVertical: 5,
    },
    noFavoritesText: {
      fontSize: 16,
      color: scheme === 'dark' ? '#999' : '#666',
      textAlign: 'center',
    },
  });
