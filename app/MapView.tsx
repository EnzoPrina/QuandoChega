// app/MapView.tsx
import React from 'react';
import { View, StyleSheet, Text, useColorScheme } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import busStopsData from '../src/data/busStops.json';
import { BusStop } from '../src/models/BusStopModel';

const MapScreen = () => {
  const scheme = useColorScheme();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 41.805699, // Coordenadas iniciales para centrar el mapa en Bragança
          longitude: -6.757322,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {busStopsData.map((stop: BusStop) => (
          <Marker
            key={stop.id}
            coordinate={stop.coordinates}
            title={`Parada ${stop.id}`}
            description={`Línea ${stop.line}`}
          >
            {/* Número de parada */}
            <View style={styles.markerContainer(stop.line)}>
              <View style={styles.markerCircle(stop.line)}>
                <Text style={styles.markerText}>{stop.id}</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>
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
  markerContainer: (line: string) => ({
    alignItems: 'center',
    justifyContent: 'center',
  }),
  markerCircle: (line: string) => ({
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: line === 'U1' ? 'red' : 'blue', // Color de fondo según la línea
    alignItems: 'center',
    justifyContent: 'center',
  }),
  markerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MapScreen;
