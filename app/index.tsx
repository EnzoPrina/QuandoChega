import { useState, useContext, useEffect } from 'react';
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
import { onAuthStateChanged, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true); // Controla si se muestra el onboarding
  const { user, login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'TU_ANDROID_CLIENT_ID',
    iosClientId: 'TU_IOS_CLIENT_ID',
    expoClientId: '886722290849-b8212ir309lfn3hjrmoeieoau4j88104.apps.googleusercontent.com',
  });

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

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch(err =>
        setError('Error iniciando sesión con Google.')
      );
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor preencha todos os campos.');
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

  const handleGoogleLogin = async () => {
    if (request) {
      promptAsync();
    } else {
      Alert.alert('Error', 'No se pudo iniciar sesión con Google.');
    }
  };

  if (showOnboarding) {
    return <OnboardingScreen onFinish={() => setShowOnboarding(false)} />;
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
              placeholder="Senha"
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
            <Text style={styles.buttonText}>Iniciar Sessão</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Ionicons name="logo-google" size={24} color="#202020" />
            <Text style={styles.googleButtonText}>Iniciar Sessão com Google</Text>
          </TouchableOpacity>
          {error && <Text style={styles.error}>{error}</Text>}
          <Text style={styles.registerText} onPress={goToRegister}>
            Não tenho conta, registar-me
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
      message: 'Todos a olhar para o telemóvel... mas tu, pelo menos, sabes quando chega o teu autocarro. Orgulho de utilizador do QuandoChega! 😎',
    }, 
    {
      image: require('../assets/images/Principales-10.png'),
      message: "Esperar pelo autocarro ou carregar o stress? Melhor deixa que o QuandoChega cuide disso por ti. As tuas costas vão agradecer! 💪😂",
    },
    {
      image: require('../assets/images/cartao-17.png'),
      message: "Ele tem tudo no bolso... literalmente! Cartão do Munícipe: mais do que um cartão, um companheiro. 💚🚞",
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
          {currentSlide === slides.length - 1 ? 'Começar' : 'Seguinte'}
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
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  onboardingButton: {
    marginTop:40,
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    borderColor: '#5cb32b',
    borderWidth: 1,
    width: '100%',
  },
  googleButtonText: {
    color: '#202020',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
