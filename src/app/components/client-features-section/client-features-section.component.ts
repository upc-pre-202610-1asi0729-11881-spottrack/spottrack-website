import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface ClientFeature {
  key: string;
  icon: string;
  color: string;
  featured?: boolean;
}

@Component({
  selector: 'app-client-features-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './client-features-section.component.html',
  styleUrls: ['./client-features-section.component.css']
})
export class ClientFeaturesSectionComponent implements AfterViewInit {
  @ViewChildren('clientFeatureCard') cards!: QueryList<ElementRef>;

  features: ClientFeature[] = [
    { key: 'availabilityMap',   icon: 'monitor',   color: '#f7b731', featured: true },
    { key: 'reservations',      icon: 'sensor',    color: '#40e0d0' },
    { key: 'smartAlternatives', icon: 'dashboard', color: '#4ade80' },
    { key: 'workoutRoutines',   icon: 'cloud',     color: '#f7b731' },
    { key: 'instantAlerts',     icon: 'alert',     color: '#40e0d0' },
    { key: 'memberProfile',     icon: 'security',  color: '#4ade80' },
  ];

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    this.cards.forEach(c => observer.observe(c.nativeElement));
  }
}
