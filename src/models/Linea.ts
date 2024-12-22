// models/Linea.ts
export default interface Linea {
    id: number;
    name: string; // Nombre de la línea
    color: string; // Color de la línea (ej: "#FF0000")
    paradas: Parada[];
  }
  