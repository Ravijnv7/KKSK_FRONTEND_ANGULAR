export enum FuelType {
  PETROL = 'Petrol',
  DIESEL = 'Diesel',
}

export interface Staff {
  id: string;
  name: string;
  shift: string; // Morning, Afternoon, Night
  status: 'active' | 'inactive';
}

export interface Nozzle {
  id: string;
  duId: string;
  nozzleNumber: number;
  fuelType: FuelType;
  currentReading: number;
}

export interface DU {
  id: string;
  name: string; // DU-1, DU-2
  nozzles: Nozzle[];
}

export interface MeterReading {
  id: string;
  nozzleId: string;
  duId: string;
  staffId: string;
  staffName: string;
  readingValue: number;
  readingTime: Date;
  type: 'opening' | 'closing'; // opening or closing reading
}

export interface ShiftAssignment {
  id: string;
  staffId: string;
  staffName: string;
  nozzleIds: string[];
  duId: string;
  shiftDate: Date;
  openingReadings: MeterReading[];
  closingReadings?: MeterReading[];
  status: 'in-progress' | 'completed';
}

export interface DailySalesReport {
  date: Date;
  du: DU;
  nozzleWiseSales: {
    nozzleId: string;
    nozzleNumber: number;
    fuelType: FuelType;
    openingReading: number;
    closingReading: number;
    litersDispensed: number;
    staffAssignments: ShiftAssignment[];
  }[];
  totalSales: number;
}
