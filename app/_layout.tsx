// app/_layout.tsx
import { Slot } from 'expo-router';
import { FavoriteStopsProvider } from '../src/context/FavoriteStopsContext';


import { FirebaseProvider } from '../src/context/FirebaseContext';


export default function Layout() {
  return (
    <FirebaseProvider>
    <FavoriteStopsProvider>

        <Slot />

    </FavoriteStopsProvider>
    </FirebaseProvider>
  );
}
