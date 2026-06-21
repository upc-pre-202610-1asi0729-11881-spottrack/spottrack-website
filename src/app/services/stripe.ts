import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }
  async redirectToCheckout(planKey: string): Promise<void> {
    await this.stripePromise;
    // Mock — replace this object with a real HTTP call to your backend later
    const mockUrls: Record<string, string> = {
      basic:    'https://buy.stripe.com/test_eVqcN53St0ys17Kd32a7C04',
      mid:      'https://buy.stripe.com/test_fZu6oHbkV4OI17Kfbaa7C03',
      platinum: 'https://buy.stripe.com/test_4gM8wPcoZ1Cw03G8MMa7C01',
    };
    window.location.href = mockUrls[planKey] ?? '#';
  }
}
