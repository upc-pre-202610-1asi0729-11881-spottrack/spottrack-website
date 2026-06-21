import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'footer-section',
  standalone: true,
  imports: [CommonModule,TranslatePipe],
  templateUrl: './footer-section.component.html',
  styleUrls: ['./footer-section.component.css']
})
export class FooterSection {
  // Año basado en la referencia visual del prototipo
  year: number = 2026;
}
