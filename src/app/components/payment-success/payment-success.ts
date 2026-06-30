import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

const PLAN_LABELS: Record<string, string> = {
  basic: 'Basic',
  mid: 'Mid',
  platinum: 'Platinum',
};

@Component({
  selector: 'app-payment-success',
  standalone: true,
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css',
})
export class PaymentSuccessComponent implements OnInit {
  planLabel = 'SpotTrack';
  webappUrl = environment.webappUrl;

  ngOnInit(): void {
    const pendingPlan = sessionStorage.getItem('spottrack_pending_plan');
    if (pendingPlan && PLAN_LABELS[pendingPlan]) {
      this.planLabel = `SpotTrack ${PLAN_LABELS[pendingPlan]}`;
    }
    sessionStorage.removeItem('spottrack_pending_plan');
  }
}
