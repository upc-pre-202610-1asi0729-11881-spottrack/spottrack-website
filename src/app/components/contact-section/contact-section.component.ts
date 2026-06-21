import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import emailjs from '@emailjs/browser';

interface Testimonial {
  initials: string;
  name: string;
  role: string;
  quote: string;
  color: string;
}

interface Stat {
  value: string;
  label: string;
}

@Component({
  selector: 'contact-section',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.css']
})
export class ContactSection implements OnInit, AfterViewInit {
  @ViewChild('contactVideo') contactVideo!: ElementRef<HTMLVideoElement>;
  @ViewChildren('tCard') tCards!: QueryList<ElementRef>;

  contactForm!: FormGroup;

  testimonials: Testimonial[] = [
    {
      initials: 'CM',
      name: 'Carlos M.',
      role: 'Gym Owner · Lima',
      quote: 'Reduced equipment wait times by 40% in the first month.',
      color: '#f7b731',
    },
    {
      initials: 'AP',
      name: 'Ana P.',
      role: 'Operations Manager · Cusco',
      quote: 'Real-time alerts saved us from 3 major breakdowns last quarter.',
      color: '#40e0d0',
    },
    {
      initials: 'RV',
      name: 'Roberto V.',
      role: 'Franchise Director · Arequipa',
      quote: 'Managing 5 gym locations from one dashboard is a game changer.',
      color: '#4ade80',
    },
  ];

  stats: Stat[] = [
    { value: '98%',    label: 'Equipment Uptime'    },
    { value: '500+',   label: 'Gyms Served'         },
    { value: '2.3M+',  label: 'IoT Events / Day'    },
    { value: '99.9%',  label: 'Platform SLA'        },
    { value: '<500ms', label: 'Alert Response'      },
    { value: '40+',    label: 'Cities'              },
    { value: '12k+',   label: 'Machines Monitored'  },
    { value: '4.9★',   label: 'Client Rating'       },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name:    ['', [Validators.required]],
      email:   ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    const video = this.contactVideo?.nativeElement;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.2 }
    );
    this.tCards.forEach(c => observer.observe(c.nativeElement));
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const serviceID  = 'service_8z4yvrk';
      const templateID = 'template_muervr3';
      const publicKey  = '6RLuwrQZ4Qh9K4vh4';

      emailjs.send(serviceID, templateID, {
        from_name:  this.contactForm.value.name,
        from_email: this.contactForm.value.email,
        message:    this.contactForm.value.message,
      }, publicKey).then(
        r  => { console.log('OK', r.status); this.contactForm.reset(); },
        er => { console.log('ERR', er); }
      );
    }
  }
}
