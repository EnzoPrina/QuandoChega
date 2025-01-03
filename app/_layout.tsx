// app/_layout.tsx
import React, { useContext } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
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
