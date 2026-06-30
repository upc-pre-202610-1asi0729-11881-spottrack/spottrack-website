import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

interface PlanConfig {
  tier: string;
  amount: number;
  currency: string;
}

const PLAN_CONFIG: Record<string, PlanConfig> = {
  basic:    { tier: 'BASIC',    amount: 69,  currency: 'USD' },
  mid:      { tier: 'MID',      amount: 109, currency: 'USD' },
  platinum: { tier: 'PLATINUM', amount: 189, currency: 'USD' },
};

@Injectable({ providedIn: 'root' })
export class StripeService {
  constructor(private http: HttpClient) {}

  async redirectToCheckout(planKey: string): Promise<void> {
    const config = PLAN_CONFIG[planKey];
    if (!config) throw new Error(`Unknown plan: ${planKey}`);

    const raw = sessionStorage.getItem('spottrack_session');
    const session = raw ? JSON.parse(raw) : null;
    if (!session?.userId || !session?.token) throw new Error('No active session. Please sign up first.');

    const headers = new HttpHeaders({ Authorization: `Bearer ${session.token}` });

    const { checkoutUrl } = await firstValueFrom(
      this.http.post<{ checkoutUrl: string }>(
        `${environment.backendUrl}/api/v1/payments`,
        {
          userId: session.userId,
          membershipTier: config.tier,
          amount: config.amount,
          currency: config.currency,
        },
        { headers }
      )
    );

    window.location.href = checkoutUrl;
  }
}
