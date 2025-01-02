import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AuthViewModel } from '../src/viewmodels/AuthViewModel';
import { useRouter } from 'expo-router'; // Para la navegación
import { onAuthStateChanged } from 'firebase/auth'; // Importamos para verificar el estado de autenticación
import { auth } from '../src/data/firebaseConfig'; // Configuración de Firebase
import { Ionicons } from '@expo/vector-icons'; // Para el icono de ojo

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Estado para manejar la carga al iniciar
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar u ocultar la contraseña
  const router = useRouter(); // Hook de navegación

  // Verificamos si el usuario ya está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard'); // Si el usuario ya está autenticado, lo redirigimos
      } else {
        setLoading(false); // Si no está autenticado, mostramos el formulario de login
      }
    });

    return () => unsubscribe(); // Limpiamos el listener cuando se desmonta el componente
  }, [router]);

  // Función para manejar el login
  const handleLogin = async () => {
    const user = await AuthViewModel.login(email, password);
    if (user) {
      alert(`Bienvenido ${user.email}`);
      router.push('/main'); // Redirigir a la página principal después de login exitoso
    } else {
      setError('Credenciales inválidas.');
    }
  };

  // Función para redirigir a la pantalla de registro
  const goToRegister = () => {
    router.push('/register'); // Redirigir a la pantalla de registro
  };

  // Si la app está verificando la sesión, mostramos un loading
  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Logo de la aplicación */}
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
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={28} color="white" />
        </TouchableOpacity>
      </View>


      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>



      {error && <Text style={styles.error}>{error}</Text>}

      {/* Botón de redirección a registro */}
      <Text style={styles.registerText} onPress={goToRegister}>
        No tengo cuenta, registrarme
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020', // Fondo gris
  },
  logo: {
    width: 350, // Tamaño del logo
    height: 350, // Tamaño del logo
    marginBottom: 30, // Espacio debajo del logo
  },
  input: {
    width: '100%', // Hace que el input ocupe todo el ancho disponible
    borderWidth: 1,
    borderColor: '#5cb32b', // Borde verde
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    color: 'white', // Texto blanco dentro del input
  },
  passwordContainer: {
    width: '100%',
    position: 'relative', // Necesario para posicionar el icono del ojo sobre el input
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
    color: 'white', // Texto blanco
    marginTop: 15,
    textDecorationLine: 'underline', // Subrayado para el texto
    fontSize: 16,
  },

  button: {
    backgroundColor: '#5cb32b',
    width: '100%', // Hace que el botón ocupe el mismo ancho que el input
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(92, 179, 43, 0.6)', // Sombra en el color verde/neón
  },
  buttonText: {
    color: '#202020', // Texto gris
    fontSize: 16,
    fontWeight: 'bold',
  },

});
