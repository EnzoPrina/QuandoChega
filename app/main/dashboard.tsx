// Index.tsx
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFavoriteStops } from '../../src/context/FavoriteStopsContext';

export default function Index() {
  const { favoritos, removeFavorito } = useFavoriteStops();
  const navigation = useNavigation();
  const scheme = useColorScheme();

  const styles = getStyles(scheme);

  const handleRemoveFavorite = (stopNumber: number) => {
    removeFavorito(stopNumber);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('lineasView')}>
        <Text style={styles.buttonText}>Ver Líneas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('mapView')}>
        <Text style={styles.buttonText}>Ver Mapas</Text>
      </TouchableOpacity>

      <View style={styles.favoritesContainer}>
        <Text style={styles.favoritesTitle}>Paradas Favoritas</Text>
        {favoritos.length > 0 ? (
          <FlatList
            data={favoritos}
            keyExtractor={(item, index) => item.number ? item.number.toString() : `key-${index}-${Math.random()}`}
            renderItem={({ item }) => (
              <View style={[styles.favoriteItem, { backgroundColor: item.color || '#ccc' }]}>
                <Text style={styles.favoriteText}>
                  {item.number ? `Parada ${item.number}` : 'Parada desconocida'} - {item.name || 'Sin nombre'} (
                  {item.line || 'Sin línea'})
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
      backgroundColor: '#007722',
      marginBottom: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
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
