import { Tabs } from 'expo-router';
import { useColorScheme, StyleSheet } from 'react-native';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

export default function MainLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor:
              colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card,
          },
        ],
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#888' : '#555',
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'main':
              iconName = 'home';
              break;
            case 'lineasView':
              iconName = 'bus';
              break;
            case 'mapView':
              iconName = 'map-marker';
              break;
            default:
              iconName = 'question-circle';
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
      <Tabs.Screen name="main" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="lineasView" options={{ title: 'Líneas' }} />
      <Tabs.Screen name="mapView" options={{ title: 'Mapa' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
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
  },
});
