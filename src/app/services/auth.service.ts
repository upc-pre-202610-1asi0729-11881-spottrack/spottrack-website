import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserSession {
  userId: number;
  username: string;
  token: string;
}

export interface PersonInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dni: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SESSION_KEY = 'spottrack_session';

  constructor(private http: HttpClient) {}

  signUp(username: string, password: string): Observable<{ id: number; username: string; roles: string[] }> {
    return this.http.post<{ id: number; username: string; roles: string[] }>(
      `${environment.backendUrl}/api/v1/authentication/sign-up`,
      { username, password }
    );
  }

  signIn(username: string, password: string): Observable<{ id: number; username: string; token: string }> {
    return this.http.post<{ id: number; username: string; token: string }>(
      `${environment.backendUrl}/api/v1/authentication/sign-in`,
      { username, password }
    );
  }

  createClientProfile(userId: number, email: string, token: string): Observable<unknown> {
    return this.http.post(
      `${environment.backendUrl}/api/v1/profiles/clients`,
      { userId, email },
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }

  updateClientProfile(info: PersonInfo, token: string): Observable<unknown> {
    return this.http.put(
      `${environment.backendUrl}/api/v1/profiles/clients/me`,
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
