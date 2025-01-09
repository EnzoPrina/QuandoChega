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
import React from 'react';

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
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setModalVisible(true)}
            >
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
              source={require('../../assets/images/cartao.png')}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <Text style={styles.modalText}>
              O "Cartão do Munícipe" de Bragança é um cartão exclusivo para os
              residentes do município que facilita o acesso a diversos serviços e
              benefícios. Para obtê-lo, deve dirigir-se ao Balcão Único da Câmara
              Municipal com os documentos necessários, como identificação e
              comprovativo de residência. O processo é simples e visa oferecer
              vantagens em serviços culturais, sociais e educativos, promovendo a
              ligação entre os cidadãos e a comunidade local.
            </Text>
            <TouchableOpacity
              style={styles.fullWidthButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
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
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom:50,
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
});
