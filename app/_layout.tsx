import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Cambiamos a FontAwesome

export default function Layout() {
  // Detecta el esquema de color del dispositivo
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background,
        },
        headerTintColor: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card,
        },
        tabBarActiveTintColor: 'red', // Color rojo para el ícono activo
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#888' : '#555',
        tabBarIcon: ({ color, size }) => {
          // Define los íconos para cada pestaña según el nombre de la ruta
          let iconName: string;

          switch (route.name) {
            case 'index':
              iconName = 'home'; // Ícono de casa para "Inicio"
              break;
            case 'Lineas': // Asegúrate de que coincida exactamente con el nombre en Tabs.Screen
              iconName = 'bus'; // Ícono de autobús para "Líneas"
              break;
            case 'Mapa': // Asegúrate de que coincida exactamente con el nombre en Tabs.Screen
              iconName = 'map-marker'; // Ícono de ubicación para "Mapa"
              break;
            default:
              iconName = 'question-circle'; // Ícono predeterminado
              break;
          }

          // Renderiza el ícono de FontAwesome
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="Líneas" options={{ title: 'Líneas' }} />
      <Tabs.Screen name="Mapa" options={{ title: 'Mapa' }} />

    </Tabs>
  );
}
