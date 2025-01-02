// src/viewmodels/LineasViewModel.ts
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { BusStopModel } from "../models/BusStopModel";

export class LineasViewModel {
  private firestore = getFirestore();
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // Obtener favoritos del usuario desde Firestore
  async getFavoritos(): Promise<number[]> {
    const docRef = doc(this.firestore, `users/${this.userId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().favoritos || [];
    } else {
      return [];
    }
  }

  // Agregar una parada a favoritos
  async addToFavoritos(paradaNumber: number): Promise<void> {
    const docRef = doc(this.firestore, `users/${this.userId}`);
    await updateDoc(docRef, {
      favoritos: arrayUnion(paradaNumber),
    });
  }

  // Remover una parada de favoritos
  async removeFromFavoritos(paradaNumber: number): Promise<void> {
    const docRef = doc(this.firestore, `users/${this.userId}`);
    await updateDoc(docRef, {
      favoritos: arrayRemove(paradaNumber),
    });
  }

  // Inicializar documento de usuario si no existe
  async initializeUserDocument(): Promise<void> {
    const docRef = doc(this.firestore, `users/${this.userId}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, { favoritos: [] });
    }
  }
}
