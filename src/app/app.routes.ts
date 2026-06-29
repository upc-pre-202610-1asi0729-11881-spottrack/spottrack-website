import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { PaymentSuccessComponent } from './components/payment-success/payment-success';
import { PaymentCancelComponent } from './components/payment-cancel/payment-cancel';

export const routes: Routes = [
  { path: '', component: Layout },
  { path: 'payment/success', component: PaymentSuccessComponent },
  { path: 'payment/cancel', component: PaymentCancelComponent },
];
