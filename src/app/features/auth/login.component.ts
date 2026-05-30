import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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
              <input class="input" name="login" [(ngModel)]="username" placeholder="Login" autocomplete="username">
              <input class="input" name="password" [(ngModel)]="password" placeholder="Senha" type="password" autocomplete="current-password">
              @if (error()) {
                <p class="rounded bg-red-50 p-2 text-sm text-red-700">{{ error() }}</p>
              }
              <button class="btn btn-primary" type="submit">Login</button>
            </form>

            <a routerLink="/recuperar-senha" class="login-link">Esqueci Minha Senha</a>
          </div>
        </div>
      </section>
    </main>
  `
})
export class LoginComponent {
  username = 'Israel1';
  password = '123456';
  readonly error = signal('');

  constructor(private readonly router: Router) {}

  login(): void {
    if (!this.username || !this.password) {
      this.error.set('Informe login e senha.');
      return;
    }
    this.router.navigateByUrl('/perfil');
  }
}
