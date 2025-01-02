// src/models/BusStopModel.ts
export interface BusStopModel {
  number: number; 
  line: string; 
  nome: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isFavorite?: boolean; // Indica si la parada es favorita;
}
