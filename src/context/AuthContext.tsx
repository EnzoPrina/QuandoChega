// src/context/AuthContext.tsx
import  { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
// @ts-ignore
import { auth } from '../data/firebaseConfig';
import { AuthViewModel } from '../viewmodels/AuthViewModel';
import { User } from '../models/UserModel';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  login: async () => null,
  register: async () => null,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const { email, uid } = firebaseUser;
        setUser({ email: email ?? '', uid });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const user = await AuthViewModel.login(email, password);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  const register = async (email: string, password: string): Promise<User | null> => {
    try {
      const user = await AuthViewModel.register(email, password);
      return user;
    } catch (error) {
      console.error('Register error:', error);
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
