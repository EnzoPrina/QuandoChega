import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import busStopsData from '../../src/data/busStops.json';

const MapScreen = () => {
  const [selectedCity, setSelectedCity] = useState("Bragança"); // Ciudad seleccionada
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Obtener las líneas y paradas de la ciudad seleccionada
  const cityData = busStopsData.cities.find((city: any) => city.name === selectedCity);

  const lines = cityData?.lines || [];
  const allStops = lines.flatMap((line: any) =>
    line.stops.map((stop: any) => ({
      ...stop,
      line: line.line,
      color: line.color,
    }))
  );

  // Filtrar las paradas según la línea seleccionada
  const filteredStops = selectedLine
    ? allStops.filter((stop) => stop.line === selectedLine)
    : allStops;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 41.805699,
          longitude: -6.757322,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {filteredStops.map((stop, index) => (
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
        onPress={() => setMenuVisible((prev) => !prev)}
      >
        <Text style={styles.fabIcon}>🚌</Text>
      </TouchableOpacity>

      {/* Menú desplegable */}
      {menuVisible && (
        <View style={styles.menu}>
          <FlatList
            data={lines}
            keyExtractor={(item) => item.line}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.menuItem, { backgroundColor: item.color }]}
                onPress={() => {
                  setSelectedLine(item.line); // Seleccionar línea
                  setMenuVisible(false); // Cerrar el menú automáticamente
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
    bottom: 600,
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
    fontSize: 30,
    color: 'white',
  },
  menu: {
    position: 'absolute',
    bottom: 280,
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

export default MapScreen;
