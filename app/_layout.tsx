// app/_layout.tsx
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Slot, useRouter } from 'expo-router';
// Importa tus providers sin AdMob si ya lo desinstalaste
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

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/mapview');
      } else {
        router.push('/');
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

  return <Slot />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
