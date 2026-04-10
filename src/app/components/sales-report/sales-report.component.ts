import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftAssignment, MeterReading, Nozzle } from '../../models/index';
import { SalesCalculationService } from '../../services/sales-calculation.service';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
})
export class SalesReportComponent implements OnInit {
  @Input() shiftAssignment: ShiftAssignment | null = null;
  @Input() meterReadings: MeterReading[] = [];
  @Input() availableNozzles: Nozzle[] = [];
  @Output() completedShift = new EventEmitter<void>();

  nozzleSales: {
    nozzleId: string;
    nozzleNumber: number;
    fuelType: string;
    opening: number;
    closing: number;
    sold: number;
    price: number;
    amount: number;
  }[] = [];
  totalLiters = 0;
  totalSalesAmount = 0;

  constructor(private salesCalculation: SalesCalculationService) {}

  ngOnInit(): void {
    this.calculateSales();
  }

  calculateSales(): void {
    this.nozzleSales = this.salesCalculation.calculateNozzleSales(
      this.meterReadings,
      this.shiftAssignment,
      this.availableNozzles,
    );

    this.totalLiters = this.salesCalculation.calculateTotalLiters(this.meterReadings);
    this.totalSalesAmount = this.salesCalculation.calculateTotalSalesAmount(
      this.meterReadings,
      this.shiftAssignment,
      this.availableNozzles,
    );
  }

  completeShift(): void {
    this.completedShift.emit();
  }
}
