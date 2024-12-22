import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export default function Layout() {
  // Detecta el esquema de color del dispositivo
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background,
        },
        headerTintColor: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card,
        },
        tabBarActiveTintColor: colorScheme === 'dark' ? DarkTheme.colors.primary : DefaultTheme.colors.primary,
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#888' : '#555',
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Inicio" }} />
      <Tabs.Screen name="Lineas" options={{ title: "Líneas" }} />
      <Tabs.Screen name="Mapa" options={{ title: "Mapa" }} />
    </Tabs>
  );
}
