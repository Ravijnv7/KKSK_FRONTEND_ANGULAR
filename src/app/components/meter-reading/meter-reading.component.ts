import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReadingService } from '../../services';
import { ShiftAssignment, Nozzle, MeterReading } from '../../models/index';

@Component({
  selector: 'app-meter-reading',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './meter-reading.component.html',
  styleUrls: ['./meter-reading.component.scss'],
})
export class MeterReadingComponent implements OnInit {
  @Input() shiftAssignment: ShiftAssignment | null = null;
  @Input() nozzles: Nozzle[] = [];
  @Output() readingRecorded = new EventEmitter<void>();

  readingForm: FormGroup;
  currentNozzleIndex = 0;
  recordedReadings: MeterReading[] = [];
  allNozzlesProcessed = false;

  constructor(
    private fb: FormBuilder,
    private readingService: ReadingService,
  ) {
    this.readingForm = this.fb.group({
      readingValue: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadNextNozzle();
  }

  get currentNozzle(): Nozzle | null {
    return this.nozzles[this.currentNozzleIndex] || null;
  }

  get progressPercentage(): number {
    if (this.nozzles.length === 0) return 0;
    return ((this.currentNozzleIndex + 1) / this.nozzles.length) * 100;
  }

  loadNextNozzle(): void {
    this.readingForm.reset();
    if (this.currentNozzleIndex < this.nozzles.length) {
      // Form is ready for next reading
    } else {
      this.allNozzlesProcessed = true;
    }
  }

  submitReading(): void {
    if (this.readingForm.valid && this.currentNozzle && this.shiftAssignment) {
      const readingValue = this.readingForm.get('readingValue')?.value;

      const reading: MeterReading = {
        id: `reading-${Date.now()}-${Math.random()}`,
        nozzleId: this.currentNozzle.id,
        duId: this.shiftAssignment.duId,
        staffId: this.shiftAssignment.staffId,
        staffName: this.shiftAssignment.staffName,
        readingValue: readingValue,
        readingTime: new Date(),
        type: 'opening',
      };

      this.recordedReadings.push(reading);
      this.readingService.recordReading(reading);

      this.readingRecorded.emit();

      this.currentNozzleIndex++;

      if (this.currentNozzleIndex < this.nozzles.length) {
        this.loadNextNozzle();
      } else {
        this.allNozzlesProcessed = true;
      }
    }
  }

  skipReading(): void {
    this.currentNozzleIndex++;
    if (this.currentNozzleIndex < this.nozzles.length) {
      this.loadNextNozzle();
    } else {
      this.allNozzlesProcessed = true;
    }
  }
}
