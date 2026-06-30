import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

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

  get usernameCtrl() { return this.form.get('username')!; }
  get passwordCtrl() { return this.form.get('password')!; }
  get confirmCtrl()  { return this.form.get('confirmPassword')!; }
  get planLabel()    { return this.planNames[this.planKey] ?? this.planKey; }

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.errorMsg = '';

    const { username, password } = this.form.value as { username: string; password: string };

    this.auth.signUp(username, password).pipe(
      switchMap(() => this.auth.signIn(username, password))
    ).subscribe({
      next: (res) => {
        this.auth.saveSession({ userId: res.id, username: res.username, token: res.token });
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
