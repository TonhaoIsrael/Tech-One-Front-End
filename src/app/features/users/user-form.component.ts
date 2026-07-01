import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/user.service';
import { Role } from '../../core/models';
import { MobileLayoutComponent } from '../../layout/mobile-layout.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MobileLayoutComponent],
  template: `
    <app-mobile-layout>
      <div class="content-medium flex min-h-0 flex-1 flex-col">
        <h1 class="mb-8 text-center text-2xl font-bold tracking-widest">
          {{ id ? 'Editar Usuário' : 'Adicionar Usuário' }}
        </h1>

        @if (erro()) {
          <p class="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{{ erro() }}</p>
        }

        <form class="flex min-h-0 flex-1 flex-col space-y-4" (ngSubmit)="salvar()">

          <label class="label">Nome</label>
          <input class="input" name="nome" [(ngModel)]="nome"
                 placeholder="Nome completo" required />

          <label class="label">Email</label>
          <input class="input" name="email" [(ngModel)]="email"
                 placeholder="email@exemplo.com" type="email" required />

          @if (!id) {
            <label class="label">Senha</label>
            <input class="input" name="senha" [(ngModel)]="senha"
                   placeholder="Senha" type="password" required />
            <label class="label">Confirmar Senha</label>
            <input class="input" name="confirmarSenha" [(ngModel)]="confirmarSenha"
                   placeholder="Confirmar Senha" type="password" required />
          }

          @if (id) {
            <label class="label">Nova Senha (deixe em branco para manter)</label>
            <input class="input" name="senha" [(ngModel)]="senha"
                   placeholder="Nova senha" type="password" />
          }

          <label class="label">Perfil</label>
          <select class="input" name="roleId" [(ngModel)]="roleId" required>
            <option [ngValue]="undefined">Selecione o perfil</option>
            @for (r of roles(); track r.id) {
              <option [ngValue]="r.id">{{ r.nome }}</option>
            }
          </select>

          <div class="action-bar">
            <a routerLink="/usuarios" class="btn btn-danger">Cancelar</a>
            <button class="btn btn-primary" type="submit" [disabled]="loading()">
              @if (loading()) { Salvando… } @else { Confirmar }
            </button>
          </div>

        </form>
      </div>
    </app-mobile-layout>
  `,
})
export class UserFormComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route       = inject(ActivatedRoute);
  private readonly router      = inject(Router);

  readonly id = Number(this.route.snapshot.paramMap.get('id')) || undefined;

  nome           = '';
  email          = '';
  senha          = '';
  confirmarSenha = '';
  roleId?: number;

  readonly loading = signal(false);
  readonly erro    = signal('');
  readonly roles   = signal<Role[]>([]);

  ngOnInit(): void {
    this.userService.listarRoles().subscribe({
      next: list => this.roles.set(list),
    });

    if (this.id) {
      this.userService.buscar(this.id).subscribe({
        next: user => {
          this.nome   = user.nome;
          this.email  = user.email;
          this.roleId = user.role.id;
        },
        error: () => this.erro.set('Não foi possível carregar o usuário.'),
      });
    }
  }

  salvar(): void {
    if (!this.id && this.senha !== this.confirmarSenha) {
      this.erro.set('As senhas não coincidem.');
      return;
    }
    if (!this.roleId) {
      this.erro.set('Selecione um perfil.');
      return;
    }

    this.loading.set(true);
    this.erro.set('');

    if (this.id) {
      const body = {
        nome:   this.nome,
        email:  this.email,
        roleId: this.roleId,
        ...(this.senha ? { senha: this.senha } : {}),
      };
      this.userService.atualizar(this.id, body).subscribe({
        next:  () => this.router.navigateByUrl('/usuarios'),
        error: () => { this.erro.set('Erro ao atualizar usuário.'); this.loading.set(false); },
      });
    } else {
      this.userService
        .criar({ nome: this.nome, email: this.email, senha: this.senha, roleId: this.roleId })
        .subscribe({
          next:  () => this.router.navigateByUrl('/usuarios'),
          error: () => { this.erro.set('Erro ao criar usuário.'); this.loading.set(false); },
        });
    }
  }
}
