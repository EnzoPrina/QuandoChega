export interface BusStop {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    arrivalTimes: string[];  // Horarios de llegada de los autobuses
  }
  
  export class BusScheduleModel {
    private stops: BusStop[] = [];
  
    constructor(initialStops: BusStop[]) {
      this.stops = initialStops;
    }
  
    public getStops(): BusStop[] {
      return this.stops;
    }
  
    public addStop(stop: BusStop): void {
      this.stops.push(stop);
    }
  }
  