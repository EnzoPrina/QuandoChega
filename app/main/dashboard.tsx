
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFavoriteStops } from '../../src/context/FavoriteStopsContext';

export default function Index() {
  const { favoritos } = useFavoriteStops();
  const navigation = useNavigation();
  const scheme = useColorScheme();

  const styles = getStyles(scheme);

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
            keyExtractor={(item, index) =>
              item.number ? item.number.toString() : `key-${index}-${Math.random()}`
            }
            renderItem={({ item }) => (
              <View style={[styles.favoriteItem, { backgroundColor: item.color || '#ccc' }]}>
                <Text style={styles.favoriteText}>
                  {item.number ? `Parada ${item.number}` : 'Parada desconocida'} - {item.name || 'Sin nombre'} (
                  {item.line || 'Sin línea'})
                </Text>
              </View>
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
      paddingTop: 180,
    },
    button: {
      width: '100%',
      backgroundColor: '#5cb32b',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    favoritesContainer: {
      marginTop: 20,
      padding: 16,
      backgroundColor: scheme === 'dark' ? '#262626' : '#fff',
      borderRadius: 10,
    },
    favoritesTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: scheme === 'dark' ? '#fff' : '#000',
      marginBottom: 10,
    },
    favoriteItem: {
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    favoriteText: {
      fontSize: 16,
      color: '#fff',
    },
    noFavoritesText: {
      fontSize: 16,
      color: scheme === 'dark' ? '#999' : '#666',
      textAlign: 'center',
    },
  });
