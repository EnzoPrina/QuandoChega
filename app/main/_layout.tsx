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
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthViewModel } from '../../src/viewmodels/AuthViewModel';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MainLayout() {
  const colorScheme = useColorScheme();
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    console.log('Cerrando sesión...');
    await AuthViewModel.logout();
    setLogoutModalVisible(false);
    router.push('/');
  };

  const iconColor = colorScheme === 'dark' ? '#fff' : '#202020';

  return (
    <>
      <Tabs
        screenOptions={({ route }) => {
          const isMapView = route.name === 'mapview';
          return {
            tabBarStyle: [
              styles.tabBar,
              {
                borderColor:
                  colorScheme === 'dark'
                    ? DarkTheme.colors.card
                    : DefaultTheme.colors.card,
                backgroundColor:
                  colorScheme === 'dark'
                    ? DarkTheme.colors.card
                    : DefaultTheme.colors.card,
              },
            ],
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#5cb32b',
            tabBarInactiveTintColor: colorScheme === 'dark' ? '#888' : '#555',
            tabBarIcon: ({ color, size }) => {
              let icon;
              switch (route.name) {
                case 'dashboard':
                  icon = <AntDesign name="home" size={28} color={color} />;
                  break;
                case 'lineasView':
                  icon = <MaterialIcons name="schedule" size={31} color={color} />;
                  break;
                case 'mapview':
                  icon = (
                    <MaterialCommunityIcons
                      name="bus-clock"
                      size={32}
                      color="#fff"
                    />
                  );
                  break;
                case 'game':
                  icon = <FontAwesome name="gamepad" size={28} color={color} />;
                  break;
                case 'flappy':
                  icon = (
                    <SimpleLineIcons name="game-controller" size={28} color={color} />
                  );
                  break;
                default:
                  icon = (
                    <MaterialCommunityIcons
                      name="help-circle"
                      size={32}
                      color={color}
                    />
                  );
                  break;
              }
              return (
                <View style={isMapView ? styles.mapIconWrapper : styles.iconWrapper}>
                  {icon}
                </View>
              );
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
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setInfoModalVisible(true)}
              >
                <MaterialCommunityIcons name="information" size={28} color={iconColor} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setLogoutModalVisible(true)}
              >
                <MaterialCommunityIcons name="logout" size={28} color={iconColor} />
              </TouchableOpacity>
            ),
          };
        }}
      >
        {/* Lista solo los screens que desees, sin duplicar si ya se auto-registran */}
        {/* Si "mapview" ya existe como archivo en app/main, puedes omitir esta línea. */}

        <Tabs.Screen name="mapview" options={{ title: '' }} />
        <Tabs.Screen name="dashboard" options={{ title: '' }} />
        <Tabs.Screen name="lineasView" options={{ title: '' }} />
        <Tabs.Screen name="flappy" options={{ title: '' }} />
        <Tabs.Screen name="game" options={{ title: '' }} />

      </Tabs>

      {/* Aquí se definen los modales */}
      <Modal
        visible={infoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={require('../../assets/images/cartao.png')}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <Text style={styles.modalText}>
              O "Cartão do Munícipe" de Bragança é um cartão exclusivo para os residentes do município que facilita o acesso a diversos serviços e benefícios.
            </Text>
            <TouchableOpacity
              style={styles.fullWidthButton}
              onPress={() => setInfoModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
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
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setLogoutModalVisible(false)}
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
    borderRadius: 50,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: 'absolute',
    paddingTop: 12,
    left: 10,
    right: 10,
    bottom: 30,
    height: 65,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapIconWrapper: {
    width: 55,
    height: 55,
    borderRadius: 40,
    backgroundColor: '#5cb32b',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logo: {
    width: 180,
    height: 180,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    elevation: 10,
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
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  fullWidthButton: {
    backgroundColor: '#5cb32b',
    paddingVertical: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  },
});

export default MainLayout;
