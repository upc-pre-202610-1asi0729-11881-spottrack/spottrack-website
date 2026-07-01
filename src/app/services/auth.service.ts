import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserSession {
  userId: number;
  username: string;
  token: string;
}

export interface AdminProfileInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dni: string;
  companyName: string;
  ruc: string;
  legalType: string;
  companyPhone: string;
  companyEmail: string;
  street: string;
  city: string;
  district: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SESSION_KEY = 'spottrack_session';

  constructor(private http: HttpClient) {}

  // Anyone registering through the landing page is signing up to run a gym
  // on SpotTrack, so this always grants ROLE_ADMIN via the business sign-up
  // endpoint rather than the default ROLE_CLIENT one.
  signUp(username: string, password: string): Observable<{ id: number; username: string; roles: string[] }> {
    return this.http.post<{ id: number; username: string; roles: string[] }>(
      `${environment.backendUrl}/api/v1/authentication/sign-up-business`,
      { username, password }
    );
  }

  signIn(username: string, password: string): Observable<{ id: number; username: string; token: string }> {
    return this.http.post<{ id: number; username: string; token: string }>(
      `${environment.backendUrl}/api/v1/authentication/sign-in`,
      { username, password }
    );
  }

  updateAdminProfile(info: AdminProfileInfo, token: string): Observable<unknown> {
    return this.http.put(
      `${environment.backendUrl}/api/v1/profiles/admins/me`,
      info,
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }

  saveSession(session: UserSession): void {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  }

  getSession(): UserSession | null {
    const raw = sessionStorage.getItem(this.SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  clearSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }
}
