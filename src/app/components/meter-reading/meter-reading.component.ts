import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReadingService, StorageService, DUService } from '../../services';
import { Nozzle, MeterReading } from '../../models/index';

@Component({
  selector: 'app-meter-reading',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './meter-reading.component.html',
  styleUrls: ['./meter-reading.component.scss'],
})
export class MeterReadingComponent implements OnInit {
  @Input() nozzleId: string = '';
  @Input() staffId: string = '';
  @Input() duId: string = '';
  @Input() isReadingRecorded: boolean = false;
  @Output() readingRecorded = new EventEmitter<{ nozzleId: string; readingValue: number }>();

  readingForm: FormGroup;
  nozzle: Nozzle | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private readingService: ReadingService,
    private storageService: StorageService,
    private duService: DUService,
  ) {
    this.readingForm = this.fb.group({
      readingValue: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadNozzleDetails();
    if (this.isReadingRecorded) {
      this.readingForm.disable();
    }
  }

  loadNozzleDetails(): void {
    this.duService.getDUById(this.duId).subscribe((du) => {
      if (du) {
        this.nozzle = du.nozzles.find((n) => n.id === this.nozzleId) || null;
      }
    });
  }

  submitReading(): void {
    if (this.readingForm.valid && this.nozzle && !this.isSubmitting) {
      this.isSubmitting = true;
      const readingValue = this.readingForm.get('readingValue')?.value;

      const reading: MeterReading = {
        id: `reading-${Date.now()}-${Math.random()}`,
        nozzleId: this.nozzle.id,
        duId: this.duId,
        staffId: this.staffId,
        staffName: 'Staff', // Can be updated with actual staff name if passed as input
        readingValue: parseFloat(readingValue),
        readingTime: new Date(),
        type: 'opening',
      };

      // Save to localStorage
      this.storageService.saveMeterReading(reading);
      this.readingService.recordReading(reading);

      // Emit event with nozzleId and reading value
      this.readingRecorded.emit({
        nozzleId: this.nozzle.id,
        readingValue: parseFloat(readingValue),
      });

      // Disable form after submission
      this.readingForm.disable();
      this.isSubmitting = false;
    }
  }
}
