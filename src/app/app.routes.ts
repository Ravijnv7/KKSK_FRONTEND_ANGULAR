import { Routes } from '@angular/router';
import { ShiftStartComponent } from './components/shift-start.component';
import { ShiftCloseComponent } from './components/shift-close/shift-close.component';
import { DailySalesComponent } from './components/daily-sales.component';

export const routes: Routes = [
  { path: '', redirectTo: 'shift-start', pathMatch: 'full' },
  { path: 'shift-start', component: ShiftStartComponent },
  { path: 'shift-close', component: ShiftCloseComponent },
  { path: 'daily-sales', component: DailySalesComponent },
  { path: '**', redirectTo: 'shift-start' },
];
