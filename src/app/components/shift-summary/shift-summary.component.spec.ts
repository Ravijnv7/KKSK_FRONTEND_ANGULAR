import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShiftSummaryComponent } from './shift-summary.component';
import { DUService } from '../../services/du.service';
import { of } from 'rxjs';
import { ShiftAssignment, MeterReading, DU } from '../../models/index';

describe('ShiftSummaryComponent', () => {
  let component: ShiftSummaryComponent;
  let fixture: ComponentFixture<ShiftSummaryComponent>;
  let duService: jasmine.SpyObj<DUService>;

  beforeEach(async () => {
    const duServiceSpy = jasmine.createSpyObj('DUService', ['getDUById']);

    await TestBed.configureTestingModule({
      imports: [ShiftSummaryComponent],
      providers: [{ provide: DUService, useValue: duServiceSpy }],
    }).compileComponents();

    duService = TestBed.inject(DUService) as jasmine.SpyObj<DUService>;
    fixture = TestBed.createComponent(ShiftSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadNozzleDetails', () => {
    it('should load nozzles for the shift', () => {
      const mockDU: DU = {
        id: 'du-1',
        name: 'DU-1',
        nozzles: [
          {
            id: 'nozzle-1',
            duId: 'du-1',
            nozzleNumber: 1,
            fuelType: 'Diesel' as any,
            currentReading: 100,
          },
          {
            id: 'nozzle-2',
            duId: 'du-1',
            nozzleNumber: 2,
            fuelType: 'Petrol' as any,
            currentReading: 200,
          },
        ],
      };

      component.shiftAssignment = {
        id: 'assignment-1',
        staffId: 'staff-1',
        staffName: 'John',
        nozzleIds: ['nozzle-1', 'nozzle-2'],
        duId: 'du-1',
        shiftDate: new Date(),
        openingReadings: [],
        status: 'in-progress',
      };

      duService.getDUById.and.returnValue(of(mockDU));

      component.loadNozzleDetails();

      expect(component.nozzleDetails.length).toBe(2);
      expect(component.nozzleDetails[0].id).toBe('nozzle-1');
      expect(component.nozzleDetails[1].id).toBe('nozzle-2');
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
        readingValue: 150,
        readingTime: new Date(),
        type: 'opening',
      };

      component.meterReadings = [mockReading];

      const result = component.getReadingForNozzle('nozzle-1');
      expect(result).toEqual(mockReading);
    });

    it('should return undefined if no reading for nozzle', () => {
      component.meterReadings = [];
      const result = component.getReadingForNozzle('nozzle-999');
      expect(result).toBeUndefined();
    });
  });

  describe('completeShift', () => {
    it('should emit completedShift event', () => {
      spyOn(component.completedShift, 'emit');
      component.completeShift();
      expect(component.completedShift.emit).toHaveBeenCalled();
    });
  });
});
