// LineasView.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, useColorScheme, Modal } from 'react-native';
import busStops from '../../src/data/busStops.json';
import { useFavoriteStops } from '../../src/context/FavoriteStopsContext';

const LineasView = () => {
  const { favoritos, addFavorito, removeFavorito } = useFavoriteStops();
  const [paradas, setParadas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [lineColor, setLineColor] = useState('');
  const scheme = useColorScheme();

  const lineas = [
    { id: 'U1', name: 'U1', color: '#007722' },
    { id: 'U2', name: 'U2', color: '#e8c100' },
    { id: 'U3', name: 'U3', color: '#d6130c' },
    { id: 'R1', name: 'R1', color: '#ed8100' },
  ];

  const handleLineaClick = (lineId: string, color: string) => {
    const data = busStops
      .filter((stop) => stop.line === lineId)
      .map((stop) => ({
        ...stop,
        isFavorite: favoritos.some((fav) => fav.number === stop.number),
        color,
      }));
    setParadas(data);
    setLineColor(color);
    setModalVisible(true);
  };

  const toggleFavorito = (paradaNumber: number) => {
    const parada = busStops.find((stop) => stop.number === paradaNumber);
    if (favoritos.some((fav) => fav.number === paradaNumber)) {
      removeFavorito(paradaNumber);
    } else {
      addFavorito(parada);
    }
  };

  const styles = getStyles(scheme, lineColor);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Líneas Disponibles</Text>
      <FlatList
        data={lineas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: item.color }]}
            onPress={() => handleLineaClick(item.id, item.color)}
          >
            <Text style={styles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Paradas</Text>
          <FlatList
            data={paradas}
            keyExtractor={(item) => item?.number ? item.number.toString() : Math.random().toString()}
            renderItem={({ item }) => (
              <View style={styles.paradaContainer}>
                <View style={styles.circle}>
                  <Text style={styles.circleText}>{item.number}</Text>
                </View>
                <Text style={styles.paradaText}>{item.name}</Text>
                <TouchableOpacity
                  style={[styles.heartButton, { backgroundColor: favoritos.some(fav => fav.number === item.number) ? '#5cb32b' : '#ccc' }]}
                  onPress={() => toggleFavorito(item.number)}
                >
                  <Text style={styles.heartText}>❤</Text>
                </TouchableOpacity>
              </View>
            )}
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

const getStyles = (scheme: 'light' | 'dark', lineColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: scheme === 'dark' ? '#333' : '#f5f5f5',
      paddingTop: 180,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: scheme === 'dark' ? '#fff' : '#000',
    },
    button: {
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: scheme === 'dark' ? '#333' : '#f5f5f5',
      marginVertical: 110,
      marginHorizontal: 30,
      borderRadius: 10,
      padding: 16,
      elevation: 5,
      shadowColor: '#0a0a0a',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 50,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: scheme === 'dark' ? '#fff' : '#000',
    },
    paradaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    circle: {
      width: 30,
      height: 30,
      borderRadius: 20,
      backgroundColor: lineColor,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    circleText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    paradaText: {
      flex: 1,
      backgroundColor: lineColor,
      color: '#fff',
      fontWeight: 'bold',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      fontSize: 16,
    },
    heartButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
    },
    heartText: {
      color: '#fff',
      fontSize: 18,
    },
    closeButton: {
      backgroundColor: '#5cb32b',
      padding: 10,
      borderRadius: 50,
      marginTop: 20,
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

export default LineasView;
