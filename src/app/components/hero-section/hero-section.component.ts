import { Component, signal, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css'],
  imports: [LanguageSwitcher, TranslatePipe],
  animations: [
    trigger('headerFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-24px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('leftColFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-32px)' }),
        animate('650ms 200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('rightColFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(40px)' }),
        animate('700ms 400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('hoverNavBtn', [
      transition('normal => hovered', animate('200ms ease-in-out')),
      transition('hovered => normal', animate('200ms ease-in-out')),
    ]),
  ],
})
export class HeroSectionComponent implements AfterViewInit {
  @ViewChild('heroBgVideo') heroBgVideo!: ElementRef<HTMLVideoElement>;
  readonly appUrl = 'https://ashy-meadow-0d9e60a10.7.azurestaticapps.net';

  btnStates = Array.from({ length: 4 }, () => signal<'normal' | 'hovered'>('normal'));
  benefitKeys = [0, 1, 2, 3].map(i => `hero.benefits.${i}`);
  isScrolled = signal(false);

  ngAfterViewInit(): void {
    const video = this.heroBgVideo?.nativeElement;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  navigateToApp(): void {
    window.open(this.appUrl, '_blank');
  }

  navigateToClientSignup(): void {
    window.open(`${this.appUrl}/register`, '_blank');
  }
}
