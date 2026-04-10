import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Staff } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private mockStaff: Staff[] = [
    { id: 'staff-1', name: 'Vikash Rana', shift: 'Morning', status: 'active' },
    { id: 'staff-2', name: 'Gautam Yadav', shift: 'Morning', status: 'active' },
    { id: 'staff-3', name: 'Pappu ', shift: 'Afternoon', status: 'active' },
    { id: 'staff-4', name: 'Pramod Yadav', shift: 'Afternoon', status: 'active' },
    { id: 'staff-5', name: 'Dineshwar Rana', shift: 'Night', status: 'active' },
  ];

  private staffSubject = new BehaviorSubject<Staff[]>(this.mockStaff);
  private currentStaffSubject = new BehaviorSubject<Staff | null>(null);

  getStaff(): Observable<Staff[]> {
    return this.staffSubject.asObservable();
  }

  getStaffById(id: string): Observable<Staff | undefined> {
    return new Observable((observer) => {
      observer.next(this.mockStaff.find((staff) => staff.id === id));
      observer.complete();
    });
  }

  setCurrentStaff(staff: Staff): void {
    this.currentStaffSubject.next(staff);
  }

  getCurrentStaff(): Observable<Staff | null> {
    return this.currentStaffSubject.asObservable();
  }

  getStaffByShift(shift: string): Observable<Staff[]> {
    return new Observable((observer) => {
      observer.next(
        this.mockStaff.filter((staff) => staff.shift === shift && staff.status === 'active'),
      );
      observer.complete();
    });
  }
}
