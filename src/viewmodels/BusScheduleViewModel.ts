import { BusScheduleModel, BusStop } from '../models/BusSchedule';
import * as Location from 'expo-location';

export class BusScheduleViewModel {
  private model: BusScheduleModel;
  private currentLocation: Location.LocationObject | null = null;

  constructor(initialStops: BusStop[]) {
    this.model = new BusScheduleModel(initialStops);
  }

  public async getUserLocation(): Promise<Location.LocationObject | null> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return null;
    }
    const location = await Location.getCurrentPositionAsync({});
    this.currentLocation = location;
    return location;
  }

  public getBusStops(): BusStop[] {
    return this.model.getStops();
  }

  public getCurrentLocation(): Location.LocationObject | null {
    return this.currentLocation;
  }
}
