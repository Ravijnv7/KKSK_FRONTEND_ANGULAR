import { Injectable } from '@angular/core';
import { ShiftAssignment, MeterReading } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly SHIFT_KEY = 'petrol_pump_shift_assignment';
  private readonly READINGS_KEY = 'petrol_pump_meter_readings';

  // Save current shift assignment
  saveShiftAssignment(assignment: ShiftAssignment): void {
    localStorage.setItem(this.SHIFT_KEY, JSON.stringify(assignment));
  }

  // Get current shift assignment
  getShiftAssignment(): ShiftAssignment | null {
    const data = localStorage.getItem(this.SHIFT_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Save meter readings
  saveMeterReading(reading: MeterReading): void {
    const readings = this.getMeterReadings();
    readings.push(reading);
    localStorage.setItem(this.READINGS_KEY, JSON.stringify(readings));
  }

  // Get all meter readings for current shift
  getMeterReadings(): MeterReading[] {
    const data = localStorage.getItem(this.READINGS_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Get reading for specific nozzle (if exists)
  getReadingForNozzle(nozzleId: string): MeterReading | undefined {
    const readings = this.getMeterReadings();
    return readings.find((r) => r.nozzleId === nozzleId);
  }

  // Clear shift data after completing
  clearShiftData(): void {
    localStorage.removeItem(this.SHIFT_KEY);
    localStorage.removeItem(this.READINGS_KEY);
  }

  // Check if reading exists for a nozzle
  hasReadingForNozzle(nozzleId: string): boolean {
    return !!this.getReadingForNozzle(nozzleId);
  }
}
