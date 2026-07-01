import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { MobileLayoutComponent } from '../../layout/mobile-layout.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MobileLayoutComponent, RouterLink],
  template: `
    <app-mobile-layout [showLogout]="true">
      <div class="content-medium flex min-h-0 flex-1 flex-col justify-center py-4">

        <h1 class="page-title">Perfil</h1>

        <div class="card mb-6 text-sm leading-6">
          <p><strong>Nome:</strong> {{ user()?.nome }}</p>
          <p><strong>Email:</strong> {{ user()?.email }}</p>
          <p><strong>Perfil:</strong>
            <span [class]="isAdmin() ? 'font-bold text-blue-700' : 'font-bold text-green-700'">
              {{ user()?.role }}
            </span>
          </p>
        </div>

        <nav class="profile-menu">

          <!-- Visível para TODOS -->
          <a routerLink="/ordens"           class="btn btn-primary">Lista de OS</a>
          <a routerLink="/ordens/abertas"   class="btn btn-primary">OS Abertas</a>
          <a routerLink="/ordens/historico" class="btn btn-primary">Histórico de OS</a>

          <!-- Apenas ADMIN -->
          @if (isAdmin()) {
            <a routerLink="/ordens/nova"   class="btn btn-primary">Adicionar OS</a>
            <a routerLink="/usuarios"      class="btn btn-primary">Lista de Usuários</a>
            <a routerLink="/usuarios/novo" class="btn btn-primary">Adicionar Usuário</a>
          }

        </nav>
      </div>
    </app-mobile-layout>
  `,
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);
  readonly isAdmin = this.auth.isAdmin;
  readonly user    = this.auth.user;
}
