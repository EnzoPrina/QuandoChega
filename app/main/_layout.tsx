import { Tabs } from 'expo-router';
import {
  useColorScheme,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Modal,
  Text,
} from 'react-native';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthViewModel } from '../../src/viewmodels/AuthViewModel';

export default function MainLayout() {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    console.log('Cerrando sesión...');
    await AuthViewModel.logout();
    setModalVisible(false);
    router.push('/');
  };

  const iconColor = colorScheme === 'dark' ? '#fff' : '#202020';

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarStyle: [
            styles.tabBar,
            {
              borderColor: 
              colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card,
              backgroundColor:
                colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card,
                
            },
          ],
          tabBarActiveTintColor: '#5cb32b',
          tabBarInactiveTintColor: colorScheme === 'dark' ? '#888' : '#555',
          tabBarIcon: ({ color, size }) => {
            let iconName: string;

            switch (route.name) {
              case 'dashboard':
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
          headerTransparent: true,
          headerTitle: () => (
            <Image
              source={
                colorScheme === 'dark'
                  ? require('../../assets/images/Logo.png')
                  : require('../../assets/images/LogoVerde.png')
              }
              style={styles.logo}
              resizeMode="contain"
            />
          ),
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="info-circle" size={28} color={iconColor} />
              <View style={styles.circle}></View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setModalVisible(true)}
            >
              <FontAwesome name="power-off" size={28} color={iconColor} />
              <View style={styles.circle}></View>
            </TouchableOpacity>
          ),
        })}
      >
        <Tabs.Screen name="dashboard" options={{ title: 'Inicio' }} />
        <Tabs.Screen name="lineasView" options={{ title: 'Líneas' }} />
        <Tabs.Screen name="mapView" options={{ title: 'Mapa' }} />
      </Tabs>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={require('../../assets/images/CerrarSesion.png')}
              style={styles.modalImage}
              resizeMode="contain"
            />

            <Text style={styles.modalText}>¿Seguro que quieres cerrar sesión?</Text>
            <Text style={styles.modalSubText}>¡Te extrañaremos!</Text>
            <Text style={styles.modalSubText}>
              Si cierras sesión, perderás tu progreso y tendrás que iniciar sesión nuevamente.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Regresar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#d6130c' }]}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    marginLeft: 30,
    marginRight: 30,
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
    bottom: 30,
    height: 65,
  },
  logo: {
    width: 180,
    height: 180,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    position: 'relative',
    marginLeft: 20,
    marginRight: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#202020',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalImage: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  modalText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalSubText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#202020',
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
