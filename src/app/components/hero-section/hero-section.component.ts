import { Component, signal } from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { Router } from '@angular/router';
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
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
    ]),
    trigger('navbarFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('900ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
    ]),
    trigger('heroFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('1200ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
    ]),
    //hover buttons
    trigger('hoverNavBtn', [
      state('hovered', style({ color: 'white' })),
      state('normal', style({ color: 'gray' })),
      transition('normal <=> hovered', animate('300ms ease-in-out')),
    ]),
  ],
})
export class HeroSectionComponent {
  private _title: string = 'SpotTrack';
  readonly appUrl = 'https://kind-desert-06c07fc10.7.azurestaticapps.net';

  btnStates = Array.from({ length: 4 }, () => signal<'normal' | 'hovered'>('normal'));
  benefitKeys = [0, 1, 2, 3].map(i => `hero.benefits.${i}`);

  get Title() {
    return this._title;
  }

  public setHover(index: number, isHovered: boolean): void {
    const newState = isHovered ? 'hovered' : 'normal';
    this.btnStates[index].set(newState);
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

  protected readonly onmouseenter = onmouseenter;

  navigateToLogin(): void {
    window.location.href = 'https://kind-desert-06c07fc10.7.azurestaticapps.net/';
  }
}

