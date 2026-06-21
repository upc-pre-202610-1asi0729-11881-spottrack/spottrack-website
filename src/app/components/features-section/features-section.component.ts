import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface Feature {
  key: string;
  icon: string;
  color: string;
  featured?: boolean;
}

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.css']
})
export class FeaturesSectionComponent implements AfterViewInit {
  @ViewChildren('featureCard') cards!: QueryList<ElementRef>;

  features: Feature[] = [
    { key: 'iotSensors',        icon: 'sensor',    color: '#f7b731' },
    { key: 'cloudStorage',      icon: 'cloud',     color: '#40e0d0' },
    { key: 'realTimeMonitor',   icon: 'monitor',   color: '#f7b731', featured: true },
    { key: 'maintenanceAlerts', icon: 'alert',     color: '#4ade80' },
    { key: 'analyticDashboard', icon: 'dashboard', color: '#f7b731' },
    { key: 'jwtSecurity',       icon: 'security',  color: '#40e0d0' },
  ];

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    this.cards.forEach(c => {
      observer.observe(c.nativeElement);
      this.attachTilt(c.nativeElement);
    });
  }

  private attachTilt(el: HTMLElement): void {
    const MAX = 9;
    el.addEventListener('mousemove', (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateX(${-y * MAX}deg) rotateY(${x * MAX}deg) translateY(-6px) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  }
}
