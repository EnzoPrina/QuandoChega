// app/_layout.tsx
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
// @ts-ignore
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
// @ts-ignore
import { FavoriteStopsProvider } from '../src/context/FavoriteStopsContext';
// @ts-ignore
import { FirebaseProvider } from '../src/context/FirebaseContext';
import { useRouter } from 'expo-router';
import admob from 'react-native-google-mobile-ads';

export default function Layout() {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <FavoriteStopsProvider>
          <AuthWrapper />
        </FavoriteStopsProvider>
      </AuthProvider>
    </FirebaseProvider>
  );
}

const AuthWrapper = () => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Si el estado de la autenticación cambia y el usuario no está cargando
    if (!loading) {
      if (user) {
        router.push('/dashboard'); // Navegar a la pantalla de inicio o la que corresponda
      } else {
        router.push('/'); // Navegar a la pantalla de login si no hay usuario
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5cb32b" />
      </View>
    );
  }

  console.log(admob);
  // Si no se está cargando y no hay usuario, sigue mostrando el Slot de navegación
  return <Slot />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
