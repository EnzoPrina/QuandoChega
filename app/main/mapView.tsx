import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Alert 
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import busStopsData from '../../src/data/busStops.json';

const MapViewScreen = () => {
  const [selectedCity, setSelectedCity] = useState("Bragança");
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 41.805699,
    longitude: -6.757322,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationPermission(false);
        Alert.alert(
          "Permiso Denegado",
          "Para ver tu ubicación, ve a la configuración y activa los permisos de ubicación.",
          [{ text: "OK" }]
        );
        return;
      }
      setLocationPermission(true);
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    };
    getLocationPermission();
  }, []);

  // Obtener datos de la ciudad seleccionada
  const cityData = busStopsData.cities.find((city: any) => city.name === selectedCity);
  const lines = cityData?.lines || [];

  // Obtener todas las paradas de todas las líneas
  const allStops = lines.flatMap((line: any) =>
    line.stops.map((stop: any) => ({
      ...stop,
      line: line.line,
      color: line.color,
    }))
  );

  // Filtrar paradas visibles dentro del zoom del mapa
  const filteredStops = selectedLine
    ? allStops.filter((stop: any) => stop.line === selectedLine)
    : allStops.filter((stop: any) =>
        stop.coordinates.latitude >= region.latitude - region.latitudeDelta &&
        stop.coordinates.latitude <= region.latitude + region.latitudeDelta &&
        stop.coordinates.longitude >= region.longitude - region.longitudeDelta &&
        stop.coordinates.longitude <= region.longitude + region.longitudeDelta
      );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={locationPermission === true}
      >
        {filteredStops.map((stop: any, index: number) => (
          <Marker
            key={`${stop.line}-${stop.number}-${index}`}
            coordinate={stop.coordinates}
            title={`Parada ${stop.number} - ${stop.name}`}
            description={`Línea ${stop.line}`}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.markerCircle, { backgroundColor: stop.color }]}>
                <Text style={styles.markerText}>{stop.number}</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Botón flotante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setMenuVisible(prev => !prev)}
      >
        <Text style={styles.fabIcon}>{selectedLine ? selectedLine : "🚌"}</Text>
      </TouchableOpacity>

      {/* Menú desplegable */}
      {menuVisible && (
        <View style={styles.menu}>
          <FlatList
            data={lines}
            keyExtractor={(item: any) => item.line}
            renderItem={({ item }: { item: any }) => (
              <TouchableOpacity
                style={[styles.menuItem, { backgroundColor: item.color }]}
                onPress={() => {
                  setSelectedLine(item.line);
                  setMenuVisible(false);
                }}
              >
                <Text style={styles.menuItemText}>{item.line}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCircle: {
    width: 45,
    height: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 500,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#5cb32b',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabIcon: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  menu: {
    position: 'absolute',
    bottom: 180,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  menuItemText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MapViewScreen;
