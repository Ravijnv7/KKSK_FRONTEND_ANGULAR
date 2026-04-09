import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MeterReading, ShiftAssignment } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class ReadingService {
  private meterReadings: MeterReading[] = [];
  private shiftAssignments: ShiftAssignment[] = [];
  private readingsSubject = new BehaviorSubject<MeterReading[]>(this.meterReadings);
  private assignmentsSubject = new BehaviorSubject<ShiftAssignment[]>(this.shiftAssignments);

  getMeterReadings(): Observable<MeterReading[]> {
    return this.readingsSubject.asObservable();
  }

  recordReading(reading: MeterReading): void {
    this.meterReadings.push(reading);
    this.readingsSubject.next([...this.meterReadings]);
  }

  getReadingsByNozzle(nozzleId: string): Observable<MeterReading[]> {
    return new Observable((observer) => {
      observer.next(this.meterReadings.filter((r) => r.nozzleId === nozzleId));
      observer.complete();
    });
  }

  getReadingsByStaff(staffId: string): Observable<MeterReading[]> {
    return new Observable((observer) => {
      observer.next(this.meterReadings.filter((r) => r.staffId === staffId));
      observer.complete();
    });
  }

  createShiftAssignment(assignment: ShiftAssignment): void {
    this.shiftAssignments.push(assignment);
    this.assignmentsSubject.next([...this.shiftAssignments]);
  }

  getShiftAssignments(): Observable<ShiftAssignment[]> {
    return this.assignmentsSubject.asObservable();
  }

  getShiftAssignmentsByStaff(staffId: string): Observable<ShiftAssignment[]> {
    return new Observable((observer) => {
      observer.next(this.shiftAssignments.filter((a) => a.staffId === staffId));
      observer.complete();
    });
  }

  completeShiftAssignment(assignmentId: string): void {
    const index = this.shiftAssignments.findIndex((a) => a.id === assignmentId);
    if (index > -1) {
      this.shiftAssignments[index].status = 'completed';
      this.assignmentsSubject.next([...this.shiftAssignments]);
    }
  }

  // Calculate daily sales for a nozzle
  calculateDailySales(nozzleId: string, date: Date): number {
    const dayReadings = this.meterReadings.filter((r) => {
      const readingDate = new Date(r.readingTime);
      return r.nozzleId === nozzleId && readingDate.toDateString() === date.toDateString();
    });

    const openingReading = dayReadings.find((r) => r.type === 'opening')?.readingValue || 0;
    const closingReading = dayReadings.find((r) => r.type === 'closing')?.readingValue || 0;

    return closingReading - openingReading;
  }
}
