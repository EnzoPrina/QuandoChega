import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import HomeViewModel from '../src/viewmodels/HomeViewModel';
import LineasViewModel from '../src/viewmodels/LineasViewModel';

const LineasView = () => {
  const lineas = HomeViewModel.getLineas();
  const [paradas, setParadas] = useState<any[]>([]);
  const scheme = useColorScheme(); // Hook para obtener el esquema de color (claro/oscuro)

  const styles = getStyles(scheme); // Llamamos a la función que devuelve los estilos según el esquema

  const handleLineaClick = (id: number) => {
    const data = LineasViewModel.getParadasPorLinea(id);
    setParadas(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Líneas Disponibles</Text>
      <FlatList
        data={lineas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: item.color }]}
            onPress={() => handleLineaClick(item.id)}
          >
            <Text style={styles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {paradas.length > 0 && (
        <View>
          <Text style={styles.subtitle}>Paradas:</Text>
          <FlatList
            data={paradas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Text style={styles.paradaText}>
                {item.order}. {item.name}
              </Text>
            )}
          />
        </View>
      )}
    </View>
  );
};

const getStyles = (scheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: scheme === 'dark' ? '#333' : '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: scheme === 'dark' ? '#fff' : '#000',
    },
    subtitle: {
      fontSize: 20,
      marginTop: 20,
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
    paradaText: {
      fontSize: 16,
      marginVertical: 2,
      color: scheme === 'dark' ? '#fff' : '#000',
    },
  });

export default LineasView;
