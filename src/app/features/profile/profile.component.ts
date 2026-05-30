import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MobileLayoutComponent } from '../../layout/mobile-layout.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MobileLayoutComponent, RouterLink],
  template: `
    <app-mobile-layout [showLogout]="true">
      <div class="content-medium flex min-h-0 flex-1 flex-col justify-center py-4">
        <h1 class="page-title">Perfil</h1>
        <nav class="profile-menu">
          <a routerLink="/usuarios/novo" class="btn btn-primary">Adicionar Usuário</a>
          <a routerLink="/usuarios" class="btn btn-primary">Listas de Usuários</a>
          <a routerLink="/ordens/historico" class="btn btn-primary">Históricos de OS</a>
          <a routerLink="/ordens/nova" class="btn btn-primary">Adicionar OS</a>
          <a routerLink="/ordens" class="btn btn-primary">Editar OS</a>
          <a routerLink="/ordens/abertas" class="btn btn-primary">OS Abertas</a>
        </nav>
      </div>
    </app-mobile-layout>
  `
})
export class ProfileComponent {}
