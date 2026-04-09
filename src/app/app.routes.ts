import { Routes } from '@angular/router';
import { ShiftStartComponent } from './components/shift-start.component';
import { DailySalesComponent } from './components/daily-sales.component';

export const routes: Routes = [
  { path: '', redirectTo: 'shift-start', pathMatch: 'full' },
  { path: 'shift-start', component: ShiftStartComponent },
  { path: 'daily-sales', component: DailySalesComponent },
  { path: '**', redirectTo: 'shift-start' },
];
