import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

const DNI_PATTERN = /^[0-9]{8}$/;
const PHONE_PATTERN = /^[0-9]{7,15}$/;

function passwordMatch(control: AbstractControl): ValidationErrors | null {
  const pw = control.get('password');
  const cpw = control.get('confirmPassword');
  if (pw && cpw && pw.value !== cpw.value) return { passwordMismatch: true };
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  planKey = 'basic';
  loading = false;
  errorMsg = '';

  readonly planNames: Record<string, string> = {
    basic: 'Basic',
    mid: 'Mid',
    platinum: 'Platinum',
  };

  form = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required, Validators.pattern(DNI_PATTERN)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatch }
  );

  ngOnInit(): void {
    this.planKey = this.route.snapshot.queryParamMap.get('plan') ?? 'basic';
    // Already have a session — skip registration
    if (this.auth.getSession()) {
      this.router.navigate(['/plans'], { queryParams: { plan: this.planKey } });
    }
  }

  get firstNameCtrl() { return this.form.get('firstName')!; }
  get lastNameCtrl()  { return this.form.get('lastName')!; }
  get dniCtrl()       { return this.form.get('dni')!; }
  get phoneCtrl()     { return this.form.get('phoneNumber')!; }
  get usernameCtrl()  { return this.form.get('username')!; }
  get passwordCtrl()  { return this.form.get('password')!; }
  get confirmCtrl()   { return this.form.get('confirmPassword')!; }
  get planLabel()     { return this.planNames[this.planKey] ?? this.planKey; }

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.errorMsg = '';

    const { firstName, lastName, dni, phoneNumber, username, password } = this.form.value as {
      firstName: string; lastName: string; dni: string; phoneNumber: string;
      username: string; password: string;
    };

    this.auth.signUp(username, password).pipe(
      switchMap(() => this.auth.signIn(username, password)),
      switchMap((res) => {
        this.auth.saveSession({ userId: res.id, username: res.username, token: res.token });
        return this.auth.createClientProfile(res.id, username, res.token).pipe(
          switchMap(() => this.auth.updateClientProfile({ firstName, lastName, phoneNumber, dni }, res.token))
        );
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/plans'], { queryParams: { plan: this.planKey } });
      },
      error: (err) => {
        this.loading = false;
        const status = err?.status;
        if (status === 409 || status === 400) {
          this.errorMsg = 'This email is already registered. Please use a different one.';
        } else {
          this.errorMsg = err?.error?.message ?? 'Registration failed. Please try again.';
        }
      },
    });
  }
}
