import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-cancel',
  standalone: true,
  templateUrl: './payment-cancel.html',
  styleUrl: './payment-cancel.css',
})
export class PaymentCancelComponent implements OnInit {
  plansUrl = '/plans';

  ngOnInit(): void {
    const pendingPlan = sessionStorage.getItem('spottrack_pending_plan');
    if (pendingPlan) {
      this.plansUrl = `/plans?plan=${pendingPlan}`;
    }
  }
}
