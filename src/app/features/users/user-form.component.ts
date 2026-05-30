import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppStore } from '../../core/app-store.service';
import { MobileLayoutComponent } from '../../layout/mobile-layout.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MobileLayoutComponent],
  template: `
    <app-mobile-layout>
      <div class="content-medium flex min-h-0 flex-1 flex-col">
        <h1 class="mb-8 text-center text-2xl font-bold tracking-widest">{{ title() }}</h1>
        <form class="flex min-h-0 flex-1 flex-col space-y-4" (ngSubmit)="save()">
          <input class="input" name="name" [(ngModel)]="name" placeholder="Nome" />
          <input class="input" name="email" [(ngModel)]="email" placeholder="Email" type="email" />
          @if (!id) {
            <input class="input" name="login" [(ngModel)]="login" placeholder="Login" />
          }
          <input class="input" name="password" [(ngModel)]="password" placeholder="Senha" type="password" />
          @if (!id) {
            <input class="input" name="confirmPassword" [(ngModel)]="confirmPassword" placeholder="Confirmar Senha" type="password" />
          }
          <select class="input" name="type" [(ngModel)]="type"><option>Usuario</option><option>Tecnico</option><option>Administrador</option></select>

          <div class="action-bar">
            <a routerLink="/usuarios" class="btn btn-danger">Cancelar</a>
            <button class="btn btn-primary" type="submit">Confirmar</button>
          </div>
        </form>
      </div>
    </app-mobile-layout>
  `
})
export class UserFormComponent {
  private readonly store = inject(AppStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly id = Number(this.route.snapshot.paramMap.get('id')) || undefined;
  readonly editingUser = computed(() => this.id ? this.store.findUser(this.id) : undefined);
  readonly title = computed(() => this.id ? 'Editar Usuario' : 'ADICIONAR USUARIO');

  name = this.editingUser()?.name ?? '';
  email = this.editingUser()?.email ?? '';
  login = this.editingUser()?.login ?? '';
  type = this.editingUser()?.type ?? 'Usuario';
  password = '';
  confirmPassword = '';


  save(): void {
    this.router.navigateByUrl('/usuarios');
  }
}
