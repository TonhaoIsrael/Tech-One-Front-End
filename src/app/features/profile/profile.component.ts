
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { OsService } from '../../core/os.service';
import { ServiceOrder } from '../../core/models';
import { MobileLayoutComponent } from '../../layout/mobile-layout.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MobileLayoutComponent, RouterLink, FormsModule, DatePipe],
  styles: [`
    .dash-scroll {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      padding-bottom: 2rem;
      scrollbar-width: thin;
    }
    .bar-chart {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      height: 160px;
      padding: 0 4px;
    }
    .bar-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      height: 100%;
      justify-content: flex-end;
      gap: 3px;
    }
    .bar-value { font-size: 10px; font-weight: 600; color: #374151; }
    .bar-col {
      width: 100%;
      border-radius: 6px 6px 0 0;
      min-height: 4px;
      transition: height 0.6s cubic-bezier(.4,0,.2,1);
    }
    .bar-label {
      font-size: 9px;
      color: #6b7280;
      text-align: center;
      margin-top: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .chart-legend {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: #374151;
    }
    .legend-dot { width: 10px; height: 10px; border-radius: 3px; }
  `],
  template: `
    <app-mobile-layout [showLogout]="true">

      <!-- scroll interno cobrindo toda a área -->
      <div class="dash-scroll">

        <!-- ── Card do usuário — só nome, email e perfil ── -->
        <div class="card mb-4 flex items-center gap-3">
          
          <div class="min-w-0">
            <p class="font-bold text-gray-900 text-sm truncate">{{ user()?.nome }}</p>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 inline-block"
                  [class]="isAdmin() ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'">
              {{ user()?.role }}
            </span>
          </div>
        </div>

        <!-- ── Menu ── -->
        <nav class="grid grid-cols-3 gap-2 mb-4 mt-4">
          <a routerLink="/ordens"           class="btn btn-primary text-xs py-2">Lista de OS</a>
          <a routerLink="/ordens/abertas"   class="btn btn-primary text-xs py-2">OS Abertas</a>
          <a routerLink="/ordens/historico" class="btn btn-primary text-xs py-2">Histórico</a>
          @if (isAdmin()) {
            <a routerLink="/ordens/nova"   class="btn btn-primary text-xs py-2">Adicionar OS</a>
            <a routerLink="/usuarios"      class="btn btn-primary text-xs py-2">Usuários</a>
            <a routerLink="/usuarios/novo" class="btn btn-primary text-xs py-2">Add Usuário</a>
            
          }
        </nav>

        <!-- ── Dashboard ── -->
        <div class="card">

          <!-- Filtros lado a lado -->
          <div class="flex flex-wrap gap-2 mb-3">
            <select class="input !min-h-0 !mb-0 flex-1 px-3 py-2 text-sm"
                    [(ngModel)]="periodoSelecionado"
                    (ngModelChange)="aplicarFiltro()">
              <option value="7">Últimos 7 dias</option>
              <option value="30">Último mês</option>
              <option value="90">Últimos 3 meses</option>
              <option value="365">Último ano</option>
            </select>

            <select class="input !min-h-0 !mb-0 flex-1 px-3 py-2 text-sm"
                    [(ngModel)]="tipoGrafico"
                    (ngModelChange)="onTipoGraficoChange()">
              <option value="status">Por Status</option>
              @if (isAdmin()) {
                <option value="tecnico">Por Técnico</option>
              }
              <option value="prioridade">Por Prioridade</option>
            </select>
          </div>

          <!-- Select de técnico -->
          @if (tipoGrafico === 'tecnico' && isAdmin()) {
            <div class="mb-3 rounded-xl bg-blue-50 p-3">
              <label class="text-xs font-semibold text-blue-700 mb-1 block">
                Selecione o Técnico
              </label>
              <select class="input !min-h-0 !mb-0 text-sm"
                      [(ngModel)]="tecnicoSelecionado"
                      (ngModelChange)="onTecnicoChange()">
                <option value="todos">Todos os Técnicos</option>
                @for (t of listaTecnicos(); track t) {
                  <option [value]="t">{{ t }}</option>
                }
              </select>
            </div>
          }

          @if (carregando()) {
            <p class="text-center text-sm text-gray-500 py-6">Carregando dados…</p>
          }

          @if (!carregando()) {

            <!-- Métricas -->
            <div class="grid grid-cols-3 gap-2 mb-4">
              <div class="rounded-xl bg-blue-50 p-2 text-center">
                <p class="text-xl font-bold text-blue-700">{{ totalOS() }}</p>
                <p class="text-xs text-blue-500">Total</p>
              </div>
              <div class="rounded-xl bg-yellow-50 p-2 text-center">
                <p class="text-xl font-bold text-yellow-700">{{ osAbertas() }}</p>
                <p class="text-xs text-yellow-500">Em aberto</p>
              </div>
              <div class="rounded-xl bg-green-50 p-2 text-center">
                <p class="text-xl font-bold text-green-700">{{ osConcluidas() }}</p>
                <p class="text-xs text-green-500">Concluídas</p>
              </div>
            </div>

            <!-- Gráfico de colunas -->
            <div class="rounded-xl bg-gray-50 p-3">
              <p class="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                {{ tituloGrafico() }}
              </p>

              @if (dadosGrafico().length > 0) {
                <div class="bar-chart">
                  @for (item of dadosGrafico(); track item.label) {
                    <div class="bar-group">
                      <span class="bar-value">{{ item.valor }}</span>
                      <div class="bar-col"
                           [style.height]="item.pct + '%'"
                           [style.background]="item.cor"
                           [title]="item.label + ': ' + item.valor + ' OS'">
                      </div>
                      <span class="bar-label">{{ item.label }}</span>
                    </div>
                  }
                </div>
                <div class="chart-legend">
                  @for (item of dadosGrafico(); track item.label) {
                    <div class="legend-item">
                      <div class="legend-dot" [style.background]="item.cor"></div>
                      {{ item.label }}: {{ item.valor }}
                    </div>
                  }
                </div>
              } @else {
                <p class="text-center text-sm text-gray-400 py-6">
                  Nenhuma OS no período.
                </p>
              }
            </div>

            <!-- OS de hoje (só TÉCNICO) -->
            @if (!isAdmin()) {
              <div class="mt-4">
                <h3 class="text-sm font-semibold text-gray-700 mb-2">Minhas OS de Hoje</h3>
                @for (os of osHoje(); track os.id) {
                  <a [routerLink]="['/ordens', os.id]"
                     class="block card mb-2 text-sm">
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="font-bold text-gray-900">#{{ os.id }} — {{ os.titulo }}</p>
                        <p class="text-gray-500 text-xs">{{ os.clienteNome }}</p>
                      </div>
                      <span class="text-xs font-semibold px-2 py-0.5 rounded-full"
                            [class]="statusClass(os.status)">
                        {{ os.status }}
                      </span>
                    </div>
                    @if (os.dataAgendada) {
                      <p class="text-xs text-gray-400 mt-1">
                        📅 {{ os.dataAgendada | date:'HH:mm' }}
                      </p>
                    }
                  </a>
                } @empty {
                  <p class="text-sm text-gray-400 text-center py-3">
                    Nenhuma OS para hoje.
                  </p>
                }
              </div>
            }

          }
        </div>

      </div>
    </app-mobile-layout>
  `,
})
export class ProfileComponent implements OnInit {
  private readonly auth      = inject(AuthService);
  private readonly osService = inject(OsService);

  readonly isAdmin = this.auth.isAdmin;
  readonly user    = this.auth.user;

  readonly carregando  = signal(true);
  readonly todasOS     = signal<ServiceOrder[]>([]);
  readonly osFiltradas = signal<ServiceOrder[]>([]);
  readonly osHoje      = signal<ServiceOrder[]>([]);

  periodoSelecionado = '30';
  tipoGrafico        = 'status';
  tecnicoSelecionado = 'todos';

  readonly listaTecnicos = computed(() => {
    const nomes = this.todasOS()
      .map(o => o.tecnicoNome)
      .filter((n): n is string => !!n);
    return [...new Set(nomes)].sort();
  });

  readonly osParaGrafico = computed(() => {
    const os = this.osFiltradas();
    if (this.tipoGrafico !== 'tecnico' || this.tecnicoSelecionado === 'todos') return os;
    return os.filter(o => o.tecnicoNome === this.tecnicoSelecionado);
  });

  readonly totalOS      = computed(() => this.osFiltradas().length);
  readonly osAbertas    = computed(() => this.osFiltradas().filter(o => o.status === 'ABERTO' || o.status === 'EM_ANDAMENTO').length);
  readonly osConcluidas = computed(() => this.osFiltradas().filter(o => o.status === 'CONCLUIDO').length);

  readonly iniciais = computed(() =>
    (this.user()?.nome ?? '').split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()
  );

  readonly tituloGrafico = computed(() => {
    if (this.tipoGrafico === 'status')     return 'Por Status';
    if (this.tipoGrafico === 'prioridade') return 'Por Prioridade';
    if (this.tipoGrafico === 'tecnico') {
      return this.tecnicoSelecionado === 'todos'
        ? 'OS por Técnico — Todos'
        : `OS de ${this.tecnicoSelecionado} por Status`;
    }
    return '';
  });

  readonly dadosGrafico = computed(() => {
    const os = this.osParaGrafico();

    if (this.tipoGrafico === 'status' ||
       (this.tipoGrafico === 'tecnico' && this.tecnicoSelecionado !== 'todos')) {
      const itens = [
        { label: 'Aberto',       valor: os.filter(o => o.status === 'ABERTO').length,       cor: '#60A5FA' },
        { label: 'Em andamento', valor: os.filter(o => o.status === 'EM_ANDAMENTO').length, cor: '#FBBF24' },
        { label: 'Concluído',    valor: os.filter(o => o.status === 'CONCLUIDO').length,    cor: '#34D399' },
        { label: 'Cancelado',    valor: os.filter(o => o.status === 'CANCELADO').length,    cor: '#F87171' },
      ];
      const max = Math.max(...itens.map(i => i.valor), 1);
      return itens.map(i => ({ ...i, pct: Math.round((i.valor / max) * 100) }));
    }

    if (this.tipoGrafico === 'tecnico' && this.tecnicoSelecionado === 'todos') {
      const map: Record<string, number> = {};
      os.forEach(o => {
        const nome = o.tecnicoNome ?? 'Sem técnico';
        map[nome] = (map[nome] || 0) + 1;
      });
      const cores = ['#6366F1','#0D9488','#F59E0B','#EF4444','#8B5CF6','#EC4899','#14B8A6','#F97316'];
      const max   = Math.max(...Object.values(map), 1);
      return Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .map(([label, valor], i) => ({
          label: label.split(' ')[0],
          valor,
          cor: cores[i % cores.length],
          pct: Math.round((valor / max) * 100),
        }));
    }

    if (this.tipoGrafico === 'prioridade') {
      const itens = [
        { label: 'Baixa',   valor: os.filter(o => o.prioridade === 'BAIXA').length,   cor: '#6EE7B7' },
        { label: 'Média',   valor: os.filter(o => o.prioridade === 'MEDIA').length,   cor: '#60A5FA' },
        { label: 'Alta',    valor: os.filter(o => o.prioridade === 'ALTA').length,    cor: '#FBBF24' },
        { label: 'Urgente', valor: os.filter(o => o.prioridade === 'URGENTE').length, cor: '#F87171' },
      ];
      const max = Math.max(...itens.map(i => i.valor), 1);
      return itens.map(i => ({ ...i, pct: Math.round((i.valor / max) * 100) }));
    }

    return [];
  });

  ngOnInit(): void {
    this.osService.listar().subscribe({
      next: list => {
        this.todasOS.set(list);
        this.aplicarFiltro();
        if (!this.isAdmin()) this.carregarHoje();
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  aplicarFiltro(): void {
    const dias  = Number(this.periodoSelecionado);
    const corte = new Date();
    corte.setDate(corte.getDate() - dias);
    this.osFiltradas.set(
      this.todasOS().filter(o => new Date(o.criadoEm) >= corte)
    );
  }

  onTipoGraficoChange(): void {
    this.tecnicoSelecionado = 'todos';
  }

  onTecnicoChange(): void {}

  private carregarHoje(): void {
    this.osService.listarHoje().subscribe({
      next: list => this.osHoje.set(list),
    });
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      ABERTO:       'bg-blue-100 text-blue-700',
      EM_ANDAMENTO: 'bg-yellow-100 text-yellow-700',
      CONCLUIDO:    'bg-green-100 text-green-700',
      CANCELADO:    'bg-red-100 text-red-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-700';
  }
}