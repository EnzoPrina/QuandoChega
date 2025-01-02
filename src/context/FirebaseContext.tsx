// src/context/FirebaseContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { auth, firestore } from '../data/firebaseConfig';

interface FirebaseContextType {
  auth: typeof auth;
  firestore: typeof firestore;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <FirebaseContext.Provider value={{ auth, firestore }}>
    {children}
  </FirebaseContext.Provider>
);

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase debe ser usado dentro de un FirebaseProvider');
  }
  return context;
};
