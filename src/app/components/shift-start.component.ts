import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StaffService, DUService, ReadingService } from '../services';
import { Staff, DU, Nozzle, ShiftAssignment } from '../models/index';
import { MeterReadingComponent } from './meter-reading/meter-reading.component';

@Component({
  selector: 'app-shift-start',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MeterReadingComponent],
  templateUrl: './shift-start.component.html',
  styleUrls: ['./shift-start.component.scss'],
})
export class ShiftStartComponent implements OnInit {
  staff: Staff[] = [];
  dus: DU[] = [];
  selectedStaff: Staff | null = null;
  selectedDU: DU | null = null;
  availableNozzles: Nozzle[] = [];
  selectedNozzles: Nozzle[] = [];
  shiftForm: FormGroup;
  showReadingForm = false;
  readingsRecorded = 0;
  currentShiftAssignment: ShiftAssignment | null = null;

  constructor(
    private staffService: StaffService,
    private duService: DUService,
    private readingService: ReadingService,
    private fb: FormBuilder,
  ) {
    this.shiftForm = this.fb.group({
      staff: ['', Validators.required],
      du: ['', Validators.required],
      nozzle1: ['', Validators.required],
      nozzle2: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadStaff();
    this.loadDUs();
  }

  loadStaff(): void {
    this.staffService.getStaff().subscribe((staff) => {
      this.staff = staff;
    });
  }

  loadDUs(): void {
    this.duService.getDUs().subscribe((dus) => {
      this.dus = dus;
    });
  }

  onStaffSelect(event: Event): void {
    const staffId = (event.target as HTMLSelectElement).value;
    this.staffService.getStaffById(staffId).subscribe((staff) => {
      this.selectedStaff = staff || null;
      this.shiftForm.patchValue({ staff: staffId });
    });
  }

  onDUSelect(event: Event): void {
    const duId = (event.target as HTMLSelectElement).value;
    this.duService.getDUById(duId).subscribe((du) => {
      this.selectedDU = du || null;
      if (this.selectedDU) {
        this.availableNozzles = this.selectedDU.nozzles;
      }
      this.selectedNozzles = [];
      this.shiftForm.patchValue({ du: duId, nozzle1: '', nozzle2: '' });
    });
  }

  onNozzleSelect(event: Event, index: 1 | 2): void {
    const nozzleId = (event.target as HTMLSelectElement).value;
    const nozzle = this.availableNozzles.find((n) => n.id === nozzleId);
    if (nozzle) {
      if (index === 1) {
        this.selectedNozzles[0] = nozzle;
      } else {
        this.selectedNozzles[1] = nozzle;
      }
    }
  }

  startShift(): void {
    if (this.selectedStaff && this.selectedDU && this.selectedNozzles.length === 2) {
      this.showReadingForm = true;
      const assignment: ShiftAssignment = {
        id: `assignment-${Date.now()}`,
        staffId: this.selectedStaff.id,
        staffName: this.selectedStaff.name,
        nozzleIds: this.selectedNozzles.map((n) => n.id),
        duId: this.selectedDU.id,
        shiftDate: new Date(),
        openingReadings: [],
        status: 'in-progress',
      };
      this.currentShiftAssignment = assignment;
    }
  }

  onReadingRecorded(): void {
    this.readingsRecorded++;
    if (this.readingsRecorded === 2 && this.currentShiftAssignment) {
      this.readingService.createShiftAssignment(this.currentShiftAssignment);
      this.resetForm();
    }
  }

  resetForm(): void {
    this.shiftForm.reset();
    this.selectedStaff = null;
    this.selectedDU = null;
    this.selectedNozzles = [];
    this.showReadingForm = false;
    this.readingsRecorded = 0;
    this.currentShiftAssignment = null;
  }
}
