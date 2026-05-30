import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppStore } from '../../core/app-store.service';
import { MobileLayoutComponent } from '../../layout/mobile-layout.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [FormsModule, RouterLink, MobileLayoutComponent, ConfirmDialogComponent],
  template: `
    <app-mobile-layout>
      <div class="content-wide users-list-content">
        <input class="input users-search" [(ngModel)]="search" placeholder="Digite Email ou Nome *" />
        <div class="list-scroll list-grid-desktop">
          @for (user of filteredUsers(); track user.id) {
            <article class="card relative text-sm leading-6">
              <div class="absolute right-3 top-2 flex gap-3 text-lg">
                <a [routerLink]="['/usuarios', user.id, 'editar']" title="Editar">✎</a>
                <button type="button" (click)="selectedUserId.set(user.id); deleteOpen.set(true)" title="Excluir">🗑</button>
              </div>
              <p><strong>ID:</strong> {{ user.id }}</p>
              <p><strong>Usuário:</strong> {{ user.name }}</p>
              <p><strong>Tipo:</strong> {{ user.type }}</p>
              <p><strong>Email:</strong> {{ user.email }}</p>
            </article>
          } @empty {
            <p class="rounded bg-gray-100 p-6 text-center text-sm text-gray-600">Nenhum usuário encontrado.</p>
          }
        </div>
      </div>

      <app-confirm-dialog [open]="deleteOpen()" title="Deseja Excluir esse Usuário?" (cancel)="deleteOpen.set(false)" (confirm)="deleteSelected()">
        @if (selectedUser(); as user) {
          <div class="card mt-6 text-sm"><p><strong>ID:</strong> {{ user.id }}</p><p><strong>Usuário:</strong> {{ user.name }}</p><p><strong>Email:</strong> {{ user.email }}</p></div>
        }
      </app-confirm-dialog>
    </app-mobile-layout>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
      min-height: 0;
    }

    .users-list-content {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .users-search {
      margin-bottom: 1.25rem;
      text-align: center;
    }
  `
})
export class UsersListComponent {
  public readonly store = inject(AppStore);
  search = '';
  readonly deleteOpen = signal(false);
  readonly selectedUserId = signal<number | null>(null);
  selectedUser = () => this.store.users().find(user => user.id === this.selectedUserId());


  filteredUsers() {
    const term = this.search.toLowerCase().trim();
    if (!term) return this.store.users();
    return this.store.users().filter(user => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term));
  }

  deleteSelected(): void {
    const id = this.selectedUserId();
    if (id) this.store.deleteUser(id);
    this.deleteOpen.set(false);
  }
}
