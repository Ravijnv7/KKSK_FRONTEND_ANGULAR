import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReadingService, DUService } from '../services';
import { DailySalesReport, DU, MeterReading, FuelType } from '../models/index';

@Component({
  selector: 'app-daily-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-sales.component.html',
  styleUrls: ['./daily-sales.component.scss'],
})
export class DailySalesComponent implements OnInit {
  selectedDate: string = new Date().toISOString().split('T')[0];
  dus: DU[] = [];
  salesReports: DailySalesReport[] = [];
  loading = false;

  constructor(
    private readingService: ReadingService,
    private duService: DUService,
  ) {}

  ngOnInit(): void {
    this.loadDUs();
    this.generateReport();
  }

  loadDUs(): void {
    this.duService.getDUs().subscribe((dus) => {
      this.dus = dus;
    });
  }

  generateReport(): void {
    this.loading = true;
    const selectedDateObj = new Date(this.selectedDate);

    this.readingService.getMeterReadings().subscribe((readings) => {
      this.salesReports = [];

      this.dus.forEach((du) => {
        const duReadings = readings.filter((r) => r.duId === du.id);

        if (duReadings.length === 0) {
          this.loading = false;
          return;
        }

        const nozzleWiseSales = du.nozzles.map((nozzle) => {
          const nozzleReadings = duReadings.filter((r) => r.nozzleId === nozzle.id);

          const openingReadings = nozzleReadings.filter((r) => r.type === 'opening');
          const openingReading =
            openingReadings.length > 0
              ? openingReadings.reduce((min, r) => (r.readingValue < min.readingValue ? r : min))
              : null;

          const closingReadings = nozzleReadings.filter((r) => r.type === 'closing');
          const closingReading =
            closingReadings.length > 0
              ? closingReadings.reduce((max, r) => (r.readingValue > max.readingValue ? r : max))
              : null;

          const openingValue = openingReading?.readingValue || 0;
          const closingValue = closingReading?.readingValue || 0;
          const litersDispensed = closingValue - openingValue;

          return {
            nozzleId: nozzle.id,
            nozzleNumber: nozzle.nozzleNumber,
            fuelType: nozzle.fuelType,
            openingReading: openingValue,
            closingReading: closingValue,
            litersDispensed: litersDispensed > 0 ? litersDispensed : 0,
            staffAssignments: [], // Can be populated with actual assignments
          };
        });

        const totalSales = nozzleWiseSales.reduce((sum, n) => sum + n.litersDispensed, 0);

        const report: DailySalesReport = {
          date: selectedDateObj,
          du: du,
          nozzleWiseSales: nozzleWiseSales,
          totalSales: totalSales,
        };

        this.salesReports.push(report);
      });

      this.loading = false;
    });
  }

  onDateChange(): void {
    this.generateReport();
  }

  getTotalSalesAllDUs(): number {
    return this.salesReports.reduce((sum, report) => sum + report.totalSales, 0);
  }

  getDieselSales(nozzleWiseSales: any[]): number {
    return nozzleWiseSales
      .filter((n) => n.fuelType === FuelType.DIESEL)
      .reduce((sum, n) => sum + n.litersDispensed, 0);
  }

  getPetrolSales(nozzleWiseSales: any[]): number {
    return nozzleWiseSales
      .filter((n) => n.fuelType === FuelType.PETROL)
      .reduce((sum, n) => sum + n.litersDispensed, 0);
  }
}
