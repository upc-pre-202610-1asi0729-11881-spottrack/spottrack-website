import { Component, inject, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { StripeService } from '../../services/stripe';

interface Plan {
  key: string;
  popular: boolean;
  featureKeys: string[];
  chartLine: string;
  chartArea: string;
}

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './pricing-section.html',
  styleUrl: './pricing-section.css',
})
export class PricingSection implements AfterViewInit {
  @ViewChildren('planCard') cards!: QueryList<ElementRef>;

  plans: Plan[] = [
    {
      key: 'basic',
      popular: false,
      featureKeys: [0, 1, 2, 3].map(i => `pricing.basic.features.${i}`),
      chartLine: '0,56 33,50 66,44 100,38 133,32 166,26 200,18',
      chartArea: 'M0,56 L33,50 L66,44 L100,38 L133,32 L166,26 L200,18 L200,64 L0,64 Z',
    },
    {
      key: 'mid',
      popular: true,
      featureKeys: [0, 1, 2, 3, 4].map(i => `pricing.mid.features.${i}`),
      chartLine: '0,60 33,54 66,42 100,28 133,16 166,9 200,4',
      chartArea: 'M0,60 L33,54 L66,42 L100,28 L133,16 L166,9 L200,4 L200,64 L0,64 Z',
    },
    {
      key: 'platinum',
      popular: false,
      featureKeys: [0, 1, 2, 3, 4].map(i => `pricing.platinum.features.${i}`),
      chartLine: '0,42 33,32 66,24 100,18 133,13 166,8 200,4',
      chartArea: 'M0,42 L33,32 L66,24 L100,18 L133,13 L166,8 L200,4 L200,64 L0,64 Z',
    },
  ];

  private stripeService = inject(StripeService);

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    this.cards.forEach(c => {
      observer.observe(c.nativeElement);
      this.attachTilt(c.nativeElement);
    });
  }

  private attachTilt(el: HTMLElement): void {
    const MAX = 7;
    el.addEventListener('mousemove', (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateX(${-y * MAX}deg) rotateY(${x * MAX}deg) translateY(-6px) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  }

  getChartDots(chartLine: string): Array<{x: number; y: number}> {
    return chartLine.split(' ').map(pair => {
      const [x, y] = pair.split(',').map(Number);
      return { x, y };
    });
  }

  async onBuyNow(planKey: string): Promise<void> {
    await this.stripeService.redirectToCheckout(planKey);
  }
}
