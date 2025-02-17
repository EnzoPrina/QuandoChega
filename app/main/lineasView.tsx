import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  useColorScheme,
  Image,
} from "react-native";
// @ts-ignore
import { db } from "../../src/data/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import React from "react";

export default function BusStopsApp() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedStops, setExpandedStops] = useState({});
  // Estado para la simulación: índice de la parada en la que se encuentra el autobús
  const [activeStopIndex, setActiveStopIndex] = useState(-1);
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? "#202020" : "#f5f5f5";

  // Obtención de datos desde Firebase (sin cambios)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "ciudades"), (snapshot) => {
      const cityMap = {};
      snapshot.docs.forEach((doc) => {
        const cityData = doc.data();
        if (!cityMap[cityData.city]) {
          cityMap[cityData.city] = {
            city: cityData.city,
            lines: [],
          };
        }
        cityMap[cityData.city].lines.push(cityData.line);
      });
      const groupedCities = Object.values(cityMap);
      setCities(groupedCities);
    });

    return () => unsubscribe();
  }, []);

  const fetchLines = (city) => {
    setSelectedCity(city);
  };

  const openLineDetails = (line) => {
    setSelectedLine(line);
    setShowModal(true);
  };

  const toggleDropdown = (stopIndex) => {
    setExpandedStops((prev) => ({
      ...prev,
      [stopIndex]: !prev[stopIndex],
    }));
  };

  // Función auxiliar: convierte "HH:MM" a minutos desde medianoche
  const parseTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") {
      console.warn("parseTime recibió un valor inválido:", timeStr);
      return 0;
    }
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Devuelve la hora actual en minutos (incluyendo segundos fraccionales)
  const getCurrentTimeInMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  };

  // Efecto para simular en tiempo real el avance del autobús en la línea seleccionada
  useEffect(() => {
    let timer;
    if (selectedLine && selectedLine.stops && selectedLine.stops.length > 0) {
      timer = setInterval(() => {
        const currentTime = getCurrentTimeInMinutes();

        // Utilizamos los horarios de la primera parada para determinar qué salida (viaje) está activa
        const firstStopSchedules = selectedLine.stops[0].schedules;
        if (!firstStopSchedules || firstStopSchedules.length === 0) {
          setActiveStopIndex(-1);
          return;
        }
        let activeDeparture = null;
        for (let i = 0; i < firstStopSchedules.length; i++) {
          const t = parseTime(firstStopSchedules[i]);
          if (
            currentTime >= t &&
            (i === firstStopSchedules.length - 1 ||
              currentTime < parseTime(firstStopSchedules[i + 1]))
          ) {
            activeDeparture = i;
            break;
          }
        }
        if (activeDeparture === null) {
          setActiveStopIndex(-1);
        } else {
          let index = -1;
          selectedLine.stops.forEach((stop, i) => {
            const scheduleValue = stop.schedules && stop.schedules[activeDeparture];
            if (scheduleValue) {
              const t = parseTime(scheduleValue);
              if (currentTime >= t) {
                index = i;
              }
            }
          });
          setActiveStopIndex(index);
        }
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [selectedLine]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {!selectedCity ? (
        <FlatList
          data={cities}
          keyExtractor={(item) => item.city}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cityButton}
              onPress={() => fetchLines(item)}
            >
              <Text style={styles.cityText}>{item.city}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={selectedCity.lines}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const lineColor = item.color.startsWith("#")
              ? item.color
              : `#${item.color}`;
            return (
              <TouchableOpacity
                style={[styles.lineButton, { backgroundColor: lineColor }]}
                onPress={() => openLineDetails(item)}
              >
                <Text style={styles.lineText}>Línea: {item.number}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {selectedCity && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedCity(null)}
        >
          <Text style={styles.backText}>Volver a ciudades</Text>
        </TouchableOpacity>
      )}

      <Modal visible={showModal} animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <Text style={styles.modalTitle}>Línea {selectedLine?.number}</Text>
          <FlatList
            data={selectedLine?.stops || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const isExpanded = expandedStops[index];
              const lineColor = selectedLine?.color.startsWith("#")
                ? selectedLine.color
                : `#${selectedLine.color}`;
              return (
                <View key={index}>
                  <TouchableOpacity
                    style={[styles.stopContainer, { backgroundColor: lineColor }]}
                    onPress={() =>
                      // Solo permitimos expandir horarios en la primera parada
                      index === 0 && item.schedules.length > 1 && toggleDropdown(index)
                    }
                  >
                    <View style={styles.stopInfo}>
                      {activeStopIndex === index && (
                        <Image
                          source={require("../../assets/images/autobus.png")}
                          style={styles.busImage}
                        />
                      )}
                      <Text style={styles.stopText}>
                        {item.stopNumber} {item.stopName}
                      </Text>
                    </View>
                    {/* Solo se muestran los horarios en la primera parada */}
                    {index === 0 && (
                      <Text style={styles.scheduleText}>
                        {item.schedules.length > 1
                          ? isExpanded
                            ? "Ver horarios ↑"
                            : "Horarios ↓"
                          : item.schedules[0]}
                      </Text>
                    )}
                  </TouchableOpacity>
                  {/* Solo se muestran los horarios expandibles en la primera parada */}
                  {index === 0 &&
                    isExpanded &&
                    item.schedules.map((schedule, i) => (
                      <Text key={i} style={styles.expandedScheduleText}>
                        {schedule}
                      </Text>
                    ))}
                </View>
              );
            }}
          />
          <Pressable
            style={styles.closeButton}
            onPress={() => setShowModal(false)}
          >
            <Text style={styles.closeText}>Cerrar</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 110,
  },
  cityButton: {
    backgroundColor: "#5cb32b",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  cityText: {
    color: "#f5f5f5",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  lineButton: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  lineText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  backButton: {
    textAlign: "center",
    marginTop: 16,
    alignSelf: "center",
    backgroundColor: "#5cb32b",
    padding: 15,
    width: "90%",
    borderRadius: 10,
    marginBottom: 110,
  },
  backText: {
    textAlign: "center",
    color: "#f5f5f5",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    paddingTop: 110,
    flex: 1,
    padding: 16,
  },
  modalTitle: {
    color: "#5cb32b",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  stopContainer: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stopInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  stopText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scheduleText: {
    color: "#fff",
    fontSize: 14,
  },
  expandedScheduleText: {
    backgroundColor: "#e0e0e0",
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    fontSize: 14,
    color: "#333",
  },
  busImage: {
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: "contain",
  },
  closeButton: {
    marginTop: 16,
    alignSelf: "center",
    backgroundColor: "#5cb32b",
    padding: 10,
    borderRadius: 8,
    marginBottom: 60,
    width: "90%",
  },
  closeText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#202020",
    fontSize: 16,
  },
});
