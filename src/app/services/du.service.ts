import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DU, Nozzle, FuelType } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class DUService {
  private mockDUs: DU[] = [
    {
      id: 'du-1',
      name: 'DU-1',
      nozzles: [
        {
          id: 'nozzle-1',
          duId: 'du-1',
          nozzleNumber: 1,
          fuelType: FuelType.DIESEL,
          currentReading: 1000,
        },
        {
          id: 'nozzle-2',
          duId: 'du-1',
          nozzleNumber: 2,
          fuelType: FuelType.DIESEL,
          currentReading: 1050,
        },
        {
          id: 'nozzle-3',
          duId: 'du-1',
          nozzleNumber: 3,
          fuelType: FuelType.PETROL,
          currentReading: 500,
        },
        {
          id: 'nozzle-4',
          duId: 'du-1',
          nozzleNumber: 4,
          fuelType: FuelType.PETROL,
          currentReading: 550,
        },
      ],
    },
    {
      id: 'du-2',
      name: 'DU-2',
      nozzles: [
        {
          id: 'nozzle-5',
          duId: 'du-2',
          nozzleNumber: 1,
          fuelType: FuelType.DIESEL,
          currentReading: 2000,
        },
        {
          id: 'nozzle-6',
          duId: 'du-2',
          nozzleNumber: 2,
          fuelType: FuelType.DIESEL,
          currentReading: 2100,
        },
        {
          id: 'nozzle-7',
          duId: 'du-2',
          nozzleNumber: 3,
          fuelType: FuelType.PETROL,
          currentReading: 1500,
        },
        {
          id: 'nozzle-8',
          duId: 'du-2',
          nozzleNumber: 4,
          fuelType: FuelType.PETROL,
          currentReading: 1600,
        },
      ],
    },
  ];

  private dusSubject = new BehaviorSubject<DU[]>(this.mockDUs);

  getDUs(): Observable<DU[]> {
    return this.dusSubject.asObservable();
  }

  getDUById(id: string): Observable<DU | undefined> {
    return new Observable((observer) => {
      observer.next(this.mockDUs.find((du) => du.id === id));
      observer.complete();
    });
  }

  getNozzlesByDU(duId: string): Observable<Nozzle[]> {
    return new Observable((observer) => {
      const du = this.mockDUs.find((d) => d.id === duId);
      observer.next(du?.nozzles || []);
      observer.complete();
    });
  }
}
