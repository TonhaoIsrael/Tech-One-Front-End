import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  template: `
    <main class="app-page">
      <div class="app-shell relative">
        <header class="shell-header"><a routerLink="/login" class="text-2xl">☰</a></header>
        <section class="shell-content">
          <div class="content-medium flex min-h-0 flex-1 flex-col justify-center">
            <h1 class="text-center text-2xl font-bold tracking-wide">Recuperação de Senha</h1>
            <form class="mt-12 flex min-h-0 flex-col space-y-6" (ngSubmit)="next()">
              @if (step() === 1) {
                <label class="label">Email</label>
                <input class="input" name="email" [(ngModel)]="email" placeholder="tec1@example.com" type="email">
              } @else if (step() === 2) {
                <label class="label">Insira o código</label>
                <input class="input" name="code" [(ngModel)]="code" placeholder="000000" inputmode="numeric">
              } @else {
                <label class="label">Nova Senha</label>
                <input class="input" name="newPassword" [(ngModel)]="newPassword" type="password" placeholder="**********">
                <label class="label">Confirme sua Senha</label>
                <input class="input" name="confirmPassword" [(ngModel)]="confirmPassword" type="password" placeholder="**********">
              }
              <div class="action-bar">
                <a routerLink="/login" class="btn btn-danger">Cancelar</a>
                <button class="btn btn-primary" type="submit">{{ confirmLabel() }}</button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  `
})
export class ForgotPasswordComponent {
  readonly step = signal<1 | 2 | 3>(1);
  readonly confirmLabel = computed(() => this.step() === 3 ? 'Confirmar' : 'Confirmar');
  email = 'tec1@example.com';
  code = '';
  newPassword = '';
  confirmPassword = '';

  constructor(private readonly router: Router) {}

  next(): void {
    if (this.step() < 3) {
      this.step.update(step => (step + 1) as 1 | 2 | 3);
      return;
    }
    this.router.navigateByUrl('/login');
  }
}
