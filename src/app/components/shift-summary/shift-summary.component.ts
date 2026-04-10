import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftAssignment, MeterReading, Nozzle } from '../../models/index';
import { DUService } from '../../services/du.service';

@Component({
  selector: 'app-shift-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shift-summary.component.html',
  styleUrls: ['./shift-summary.component.scss'],
})
export class ShiftSummaryComponent implements OnInit {
  @Input() shiftAssignment: ShiftAssignment | null = null;
  @Input() meterReadings: MeterReading[] = [];
  @Output() readyToCloseShift = new EventEmitter<void>();

  nozzleDetails: Nozzle[] = [];

  constructor(private duService: DUService) {}

  ngOnInit(): void {
    if (this.shiftAssignment) {
      this.loadNozzleDetails();
    }
  }

  loadNozzleDetails(): void {
    if (this.shiftAssignment) {
      this.duService.getDUById(this.shiftAssignment.duId).subscribe((du) => {
        if (du) {
          this.nozzleDetails = du.nozzles.filter((n) =>
            this.shiftAssignment?.nozzleIds.includes(n.id),
          );
        }
      });
    }
  }

  getReadingForNozzle(nozzleId: string): MeterReading | undefined {
    return this.meterReadings.find((r) => r.nozzleId === nozzleId);
  }

  continueToCloseShift(): void {
    this.readyToCloseShift.emit();
  }
}
