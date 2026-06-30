import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { PaymentSuccessComponent } from './components/payment-success/payment-success';
import { PaymentCancelComponent } from './components/payment-cancel/payment-cancel';
import { RegisterComponent } from './components/register/register';
import { PlanSelectionComponent } from './components/plan-selection/plan-selection';

export const routes: Routes = [
  { path: '', component: Layout },
  { path: 'register', component: RegisterComponent },
  { path: 'plans', component: PlanSelectionComponent },
  { path: 'payment/success', component: PaymentSuccessComponent },
  { path: 'payment/cancel', component: PaymentCancelComponent },
];
