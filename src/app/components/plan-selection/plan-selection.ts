import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StripeService } from '../../services/stripe';

interface Plan {
  key: string;
  name: string;
  price: number;
  popular: boolean;
  features: string[];
}

@Component({
  selector: 'app-plan-selection',
  standalone: true,
  templateUrl: './plan-selection.html',
  styleUrl: './plan-selection.css',
})
export class PlanSelectionComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private stripe = inject(StripeService);

  selectedKey = 'basic';
  loadingPlan: string | null = null;

  readonly plans: Plan[] = [
    {
      key: 'basic', name: 'Basic', price: 69, popular: false,
      features: [
        'Up to 20 equipment units',
        'Real-time monitoring',
        'Maintenance alerts',
        'Email support',
      ],
    },
    {
      key: 'mid', name: 'Mid', price: 109, popular: true,
      features: [
        'Up to 60 equipment units',
        'Real-time monitoring',
        'Advanced alerts & reports',
        'Priority email support',
        'Analytics dashboard',
      ],
    },
    {
      key: 'platinum', name: 'Platinum', price: 189, popular: false,
      features: [
        'Unlimited equipment units',
        'Real-time monitoring',
        'Custom alerts & reports',
        '24/7 priority support',
        'Full analytics suite',
        'API access',
      ],
    },
  ];

  ngOnInit(): void {
    if (!this.auth.getSession()) {
      const plan = this.route.snapshot.queryParamMap.get('plan') ?? 'basic';
      this.router.navigate(['/register'], { queryParams: { plan } });
      return;
    }
    this.selectedKey = this.route.snapshot.queryParamMap.get('plan') ?? 'basic';
  }

  get selectedPlan(): Plan {
    return this.plans.find(p => p.key === this.selectedKey) ?? this.plans[0];
  }

  selectPlan(key: string): void {
    this.selectedKey = key;
  }

  async proceedToPayment(): Promise<void> {
    if (this.loadingPlan) return;
    this.loadingPlan = this.selectedKey;
    try {
      sessionStorage.setItem('spottrack_pending_plan', this.selectedKey);
      await this.stripe.redirectToCheckout(this.selectedKey);
    } catch (err) {
      console.error('[Stripe] Checkout failed:', err);
      alert('Payment service unavailable. Please try again later.');
      this.loadingPlan = null;
    }
  }
}
