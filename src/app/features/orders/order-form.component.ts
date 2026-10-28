import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OsService } from '../../core/os.service';
import { UserService } from '../../core/user.service';
import { Prioridade, StatusOS, AppUser, Cliente } from '../../core/models';
import { MobileLayoutComponent } from '../../layout/mobile-layout.component';

const API = 'https://tech-on-api.onrender.com/api';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MobileLayoutComponent],
  template: `
    <app-mobile-layout>
      <!-- Container principal estruturado para fixar a tela e conter o scroll interno -->
      <div class="content-medium flex h-[calc(100vh-80px)] flex-col px-2 py-2">
        <h1 class="mb-4 text-center text-2xl font-bold shrink-0">
          {{ id ? 'Editar OS' : 'Nova OS' }}
        </h1>

        @if (erro()) {
          <p class="mb-3 rounded bg-red-50 p-3 text-sm text-red-700 shrink-0">{{ erro() }}</p>
        }

        @if (carregando()) {
          <p class="mb-3 text-center text-sm text-gray-500 shrink-0">Carregando dados…</p>
        }

        <!-- Área com rolagem forçada e visível -->
        <div class="flex-1 overflow-y-auto pr-2 pb-6">
          <form id="orderForm" class="flex flex-col space-y-4" (ngSubmit)="salvar()">
            <label class="label">Cliente</label>
            <select class="input" name="clienteId" [(ngModel)]="clienteId" required>
              <option [ngValue]="undefined">Selecione o cliente</option>
              @for (c of clientes(); track c.id) {
                <option [ngValue]="c.id">{{ c.nome }}</option>
              }
            </select>

            <label class="label">Título</label>
            <input
              class="input"
              name="titulo"
              [(ngModel)]="titulo"
              placeholder="Título da OS"
              required
            />

            <label class="label">Descrição</label>
            <textarea
              class="input min-h-24"
              name="descricao"
              [(ngModel)]="descricao"
              placeholder="Descrição"
            ></textarea>

            <label class="label">Prioridade</label>
            <select class="input" name="prioridade" [(ngModel)]="prioridade">
              <option value="BAIXA">Baixa🟢</option>
              <option value="MEDIA">Média🟡</option>
              <option value="ALTA">Alta🟠</option>
              <option value="URGENTE">Urgente🔴</option>
            </select>

            <label class="label">Status</label>
            <select class="input" name="status" [(ngModel)]="status">
              <option value="ABERTO">Aberto</option>
              <option value="EM_ANDAMENTO">Em andamento</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="CANCELADO">Cancelado</option>
            </select>

            <label class="label">Técnico (opcional)</label>
            <select class="input" name="tecnicoId" [(ngModel)]="tecnicoId">
              <option [ngValue]="undefined">Sem técnico</option>
              @for (t of tecnicos(); track t.id) {
                <option [ngValue]="t.id">{{ t.nome }}</option>
              }
            </select>

            <label class="label">Data agendada</label>
            <input
              class="input"
              name="dataAgendada"
              [(ngModel)]="dataAgendada"
              type="datetime-local"
            />
          </form>
        </div>

        <!-- Botões fixos na parte inferior para nunca sumirem -->
        <div class="action-bar mt-2 pt-2 border-t border-gray-100 flex gap-3 shrink-0 bg-white">
          <a routerLink="/ordens" class="btn btn-danger flex-1 text-center py-2">Cancelar</a>
          <button
            class="btn btn-primary flex-1 py-2"
            type="submit"
            form="orderForm"
            [disabled]="loading() || carregando()"
          >
            @if (loading()) { Salvando… } @else { Confirmar }
          </button>
        </div>
      </div>
    </app-mobile-layout>
  `,
})
export class OrderFormComponent implements OnInit {
  private readonly osService   = inject(OsService);
  private readonly userService = inject(UserService);
  private readonly http        = inject(HttpClient);
  private readonly route       = inject(ActivatedRoute);
  private readonly router      = inject(Router);

  readonly id = Number(this.route.snapshot.paramMap.get('id')) || undefined;

  titulo        = '';
  descricao     = '';
  prioridade:  Prioridade = 'MEDIA';
  status:      StatusOS   = 'ABERTO';
  clienteId?:  number;
  tecnicoId?:  number;
  dataAgendada = '';

  readonly loading    = signal(false);
  readonly carregando = signal(true);
  readonly erro       = signal('');
  readonly clientes   = signal<Cliente[]>([]);
  readonly tecnicos   = signal<AppUser[]>([]);

  ngOnInit(): void {
    let clientesOk = false;
    let tecnicosOk = false;

    const verificarFim = () => {
      if (clientesOk && tecnicosOk) this.carregando.set(false);
    };

    // ── Carrega clientes ──────────────────────────────────────────
    this.http.get<Cliente[]>(`${API}/clientes`).subscribe({
      next: list => {
        this.clientes.set(list);
        clientesOk = true;
        verificarFim();
      },
      error: err => {
        this.erro.set(`Erro ao carregar clientes (${err.status}).`);
        clientesOk = true;
        verificarFim();
      },
    });

    // ── Carrega técnicos ─────────────────────────────────────────
    this.userService.listar().subscribe({
      next: list => {
        const tecs = list.filter(u =>
            u.role?.toString().toLowerCase() === 'tecnico'
        );
        this.tecnicos.set(tecs);
        tecnicosOk = true;
        verificarFim();
      },
      error: () => {
        tecnicosOk = true;
        verificarFim();
      },
    });

    // ── Modo edição ───────────────────────────────────────────────
    if (this.id) {
      this.osService.buscar(this.id).subscribe({
        next: os => {
          this.titulo       = os.titulo;
          this.descricao    = os.descricao;
          this.prioridade   = os.prioridade;
          this.status       = os.status;
          this.clienteId    = os.clienteId;
          this.tecnicoId    = os.tecnicoId ?? undefined;
          this.dataAgendada = os.dataAgendada ?? '';
        },
        error: () => this.erro.set('Não foi possível carregar a OS.'),
      });
    }
  }

  salvar(): void {
    if (!this.clienteId || !this.titulo) {
      this.erro.set('Cliente e título são obrigatórios.');
      return;
    }

    this.loading.set(true);
    this.erro.set('');

    const body = {
      titulo:       this.titulo,
      descricao:    this.descricao,
      clienteId:    this.clienteId,
      tecnicoId:    this.tecnicoId,
      prioridade:   this.prioridade,
      status:       this.status,
      dataAgendada: this.dataAgendada || undefined,
    };

    const req$ = this.id
        ? this.osService.atualizar(this.id, body)
        : this.osService.criar(body);

    req$.subscribe({
      next:  () => this.router.navigateByUrl('/ordens'),
      error: err => {
        this.erro.set(`Erro ao salvar OS (${err.status}).`);
        this.loading.set(false);
      },
    });
  }
}