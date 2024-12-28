// AuthViewModel.ts
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../data/firebaseConfig';
import { User } from '../models/UserModel';

export class AuthViewModel {
  static async login(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { email: userEmail, uid } = userCredential.user;
      return { email: userEmail ?? '', uid };
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }

  static async register(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { email: userEmail, uid } = userCredential.user;
      return { email: userEmail ?? '', uid };
    } catch (error) {
      console.error('Registration failed:', error);
      return null;
    }
  }
}
