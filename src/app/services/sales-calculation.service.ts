import { Injectable } from '@angular/core';
import { MeterReading, ShiftAssignment } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class SalesCalculationService {
  /**
   * Calculate liters dispensed between opening and closing readings
   */
  calculateLitersDispensed(openingReading: number, closingReading: number): number {
    return Math.max(0, closingReading - openingReading);
  }

  /**
   * Get opening reading for a nozzle
   */
  getOpeningReading(nozzleId: string, readings: MeterReading[]): number | null {
    const opening = readings.find((r) => r.nozzleId === nozzleId && r.type === 'opening');
    return opening ? opening.readingValue : null;
  }

  /**
   * Get closing reading for a nozzle
   */
  getClosingReading(nozzleId: string, readings: MeterReading[]): number | null {
    const closing = readings.find((r) => r.nozzleId === nozzleId && r.type === 'closing');
    return closing ? closing.readingValue : null;
  }

  /**
   * Get price for fuel type
   */
  getPriceForFuelType(fuelType: string, shiftAssignment: ShiftAssignment | null): number {
    if (!shiftAssignment) return 0;
    if (fuelType === 'Diesel') return shiftAssignment.dieselPrice || 0;
    if (fuelType === 'Petrol') return shiftAssignment.petrolPrice || 0;
    return 0;
  }

  /**
   * Calculate sales amount for a nozzle
   */
  calculateSalesAmount(liters: number, price: number): number {
    return liters * price;
  }

  /**
   * Calculate sales for all nozzles with amount
   */
  calculateNozzleSales(
    readings: MeterReading[],
    shiftAssignment: ShiftAssignment | null,
    nozzleDetails: any[],
  ): {
    nozzleId: string;
    nozzleNumber: number;
    fuelType: string;
    opening: number;
    closing: number;
    sold: number;
    price: number;
    amount: number;
  }[] {
    const nozzleIds = [...new Set(readings.map((r) => r.nozzleId))];

    return nozzleIds
      .map((nozzleId) => {
        const nozzle = nozzleDetails.find((n) => n.id === nozzleId);
        const opening = this.getOpeningReading(nozzleId, readings);
        const closing = this.getClosingReading(nozzleId, readings);
        const liters = opening && closing ? this.calculateLitersDispensed(opening, closing) : 0;
        const price = this.getPriceForFuelType(nozzle?.fuelType, shiftAssignment);
        const amount = this.calculateSalesAmount(liters, price);

        return {
          nozzleId,
          nozzleNumber: nozzle?.nozzleNumber || 0,
          fuelType: nozzle?.fuelType || 'Unknown',
          opening: opening || 0,
          closing: closing || 0,
          sold: liters,
          price,
          amount,
        };
      })
      .sort((a, b) => a.nozzleNumber - b.nozzleNumber)
      .filter((s) => s.opening > 0 || s.closing > 0);
  }

  /**
   * Calculate total sales liters
   */
  calculateTotalLiters(readings: MeterReading[]): number {
    const sales = this.calculateNozzleSales(readings, null, []);
    return sales.reduce((sum, s) => sum + s.sold, 0);
  }

  /**
   * Calculate total sales amount
   */
  calculateTotalSalesAmount(
    readings: MeterReading[],
    shiftAssignment: ShiftAssignment | null,
    nozzleDetails: any[],
  ): number {
    const sales = this.calculateNozzleSales(readings, shiftAssignment, nozzleDetails);
    return sales.reduce((sum, s) => sum + s.amount, 0);
  }
}
