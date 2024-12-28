// app/MapView.tsx
import React from 'react';
import { View, StyleSheet, Text, useColorScheme } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import busStopsData from '../../src/data/busStops.json';
import { BusStop } from '../../src/models/BusStopModel';

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
        {busStopsData.map((stop: BusStop, index: number) => (
          <Marker
            key={`${stop.line}-${stop.number}`}
            coordinate={stop.coordinates}
            title={`Parada ${stop.number}`}
            description={`Línea ${stop.line}`}
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerCircle(stop.line)}>
                <Text style={styles.markerText}>{stop.number}</Text>
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
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCircle: (line: string) => ({
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: getColorByLine(line), // Color dinámico según la línea
    alignItems: 'center',
    justifyContent: 'center',
  }),
  markerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

// Función para obtener el color según la línea
const getColorByLine = (line: string): string => {
  switch (line) {
    case 'U1':
      return '#007722'; // Verde para U1
    case 'U2':
      return '#ede600'; // Amarillo para U2
    case 'U3':
      return '#d6130c'; // Rojo para U3
    default:
      return 'gray'; // Color por defecto
  }
};

export default MapScreen;
