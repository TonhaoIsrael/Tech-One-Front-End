import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/user.service';
import { AppUser } from '../../core/models';
import { MobileLayoutComponent } from '../../layout/mobile-layout.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [FormsModule, RouterLink, MobileLayoutComponent, ConfirmDialogComponent],
  template: `
    <app-mobile-layout>
      <div class="content-wide users-list-content">

        <input class="input users-search" [(ngModel)]="search"
               placeholder="Digite Email ou Nome *" />

        @if (loading()) {
          <p class="text-center text-sm text-gray-500 mt-8">Carregando usuários…</p>
        }

        @if (erro()) {
          <p class="rounded bg-red-50 p-4 text-center text-sm text-red-700">{{ erro() }}</p>
        }

        @if (!loading()) {
          <div class="list-scroll list-grid-desktop">
            @for (user of filteredUsers(); track user.id) {
              <article class="card relative text-sm leading-6">
                <div class="absolute right-3 top-2 flex gap-3 text-lg">
                  <a [routerLink]="['/usuarios', user.id, 'editar']" title="Editar">✎</a>
                  <button type="button" (click)="abrirConfirmacao(user)" title="Excluir">🗑</button>
                </div>
                <p><strong>ID:</strong> {{ user.id }}</p>
                <p><strong>Usuário:</strong> {{ user.nome }}</p>
                <p><strong>Perfil:</strong> {{ user.role.nome }}</p>
                <p><strong>Email:</strong> {{ user.email }}</p>
              </article>
            } @empty {
              <p class="rounded bg-gray-100 p-6 text-center text-sm text-gray-600">
                Nenhum usuário encontrado.
              </p>
            }
          </div>
        }

      </div>

      <app-confirm-dialog
        [open]="deleteOpen()"
        title="Deseja Excluir esse Usuário?"
        (cancel)="deleteOpen.set(false)"
        (confirm)="deletarSelecionado()"
      >
        @if (usuarioSelecionado(); as user) {
          <div class="card mt-6 text-sm">
            <p><strong>ID:</strong> {{ user.id }}</p>
            <p><strong>Usuário:</strong> {{ user.nome }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
          </div>
        }
      </app-confirm-dialog>

    </app-mobile-layout>
  `,
  styles: `
    :host { display: block; height: 100%; min-height: 0; }
    .users-list-content { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }
    .users-search { margin-bottom: 1.25rem; text-align: center; }
  `,
})
export class UsersListComponent implements OnInit {
  private readonly userService = inject(UserService);

  search = '';

  readonly loading            = signal(false);
  readonly erro               = signal('');
  readonly users              = signal<AppUser[]>([]);
  readonly deleteOpen         = signal(false);
  readonly usuarioSelecionado = signal<AppUser | null>(null);

  ngOnInit(): void {
    this.carregar();
  }

  filteredUsers(): AppUser[] {
    const term = this.search.toLowerCase().trim();
    if (!term) return this.users();
    return this.users().filter(
      u => u.nome.toLowerCase().includes(term) || u.email.toLowerCase().includes(term),
    );
  }

  abrirConfirmacao(user: AppUser): void {
    this.usuarioSelecionado.set(user);
    this.deleteOpen.set(true);
  }

  deletarSelecionado(): void {
    const user = this.usuarioSelecionado();
    if (!user) return;
    this.userService.deletar(user.id).subscribe({
      next: () => {
        this.users.update(list => list.filter(u => u.id !== user.id));
        this.deleteOpen.set(false);
      },
      error: () => { this.erro.set('Erro ao excluir usuário.'); this.deleteOpen.set(false); },
    });
  }

  private carregar(): void {
    this.loading.set(true);
    this.erro.set('');
    this.userService.listar().subscribe({
      next:  list => { this.users.set(list); this.loading.set(false); },
      error: ()   => { this.erro.set('Erro ao carregar usuários.'); this.loading.set(false); },
    });
  }
}
