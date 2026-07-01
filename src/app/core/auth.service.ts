import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from './auth.model';

const API_URL   = 'https://tech-on-api.onrender.com';
const TOKEN_KEY = 'tech_one_token';
const USER_KEY  = 'tech_one_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly _user = signal<LoginResponse | null>(this.loadUser());

  readonly user     = this._user.asReadonly();
  readonly isLogged = computed(() => !!this._user());
  readonly isAdmin  = computed(() => this._user()?.role === 'ADMIN');

  constructor(
    private readonly http:   HttpClient,
    private readonly router: Router,
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_URL}/api/auth/login`, credentials)
      .pipe(
        tap(response => this.saveSession(response)),
        catchError(err => throwError(() => this.parseError(err))),
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
    this.router.navigateByUrl('/login');
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private saveSession(response: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response));
    this._user.set(response);
  }

  private loadUser(): LoginResponse | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as LoginResponse) : null;
    } catch {
      return null;
    }
  }

  private parseError(err: HttpErrorResponse): string {
    if (err.status === 401) return 'Email ou senha inválidos.';
    if (err.status === 0)   return 'Servidor indisponível. Tente novamente.';
    return err.error?.message ?? 'Erro inesperado. Tente novamente.';
  }
}
