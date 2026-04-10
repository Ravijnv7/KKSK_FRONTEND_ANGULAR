import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService, SalesCalculationService, DUService } from '../../services';
import { ShiftAssignment, MeterReading, Nozzle } from '../../models/index';
import { MeterReadingComponent } from '../meter-reading/meter-reading.component';
import { SalesReportComponent } from '../sales-report/sales-report.component';

@Component({
  selector: 'app-shift-close',
  standalone: true,
  imports: [CommonModule, MeterReadingComponent, SalesReportComponent],
  templateUrl: './shift-close.component.html',
  styleUrls: ['./shift-close.component.scss'],
})
export class ShiftCloseComponent implements OnInit {
  currentShiftAssignment: ShiftAssignment | null = null;
  allMeterReadings: MeterReading[] = [];
  closingReadingsRecorded = 0;
  showClosingReadingForm = false;
  showSalesReport = false;
  availableNozzles: Nozzle[] = [];

  constructor(
    public storageService: StorageService,
    public salesCalculationService: SalesCalculationService,
    private duService: DUService,
  ) {}

  ngOnInit(): void {
    this.loadShiftData();
  }

  loadShiftData(): void {
    const savedShift = this.storageService.getShiftAssignment();
    if (savedShift) {
      this.currentShiftAssignment = savedShift;
      this.allMeterReadings = this.storageService.getMeterReadings();
      this.loadNozzleDetails();
    }
  }

  loadNozzleDetails(): void {
    if (this.currentShiftAssignment) {
      this.duService.getDUById(this.currentShiftAssignment.duId).subscribe((du) => {
        if (du) {
          this.availableNozzles = du.nozzles.filter((n) =>
            this.currentShiftAssignment?.nozzleIds.includes(n.id),
          );
        }
      });
    }
  }

  startClosingReadings(): void {
    this.showClosingReadingForm = true;
    this.closingReadingsRecorded = this.allMeterReadings.filter((r) => r.type === 'closing').length;
  }

  onClosingReadingRecorded(event: { nozzleId: string; readingValue: number }): void {
    this.closingReadingsRecorded++;
    this.allMeterReadings = this.storageService.getMeterReadings();

    // If all closing readings recorded, show sales report
    if (this.closingReadingsRecorded === this.currentShiftAssignment?.nozzleIds.length) {
      this.showSalesReport = true;
      this.showClosingReadingForm = false;
    }
  }

  hasClosingReading(nozzleId: string): boolean {
    return this.allMeterReadings.some((r) => r.nozzleId === nozzleId && r.type === 'closing');
  }

  getOpeningReading(nozzleId: string): number {
    const reading = this.allMeterReadings.find(
      (r) => r.nozzleId === nozzleId && r.type === 'opening',
    );
    return reading ? reading.readingValue : 0;
  }

  completeShift(): void {
    if (this.currentShiftAssignment) {
      this.currentShiftAssignment.status = 'completed';
      this.currentShiftAssignment.closingReadings = this.allMeterReadings.filter(
        (r) => r.type === 'closing',
      );
      this.storageService.clearShiftData();
      this.resetForm();
    }
  }

  resetForm(): void {
    this.currentShiftAssignment = null;
    this.allMeterReadings = [];
    this.closingReadingsRecorded = 0;
    this.showClosingReadingForm = false;
    this.showSalesReport = false;
    this.availableNozzles = [];
  }
}
