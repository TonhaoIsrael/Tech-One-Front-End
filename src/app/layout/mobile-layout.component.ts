import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mobile-layout',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="app-page">
      <div class="app-shell relative">
        <header class="shell-header">
          <a routerLink="/perfil" class="text-2xl leading-none text-gray-800" aria-label="Abrir perfil">☰</a>
          @if (showLogout()) {
            <a routerLink="/login" class="text-xl text-gray-500" aria-label="Sair">⇱</a>
          }
        </header>
        <section class="shell-content">
          <ng-content />
        </section>
      </div>
    </main>
  `
})
export class MobileLayoutComponent {
  readonly showLogout = input(false);
}
