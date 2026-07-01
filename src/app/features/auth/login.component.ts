import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <main class="login-page">
      <section class="login-shell">

        <aside class="login-brand">
          <div class="logo-box">TECH<br>ONE</div>
          <div>
            <h2>Gestão de Ordens de Serviço</h2>
          </div>
        </aside>

        <div class="login-panel">
          <div class="login-card">
            <div class="logo-box login-mobile-logo">TECH<br>ONE</div>
            <h1 class="login-title">LOGIN</h1>
            <p class="login-subtitle">Faça seu Login</p>

            <form class="login-form" (ngSubmit)="login()">
              <input class="input" name="email" type="email"
                     [(ngModel)]="email" placeholder="Email"
                     autocomplete="username" required />
              <input class="input" name="password" type="password"
                     [(ngModel)]="password" placeholder="Senha"
                     autocomplete="current-password" required />

              @if (errorMsg()) {
                <p class="rounded bg-red-50 p-2 text-sm text-red-700">{{ errorMsg() }}</p>
              }

              <button class="btn btn-primary" type="submit" [disabled]="loading()">
                @if (loading()) { Entrando… } @else { Login }
              </button>
            </form>

            <a routerLink="/recuperar-senha" class="login-link">Esqueci Minha Senha</a>
          </div>
        </div>

      </section>
    </main>
  `,
})
export class LoginComponent {
  email    = '';
  password = '';

  readonly loading  = signal(false);
  readonly errorMsg = signal('');

  constructor(
    private readonly auth:   AuthService,
    private readonly router: Router,
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      this.errorMsg.set('Informe email e senha.');
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');

    this.auth.login({ email: this.email, senha: this.password }).subscribe({
      next:  ()           => this.router.navigateByUrl('/perfil'),
      error: (msg: string) => { this.errorMsg.set(msg); this.loading.set(false); },
    });
  }
}
