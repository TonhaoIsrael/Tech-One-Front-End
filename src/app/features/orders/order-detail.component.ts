import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OsService } from '../../core/os.service';
import { UserService } from '../../core/user.service';
import { AuthService } from '../../core/auth.service';
import { ServiceOrder, AppUser, StatusOS } from '../../core/models';
import { MobileLayoutComponent } from '../../layout/mobile-layout.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, MobileLayoutComponent, ConfirmDialogComponent, DatePipe],
  template: `
    <app-mobile-layout>

      @if (loading()) {
        <p class="mt-8 text-center text-sm text-gray-500">Carregando OS…</p>
      }

      @if (erro()) {
        <p class="rounded bg-red-50 p-4 text-center text-sm text-red-700">{{ erro() }}</p>
      }

      @if (os(); as order) {

        <article class="card text-sm leading-7 text-gray-900">
          <p><strong>OS:</strong> #{{ order.id }}</p>
          <p><strong>Título:</strong> {{ order.titulo }}</p>
          <p><strong>Descrição:</strong> {{ order.descricao }}</p>
          <p><strong>Cliente:</strong> {{ order.clienteNome }}</p>
          <p><strong>Técnico:</strong> {{ order.tecnicoNome ?? 'Sem técnico' }}</p>
          <p><strong>Prioridade:</strong> {{ order.prioridade }}</p>
          <p><strong>Status:</strong>
            <span [class]="statusClass(order.status)">{{ order.status }}</span>
          </p>
          <p><strong>Criado em:</strong> {{ order.criadoEm | date:'dd/MM/yyyy HH:mm' }}</p>
          @if (order.agendada && order.dataAgendada) {
            <p><strong>Agendado para:</strong> {{ order.dataAgendada | date:'dd/MM/yyyy HH:mm' }}</p>
          }
        </article>

        <!-- OS ABERTA -->
        @if (order.status === 'ABERTO') {
          <div class="mt-8 grid gap-3">
            @if (isAdmin()) {
              <button class="btn btn-primary" type="button"
                      (click)="chooseTechnician.set(true)">
                Escolher Técnico
              </button>
              <a class="btn btn-primary" [routerLink]="['/ordens', order.id, 'editar']">
                Editar OS
              </a>
              <button class="btn btn-danger" type="button"
                      (click)="deleteOpen.set(true)">
                Excluir OS
              </button>
            }
            <button class="btn btn-primary mt-2" type="button"
                    (click)="iniciarOS(order.id)" [disabled]="salvando()">
              @if (salvando()) { Iniciando… } @else { Iniciar OS }
            </button>
          </div>
        }

        <!-- OS EM ANDAMENTO -->
        @if (order.status === 'EM_ANDAMENTO') {
          <form class="mt-8 space-y-4" (ngSubmit)="encerrarOS(order.id)">
            <label class="label">Observações</label>
            <textarea class="input min-h-28" name="notes"
                      [(ngModel)]="notes" placeholder="Descreva o que foi feito…"></textarea>
            <label class="label">Encerrar como</label>
            <select class="input" name="novoStatus" [(ngModel)]="novoStatus">
              <option value="CONCLUIDO">Concluído</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
            <button class="btn btn-danger-dark w-full" type="submit" [disabled]="salvando()">
              @if (salvando()) { Encerrando… } @else { Encerrar OS }
            </button>
          </form>
        }

        <!-- OS CONCLUÍDA -->
        @if (order.status === 'CONCLUIDO') {
          <p class="mt-8 rounded bg-green-50 p-4 text-center text-sm font-semibold text-green-800">
            ✓ OS concluída.
          </p>
        }

        <!-- OS CANCELADA -->
        @if (order.status === 'CANCELADO') {
          <p class="mt-8 rounded bg-red-50 p-4 text-center text-sm font-semibold text-red-800">
            ✗ OS cancelada.
          </p>
        }

        <app-confirm-dialog
          [open]="deleteOpen()"
          title="Deseja excluir essa OS?"
          (cancel)="deleteOpen.set(false)"
          (confirm)="excluirOS(order.id)"
        />

        @if (chooseTechnician()) {
          <div class="absolute inset-x-0 top-14 z-10 bg-white px-5 py-6 shadow-xl">
            <div class="mb-6 flex items-center justify-between">
              <h2 class="text-lg font-semibold">Selecione o Técnico</h2>
              <button type="button" class="text-xl" (click)="chooseTechnician.set(false)">×</button>
            </div>
            <select class="input" [(ngModel)]="tecnicoSelecionado" name="tecnico">
              <option [ngValue]="undefined">Selecione</option>
              @for (t of tecnicos(); track t.id) {
                <option [ngValue]="t.id">{{ t.nome }}</option>
              }
            </select>
            <button class="btn btn-primary mt-6 w-full" type="button"
                    [disabled]="!tecnicoSelecionado || salvando()"
                    (click)="atribuirTecnico(order.id)">
              @if (salvando()) { Salvando… } @else { Confirmar Técnico }
            </button>
          </div>
        }

      } @else if (!loading()) {
        <p class="rounded bg-gray-100 p-6 text-center">OS não encontrada.</p>
      }

    </app-mobile-layout>
  `,
})
export class OrderDetailComponent implements OnInit {
  private readonly osService   = inject(OsService);
  private readonly userService = inject(UserService);
  private readonly auth        = inject(AuthService);
  private readonly route       = inject(ActivatedRoute);
  private readonly router      = inject(Router);

  readonly id      = Number(this.route.snapshot.paramMap.get('id'));
  readonly isAdmin = this.auth.isAdmin;

  readonly loading          = signal(false);
  readonly salvando         = signal(false);
  readonly erro             = signal('');
  readonly os               = signal<ServiceOrder | null>(null);
  readonly deleteOpen       = signal(false);
  readonly chooseTechnician = signal(false);
  readonly tecnicos         = signal<AppUser[]>([]);

  notes              = '';
  novoStatus: StatusOS = 'CONCLUIDO';
  tecnicoSelecionado?: number;

  ngOnInit(): void {
    this.carregarOS();
    // role agora é string: 'Tecnico' ou 'ADMIN'
    this.userService.listar().subscribe({
      next: list => this.tecnicos.set(
        list.filter(u => u.role?.toString().toLowerCase() === 'tecnico')
      ),
    });
  }

  iniciarOS(id: number): void {
    this.salvando.set(true);
    this.osService.atualizar(id, { status: 'EM_ANDAMENTO' }).subscribe({
      next:  os => { this.os.set(os); this.salvando.set(false); },
      error: ()  => { this.erro.set('Erro ao iniciar OS.'); this.salvando.set(false); },
    });
  }

  encerrarOS(id: number): void {
    this.salvando.set(true);
    this.osService.atualizar(id, {
      status:    this.novoStatus,
      descricao: this.notes || undefined,
    }).subscribe({
      next:  os => { this.os.set(os); this.salvando.set(false); },
      error: ()  => { this.erro.set('Erro ao encerrar OS.'); this.salvando.set(false); },
    });
  }

  excluirOS(_id: number): void {
    this.deleteOpen.set(false);
    this.router.navigateByUrl('/ordens');
  }

  atribuirTecnico(osId: number): void {
    if (!this.tecnicoSelecionado) return;
    this.salvando.set(true);
    this.osService.atribuirTecnico(osId, this.tecnicoSelecionado).subscribe({
      next: os => { this.os.set(os); this.chooseTechnician.set(false); this.salvando.set(false); },
      error: () => { this.erro.set('Erro ao atribuir técnico.'); this.salvando.set(false); },
    });
  }

  statusClass(status: StatusOS): string {
    const map: Record<StatusOS, string> = {
      ABERTO:       'font-bold text-blue-700',
      EM_ANDAMENTO: 'font-bold text-yellow-700',
      CONCLUIDO:    'font-bold text-green-700',
      CANCELADO:    'font-bold text-red-700',
    };
    return map[status];
  }

  private carregarOS(): void {
    this.loading.set(true);
    this.osService.buscar(this.id).subscribe({
      next:  os => { this.os.set(os); this.loading.set(false); },
      error: ()  => { this.erro.set('Erro ao carregar OS.'); this.loading.set(false); },
    });
  }
}

