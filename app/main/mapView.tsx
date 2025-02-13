import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  FlatList 
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
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

  // Función auxiliar para convertir "HH:MM" a minutos después de la medianoche (incluyendo segundos en formato fraccional)
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Convertir la hora actual a minutos (incluyendo segundos como fracción)
      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
      
      // Obtener la línea de la ciudad seleccionada
      const cityData = busStopsData?.cities?.find(city => city.name === selectedCity);
      const lineData = cityData?.lines?.find(line => line.line === selectedLine);
      if (!lineData) return;
      
      const stops = lineData.stops;
      if (!stops || stops.length === 0) return;
      
      // Suponemos que todas las paradas tienen el mismo número de horarios
      const departuresCount = stops[0].schedules.length;
      
      // Buscar el índice del recorrido activo comparando el horario de la primera y última parada
      let activeDepartureIndex = null;
      for (let i = 0; i < departuresCount; i++) {
        const startTime = parseTime(stops[0].schedules[i]);
        const endTime = parseTime(stops[stops.length - 1].schedules[i]);
        if (currentTimeInMinutes >= startTime && currentTimeInMinutes <= endTime) {
          activeDepartureIndex = i;
          break;
        }
      }
      
      // Si no se encontró recorrido activo, colocar el autobús en la primera o última parada según corresponda
      if (activeDepartureIndex === null) {
        if (currentTimeInMinutes < parseTime(stops[0].schedules[0])) {
          setBusPosition(stops[0].coordinates);
        } else {
          setBusPosition(stops[stops.length - 1].coordinates);
        }
        return;
      }
      
      // Encontrar entre qué dos paradas se encuentra el autobús
      let segmentIndex = null;
      for (let j = 0; j < stops.length - 1; j++) {
        const timeA = parseTime(stops[j].schedules[activeDepartureIndex]);
        const timeB = parseTime(stops[j + 1].schedules[activeDepartureIndex]);
        if (currentTimeInMinutes >= timeA && currentTimeInMinutes <= timeB) {
          segmentIndex = j;
          break;
        }
      }
      
      // Si el autobús ya pasó la última parada del recorrido activo, mostrarlo en la última parada
      if (segmentIndex === null) {
        setBusPosition(stops[stops.length - 1].coordinates);
        return;
      }
      
      // Interpolar la posición entre la parada segmentIndex y segmentIndex+1
      const timeA = parseTime(stops[segmentIndex].schedules[activeDepartureIndex]);
      const timeB = parseTime(stops[segmentIndex + 1].schedules[activeDepartureIndex]);
      const fraction = (currentTimeInMinutes - timeA) / (timeB - timeA);
      
      const coordA = stops[segmentIndex].coordinates;
      const coordB = stops[segmentIndex + 1].coordinates;
      
      const interpolatedPosition = {
        latitude: coordA.latitude + fraction * (coordB.latitude - coordA.latitude),
        longitude: coordA.longitude + fraction * (coordB.longitude - coordA.longitude),
      };
      
      setBusPosition(interpolatedPosition);
    }, 1000); // Actualiza cada segundo
    
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
          <Marker coordinate={busPosition} title="Autobús en ruta">
            <Text style={styles.busIcon}>🚌</Text>
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
  busIcon: {
    fontSize: 30,
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
