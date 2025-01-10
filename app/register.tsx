import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { auth } from '../src/data/firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'TU_ANDROID_CLIENT_ID',
    iosClientId: 'TU_IOS_CLIENT_ID',
    expoClientId: '886722290849-b8212ir309lfn3hjrmoeieoau4j88104.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(userCredential => {
          const user = userCredential.user;
          setSuccess(`Registro exitoso para ${user.email}`);
          setError('');
          router.push('/'); // Redirigir al login después del registro
        })
        .catch(err => {
          setError('Error al registrar con Google.');
          setSuccess('');
        });
    }
  }, [response]);

  const handleRegister = async () => {
    // Aquí puedes agregar la lógica para el registro manual si es necesario.
    setSuccess(`Registro exitoso para ${email}`);
    setError('');
    setTimeout(() => {
      router.push('/'); // Redirige al login
    }, 2000);
  };

  const handleGoogleLogin = async () => {
    if (request) {
      promptAsync();
    } else {
      Alert.alert('Error', 'No se pudo iniciar sesión con Google.');
    }
  };

  const goToLogin = () => {
    router.push('/'); // Redirige a la pantalla de login
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Image source={require('../assets/images/LogoMano.png')} style={styles.logo} />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="white"
            onChangeText={setEmail}
            value={email}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry={!showPassword}
              placeholderTextColor="white"
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Botón de Registrarse */}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          {/* Botón para Google */}
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Ionicons name="logo-google" size={24} color="#202020" />
            <Text style={styles.googleButtonText}>Registrarse con Google</Text>
          </TouchableOpacity>

          {success ? <Text style={styles.success}>{success}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Botón para redirigir al login si ya tiene cuenta */}
          <TouchableOpacity onPress={goToLogin}>
            <Text style={styles.loginText}>Ya tengo una cuenta, iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
  },
  inner: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
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
    top: '38%',
    transform: [{ translateY: -12 }],
  },
  button: {
    backgroundColor: '#5cb32b',
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(92, 179, 43, 0.6)',
  },
  buttonText: {
    color: '#202020',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  success: {
    color: 'green',
    marginTop: 10,
  },
  loginText: {
    color: 'white',
    marginTop: 15,
    textDecorationLine: 'underline',
    fontSize: 16,
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
