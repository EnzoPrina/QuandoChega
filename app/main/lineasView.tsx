import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { db } from '../../src/data/firebaseConfig'; // Suponiendo que la configuración de Firebase está aquí
import { collection, onSnapshot } from 'firebase/firestore';

const LineasView = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedStops, setExpandedStops] = useState({});
  const [lineColor, setLineColor] = useState('');

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

  const handleLineaClick = (line) => {
    setSelectedLine(line);
    setLineColor(line.color);
    setModalVisible(true);
  };

  const toggleDropdown = (stopIndex) => {
    setExpandedStops((prev) => ({
      ...prev,
      [stopIndex]: !prev[stopIndex],
    }));
  };

  const styles = getStyles(lineColor);

  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.7;

  return (
    <View style={styles.container}>
      {!selectedCity ? (
        <FlatList
          data={cities}
          keyExtractor={(item) => item.city}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setSelectedCity(item)}
            >
              <Text style={styles.buttonText}>{item.city}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={selectedCity.lines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: item.color }]}
              onPress={() => handleLineaClick(item)}
            >
              <Text style={styles.buttonText}>
                Línea {item.number} - {item.name}
              </Text>
            </TouchableOpacity>
          )}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { height: modalHeight }]}>
          <Text style={[styles.modalTitle, { color: lineColor }]}>
            Paradas de la Línea {selectedLine?.name}
          </Text>
          <FlatList
            data={selectedLine?.stops || []}
            keyExtractor={(item) => item.number?.toString() || ''}
            renderItem={({ item, index }) => {
              const isExpanded = expandedStops[index];

              return (
                <View style={styles.paradaContainer}>
                  <Text style={styles.paradaNumber}>{item.number}</Text>
                  <View style={styles.paradaDetails}>
                    <Text style={styles.paradaName}>{item.name}</Text>
                    <Text style={styles.paradaSchedule}>
                      {isExpanded ? item.schedules.join(', ') : item.schedules[0]}
                    </Text>
                    {item.schedules.length > 1 && (
                      <TouchableOpacity
                        style={styles.expandButton}
                        onPress={() => toggleDropdown(index)}
                      >
                        <Text style={styles.expandButtonText}>
                          {isExpanded ? 'Ver menos' : 'Ver más ↓'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (lineColor: string) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#202020",
    paddingTop: 180,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#007722',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    padding: 15,
    backgroundColor: '#5cb32b',
    borderRadius: 8,
    marginTop: 16,
  },
  backText: {
    color: '#202020',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: '#fff',
    marginVertical: 110,
    marginHorizontal: 30,
    borderRadius: 10,
    padding: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  paradaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  paradaNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5cb32b',
    marginRight: 10,
  },
  paradaDetails: {
    flex: 1,
  },
  paradaName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paradaSchedule: {
    fontSize: 14,
    color: '#666',
  },
  expandButton: {
    marginTop: 8,
  },
  expandButtonText: {
    color: '#007722',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#5cb32b',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LineasView;
