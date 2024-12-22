import React from 'react';
import { View, Text, Button, StyleSheet, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Index() {
  const navigation = useNavigation(); // Hook para acceder a 'navigation'
  const scheme = useColorScheme(); // Hook para obtener el esquema de color (claro/oscuro)

  const styles = getStyles(scheme); // Llamamos a la función que devuelve los estilos según el esquema

  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Bienvenido a QuandoChega2!</Text>
      <Button
        title="Ver Líneas"
        onPress={() => navigation.navigate('LineasView')} // Navega a la pantalla de líneas
      />
      <Button
        title="Ver Mapas"
        onPress={() => navigation.navigate('MapView')} // Navega a la pantalla del mapa
      />
    </View>
  );
}

const getStyles = (scheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: scheme === 'dark' ? '#333' : '#fff',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: scheme === 'dark' ? '#fff' : '#000',
    },
  });
