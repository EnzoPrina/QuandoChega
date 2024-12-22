import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

const MapView = () => {
  const scheme = useColorScheme(); // Hook para obtener el esquema de color (claro/oscuro)
  const styles = getStyles(scheme); // Llamamos a la función que devuelve los estilos según el esquema

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa - Próximamente</Text>
    </View>
  );
};

const getStyles = (scheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: scheme === 'dark' ? '#333' : '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: scheme === 'dark' ? '#fff' : '#000',
    },
  });

export default MapView;
