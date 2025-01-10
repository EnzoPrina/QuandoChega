// src/models/BusStopModel.ts
export interface BusStop {
  number: string | number;
  line: string; 
  name: string;
  nome: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isFavorite?: boolean; // Indica si la parada es favorita;
  city: string;
  color?: string;
}
