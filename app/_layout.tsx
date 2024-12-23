import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme, View, TouchableOpacity, StyleSheet } from 'react-native';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Puedes reemplazarlo con tus propios iconos

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route, navigation }) => ({
        header: () => (
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <FontAwesome name="arrow-left" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ),
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card,
          },
        ],
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#888' : '#555',
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'index':
              iconName = 'home'; // Ícono de casa
              break;
            case 'Lineas':
              iconName = 'bus'; // Ícono de autobús
              break;
            case 'Mapa':
              iconName = 'map-marker'; // Ícono de mapa
              break;
            default:
              iconName = 'question-circle'; // Ícono predeterminado
              break;
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          textAlign: 'center',
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="Lineas" options={{ title: 'Líneas' }} />
      <Tabs.Screen name="Mapa" options={{ title: 'Mapa' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 15,
    backgroundColor: '#000', // Fondo completamente transparente
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'red',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60, // Ajusta el margen superior para posicionarlo más abajo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabBar: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 20,
    height: 70,
    borderTopWidth: 0, // Elimina la línea clara en el borde superior
    alignItems: 'center', // Alinea los elementos horizontalmente
    justifyContent: 'center', // Alinea los elementos verticalmente
    flexDirection: 'row', // Asegura que los íconos y etiquetas estén alineados correctamente
  },
});
