// src/models/BusStopModel.ts
export interface BusStop {
  number: number; 
  line: string; 
  nome: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}
