import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirige a login si se encuentra una ruta no válida
    router.replace('/login');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Redirigiendo...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
