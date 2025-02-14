import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  FlatList,
  Image
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import busStopsData from '../../src/data/busStops.json';

const MapViewScreen = () => {
  const [selectedCity, setSelectedCity] = useState("Bragança");
  const [selectedLine, setSelectedLine] = useState("U1");
  const [menuVisible, setMenuVisible] = useState(false);
  const [busPosition, setBusPosition] = useState(null);
  const [region, setRegion] = useState({
    latitude: 41.805699,
    longitude: -6.757322,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Función auxiliar para convertir "HH:MM" a minutos después de la medianoche
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Función para simular una ruta curvada (tipo Bézier) entre dos coordenadas,
  // de forma que el autobús simule seguir las calles en vez de ir en línea recta.
  const getCurvedPosition = (coordA, coordB, t) => {
    // Punto medio entre A y B
    const midPoint = {
      latitude: (coordA.latitude + coordB.latitude) / 2,
      longitude: (coordA.longitude + coordB.longitude) / 2,
    };
    // Vector de A a B
    const dx = coordB.latitude - coordA.latitude;
    const dy = coordB.longitude - coordA.longitude;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Calcular vector perpendicular (-dy, dx)
    let perp = { latitude: -dy, longitude: dx };
    const length = Math.sqrt(perp.latitude * perp.latitude + perp.longitude * perp.longitude);
    if (length !== 0) {
      perp = { latitude: perp.latitude / length, longitude: perp.longitude / length };
    }
    // Offset proporcional a la distancia (ajusta 0.1 para modificar la curvatura)
    const offsetMagnitude = 0.1 * distance;
    const controlPoint = {
      latitude: midPoint.latitude + offsetMagnitude * perp.latitude,
      longitude: midPoint.longitude + offsetMagnitude * perp.longitude,
    };

    // Interpolación cuadrática Bézier
    const oneMinusT = 1 - t;
    const latitude = oneMinusT * oneMinusT * coordA.latitude +
                     2 * oneMinusT * t * controlPoint.latitude +
                     t * t * coordB.latitude;
    const longitude = oneMinusT * oneMinusT * coordA.longitude +
                      2 * oneMinusT * t * controlPoint.longitude +
                      t * t * coordB.longitude;
    return { latitude, longitude };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
      
      const cityData = busStopsData?.cities?.find(city => city.name === selectedCity);
      const lineData = cityData?.lines?.find(line => line.line === selectedLine);
      if (!lineData) return;
      
      const stops = lineData.stops;
      if (!stops || stops.length === 0) return;
      
      const departuresCount = stops[0].schedules.length;
      
      let activeDepartureIndex = null;
      for (let i = 0; i < departuresCount; i++) {
        const startTime = parseTime(stops[0].schedules[i]);
        const endTime = parseTime(stops[stops.length - 1].schedules[i]);
        if (currentTimeInMinutes >= startTime && currentTimeInMinutes <= endTime) {
          activeDepartureIndex = i;
          break;
        }
      }
      
      if (activeDepartureIndex === null) {
        if (currentTimeInMinutes < parseTime(stops[0].schedules[0])) {
          setBusPosition(stops[0].coordinates);
        } else {
          setBusPosition(stops[stops.length - 1].coordinates);
        }
        return;
      }
      
      let segmentIndex = null;
      for (let j = 0; j < stops.length - 1; j++) {
        const timeA = parseTime(stops[j].schedules[activeDepartureIndex]);
        const timeB = parseTime(stops[j + 1].schedules[activeDepartureIndex]);
        if (currentTimeInMinutes >= timeA && currentTimeInMinutes <= timeB) {
          segmentIndex = j;
          break;
        }
      }
      
      if (segmentIndex === null) {
        setBusPosition(stops[stops.length - 1].coordinates);
        return;
      }
      
      const timeA = parseTime(stops[segmentIndex].schedules[activeDepartureIndex]);
      const timeB = parseTime(stops[segmentIndex + 1].schedules[activeDepartureIndex]);
      const t = (currentTimeInMinutes - timeA) / (timeB - timeA);
      
      const coordA = stops[segmentIndex].coordinates;
      const coordB = stops[segmentIndex + 1].coordinates;
      
      // Obtener posición curvada para simular que el autobús sigue las calles
      const interpolatedPosition = getCurvedPosition(coordA, coordB, t);
      
      setBusPosition(interpolatedPosition);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [selectedCity, selectedLine]);

  const cityData = busStopsData?.cities?.find(city => city.name === selectedCity);
  const lines = cityData?.lines || [];
  const allStops = lines.flatMap(line =>
    line.stops.map(stop => ({
      ...stop,
      line: line.line,
      color: line.color,
    }))
  );
  const filteredStops = allStops.filter(stop => stop.line === selectedLine);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
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
        {busPosition && (
          <Marker coordinate={busPosition} title="Autobús en ruta" zIndex={1000}>
            <Image source={require('../../assets/images/parada.png')} style={styles.busImage} />
          </Marker>
        )}
      </MapView>
      <TouchableOpacity style={styles.fab} onPress={() => setMenuVisible(prev => !prev)}>
        <Text style={styles.fabIcon}>{selectedLine ? selectedLine : "🚌"}</Text>
      </TouchableOpacity>
      {menuVisible && (
        <View style={styles.menu}>
          <FlatList
            data={lines}
            keyExtractor={(item) => item.line}
            renderItem={({ item }) => (
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
  busImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  fab: {
    position: 'absolute',
    bottom: 420,
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
    bottom: 150,
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
