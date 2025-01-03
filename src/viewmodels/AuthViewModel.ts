// src/viewmodels/AuthViewModel.ts
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../data/firebaseConfig';
import { User } from '../models/UserModel';
import { signOut } from 'firebase/auth';
import {onAuthStateChanged } from 'firebase/auth';


export class AuthViewModel {
  static async login(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { email: userEmail, uid } = userCredential.user;
      return { email: userEmail ?? '', uid };
    } catch (error: any) {
      console.error('Login failed:', error.message);
      return null;
    }
  }

  static async register(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { email: userEmail, uid } = userCredential.user;
      return { email: userEmail ?? '', uid };
    } catch (error: any) {
      console.error('Registration failed:', error.message);
      return null;
    }
  }


  static async logout(): Promise<void> {
    try {
      await signOut(auth); // Cerrar sesión en Firebase
    } catch (error: any) {
      console.error('Logout failed:', error.message);
    }
  }

   // Estado de autenticación
   static onAuthStateChanged(callback: (user: User | null) => void) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario autenticado
        callback({ email: user.email ?? '', uid: user.uid });
      } else {
        // Usuario no autenticado
        callback(null);
      }
    });
  }
}

