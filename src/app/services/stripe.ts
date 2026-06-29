import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

interface PlanConfig {
  tier: string;
  amount: number;
  currency: string;
}

const PLAN_CONFIG: Record<string, PlanConfig> = {
  basic:    { tier: 'BASIC',    amount: 69,  currency: 'usd' },
  mid:      { tier: 'MID',      amount: 109, currency: 'usd' },
  platinum: { tier: 'PLATINUM', amount: 189, currency: 'usd' },
};

@Injectable({ providedIn: 'root' })
export class StripeService {
  constructor(private http: HttpClient) {}

  async redirectToCheckout(planKey: string, userId: number = 1): Promise<void> {
    const config = PLAN_CONFIG[planKey];
    if (!config) return;

    const body = new HttpParams()
      .set('userId', userId.toString())
      .set('membershipTier', config.tier)
      .set('amount', config.amount.toString())
      .set('currency', config.currency);

    const checkoutUrl = await firstValueFrom(
      this.http.post(`${environment.backendUrl}/api/v1/payments`, body.toString(), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        responseType: 'text',
      })
    );

    window.location.href = checkoutUrl;
  }
}
