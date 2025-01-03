import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { auth } from '../src/data/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true); // Controla si se muestra el onboarding
  const { user, login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      router.replace('/main/dashboard');
    }
  }, [user, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    const userResult = await login(email, password);
    if (userResult) {
      Alert.alert(
        'Olá!',
        `Bem-vindo ${userResult.email} a QuandoChega`,
        [{ text: 'OK' }],
        { cancelable: false }
      );
      router.push('/main/dashboard');
    } else {
      setError('Credenciales inválidas.');
    }
  };

  const goToRegister = () => {
    router.push('/register');
  };

  if (showOnboarding) {
    return (
      <OnboardingScreen onFinish={() => setShowOnboarding(false)} />
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Image
            source={require('../assets/images/LogoMano.png')}
            style={styles.logo}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="white"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry={!showPassword}
              placeholderTextColor="white"
              onChangeText={setPassword}
              value={password}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.icon}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={28}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          {error && <Text style={styles.error}>{error}</Text>}
          <Text style={styles.registerText} onPress={goToRegister}>
            No tengo cuenta, registrarme
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function OnboardingScreen({ onFinish }) {
  const slides = [
    {
      image: require('../assets/images/Principales-09.png'),
      message: '¡Todos mirando el teléfono... pero tú, al menos, sabes cuándo llega tu autobús. ¡Orgullo de usuario de QuandoChega! 😎!',
    },
    {
      image: require('../assets/images/Principales-10.png'),
      message: "¿Esperar el autobús o cargar con el estrés? Mejor deja que QuandoChega lo haga por ti. ¡Tu espalda te lo agradecerá! 💪😂",
    },
    {
      image: require('../assets/images/Principales-11.png'),
      message: "Ella tiene todo bajo control: perro listo, autobús cerca y QuandoChega en el bolsillo. ¡Tú también puedes ser así de pro! 🐶🚌",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      onFinish();
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  return (
    <View style={styles.onboardingContainer}>
      <Image source={slides[currentSlide].image} style={styles.onboardingImage} />
      <Text style={styles.onboardingText}>{slides[currentSlide].message}</Text>
      <TouchableOpacity style={styles.onboardingButton} onPress={handleNext}>
        <Text style={styles.onboardingButtonText}>
          {currentSlide === slides.length - 1 ? 'Comenzar' : 'Siguiente'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#5cb32b',
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    color: 'white',
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: '35%',
    marginBottom: 15,
    transform: [{ translateY: -12 }],
  },
  error: {
    color: 'white',
    marginTop: 10,
  },
  registerText: {
    color: 'white',
    marginTop: 15,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#5cb32b',
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#5cb32b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#202020',
    fontSize: 16,
    fontWeight: 'bold',
  },
  onboardingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
  },
  onboardingImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  onboardingText: {
    width: '90%',
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 20,
  },
  onboardingButton: {

    backgroundColor: '#5cb32b',
    width: '90%',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  onboardingButtonText: {
    color: '#202020',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
