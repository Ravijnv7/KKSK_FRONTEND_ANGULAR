import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { ShiftAssignment, MeterReading } from '../models/index';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveShiftAssignment', () => {
    it('should save shift assignment to localStorage', () => {
      const mockAssignment: ShiftAssignment = {
        id: 'test-1',
        staffId: 'staff-1',
        staffName: 'John',
        nozzleIds: ['nozzle-1'],
        duId: 'du-1',
        shiftDate: new Date(),
        openingReadings: [],
        status: 'in-progress',
      };

      service.saveShiftAssignment(mockAssignment);
      const saved = localStorage.getItem('petrol_pump_shift_assignment');
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved!)).toEqual(mockAssignment);
    });
  });

  describe('getShiftAssignment', () => {
    it('should retrieve shift assignment from localStorage', () => {
      const mockAssignment: ShiftAssignment = {
        id: 'test-1',
        staffId: 'staff-1',
        staffName: 'John',
        nozzleIds: ['nozzle-1'],
        duId: 'du-1',
        shiftDate: new Date(),
        openingReadings: [],
        status: 'in-progress',
      };

      service.saveShiftAssignment(mockAssignment);
      const retrieved = service.getShiftAssignment();
      expect(retrieved).toEqual(mockAssignment);
    });

    it('should return null when no assignment is saved', () => {
      const retrieved = service.getShiftAssignment();
      expect(retrieved).toBeNull();
    });
  });

  describe('saveMeterReading', () => {
    it('should save meter reading to localStorage', () => {
      const mockReading: MeterReading = {
        id: 'reading-1',
        nozzleId: 'nozzle-1',
        duId: 'du-1',
        staffId: 'staff-1',
        staffName: 'John',
        readingValue: 100,
        readingTime: new Date(),
        type: 'opening',
      };

      service.saveMeterReading(mockReading);
      const readings = service.getMeterReadings();
      expect(readings.length).toBe(1);
      expect(readings[0]).toEqual(mockReading);
    });
  });

  describe('getMeterReadings', () => {
    it('should retrieve all meter readings', () => {
      const reading1: MeterReading = {
        id: 'reading-1',
        nozzleId: 'nozzle-1',
        duId: 'du-1',
        staffId: 'staff-1',
        staffName: 'John',
        readingValue: 100,
        readingTime: new Date(),
        type: 'opening',
      };

      const reading2: MeterReading = {
        id: 'reading-2',
        nozzleId: 'nozzle-2',
        duId: 'du-1',
        staffId: 'staff-1',
        staffName: 'John',
        readingValue: 200,
        readingTime: new Date(),
        type: 'opening',
      };

      service.saveMeterReading(reading1);
      service.saveMeterReading(reading2);

      const readings = service.getMeterReadings();
      expect(readings.length).toBe(2);
    });

    it('should return empty array when no readings exist', () => {
      const readings = service.getMeterReadings();
      expect(readings).toEqual([]);
    });
  });

  describe('getReadingForNozzle', () => {
    it('should return reading for specific nozzle', () => {
      const mockReading: MeterReading = {
        id: 'reading-1',
        nozzleId: 'nozzle-1',
        duId: 'du-1',
        staffId: 'staff-1',
        staffName: 'John',
        readingValue: 100,
        readingTime: new Date(),
        type: 'opening',
      };

      service.saveMeterReading(mockReading);
      const retrieved = service.getReadingForNozzle('nozzle-1');
      expect(retrieved).toEqual(mockReading);
    });

    it('should return undefined for non-existent nozzle', () => {
      const retrieved = service.getReadingForNozzle('nozzle-999');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('hasReadingForNozzle', () => {
    it('should return true if reading exists for nozzle', () => {
      const mockReading: MeterReading = {
        id: 'reading-1',
        nozzleId: 'nozzle-1',
        duId: 'du-1',
        staffId: 'staff-1',
        staffName: 'John',
        readingValue: 100,
        readingTime: new Date(),
        type: 'opening',
      };

      service.saveMeterReading(mockReading);
      expect(service.hasReadingForNozzle('nozzle-1')).toBe(true);
    });

    it('should return false if reading does not exist for nozzle', () => {
      expect(service.hasReadingForNozzle('nozzle-999')).toBe(false);
    });
  });

  describe('clearShiftData', () => {
    it('should clear both shift and readings data', () => {
      const mockAssignment: ShiftAssignment = {
        id: 'test-1',
        staffId: 'staff-1',
        staffName: 'John',
        nozzleIds: ['nozzle-1'],
        duId: 'du-1',
        shiftDate: new Date(),
        openingReadings: [],
        status: 'in-progress',
      };

      const mockReading: MeterReading = {
        id: 'reading-1',
        nozzleId: 'nozzle-1',
        duId: 'du-1',
        staffId: 'staff-1',
        staffName: 'John',
        readingValue: 100,
        readingTime: new Date(),
        type: 'opening',
      };

      service.saveShiftAssignment(mockAssignment);
      service.saveMeterReading(mockReading);

      service.clearShiftData();

      expect(service.getShiftAssignment()).toBeNull();
      expect(service.getMeterReadings()).toEqual([]);
    });
  });
});
