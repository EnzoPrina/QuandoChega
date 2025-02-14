// app/_layout.tsx
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
import { FavoriteStopsProvider } from '../src/context/FavoriteStopsContext';
import { FirebaseProvider } from '../src/context/FirebaseContext';

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
  const [mounted, setMounted] = useState(false);

  // Esperamos a que el componente se monte
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading) {
      // Si hay usuario, redirigimos al dashboard (archivo ubicado en app/main/dashboard.tsx)
      if (user) {
        router.replace('/main/dashboard');
      } else {
        // Si no hay usuario, nos quedamos en la pantalla de login (ruta raíz '/')
        router.replace('/');
      }
    }
  }, [mounted, user, loading, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5cb32b" />
      </View>
    );
  }

  return <Slot />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
