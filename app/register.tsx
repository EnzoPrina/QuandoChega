import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { AuthViewModel } from '../src/viewmodels/AuthViewModel'; // Asegúrate de que la ruta sea correcta
import { useRouter } from 'expo-router'; // Hook de navegación
import { Ionicons } from '@expo/vector-icons'; // Para el icono de ojo

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar u ocultar la contraseña
  const router = useRouter(); // Hook para la navegación

  // Función para manejar el registro
  const handleRegister = async () => {
    const user = await AuthViewModel.register(email, password);
    if (user) {
      setSuccess(`Registro exitoso para ${user.email}`);
      setError('');
      // Redirigir a login después de registro exitoso
      setTimeout(() => {
        router.push('/'); // Redirige a la pantalla de login
      }, 2000); // Espera 2 segundos para mostrar el mensaje de éxito antes de redirigir
    } else {
      setError('Error al registrar el usuario.');
      setSuccess('');
    }
  };

  // Función para redirigir a login si ya se tiene cuenta
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
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Botón de Registrarse */}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
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
    backgroundColor: '#202020', // Fondo rojo
  },
  inner: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logo: {
    width: 350, // Tamaño del logo
    height: 350, // Tamaño del logo
    marginBottom: 30, // Espacio debajo del logo
  },
  input: {
    width: '100%', // Hace que el input ocupe todo el ancho disponible
    borderWidth: 1,
    borderColor: '#5cb32b', // Borde blanco
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
    top: '38%',
    transform: [{ translateY: -12 }],
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
  error: {
    color: 'red',
    marginTop: 10,
  },
  success: {
    color: 'green',
    marginTop: 10,
  },
  loginText: {
    color: 'white', // Texto blanco
    marginTop: 15,
    textDecorationLine: 'underline', // Subrayado para el texto
    fontSize: 16,
  },
});
