import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OsService } from '../../core/os.service';
import { ServiceOrder } from '../../core/models';
import { MobileLayoutComponent } from '../../layout/mobile-layout.component';
import { OrderCardComponent } from '../../shared/order-card.component';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [FormsModule, MobileLayoutComponent, OrderCardComponent],
  template: `
    <app-mobile-layout>
      <div class="content-wide orders-list-content">

        <input class="input orders-search" [(ngModel)]="search"
               placeholder="Digite Número da OS ou Nome do Cliente*" />

        @if (loading()) {
          <p class="text-center text-sm text-gray-500 mt-8">Carregando OS…</p>
        }

        @if (erro()) {
          <p class="rounded bg-red-50 p-4 text-center text-sm text-red-700">{{ erro() }}</p>
        }

        @if (!loading()) {
          <div class="list-scroll list-grid-desktop">
            @for (order of filteredOrders(); track order.id) {
              <app-order-card [order]="order" />
            } @empty {
              <p class="rounded bg-gray-100 p-6 text-center text-sm text-gray-600">
                Nenhuma OS encontrada.
              </p>
            }
          </div>
        }

      </div>
    </app-mobile-layout>
  `,
  styles: `
    :host { display: block; height: 100%; min-height: 0; }
    .orders-list-content { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }
    .orders-search { margin-bottom: 1.25rem; text-align: center; }
  `,
})
export class OrdersListComponent implements OnInit {
  private readonly osService = inject(OsService);
  private readonly route     = inject(ActivatedRoute);

  search = '';

  readonly loading = signal(false);
  readonly erro    = signal('');
  readonly orders  = signal<ServiceOrder[]>([]);

  private readonly routeStatus =
    this.route.snapshot.data['status'] as string | undefined;

  readonly filteredOrders = computed(() => {
    const term = this.search.toLowerCase().trim();
    let list = this.orders();

    if (this.routeStatus) {
      list = list.filter(o => o.status === this.routeStatus);
    }

    if (!term) return list;

    return list.filter(
      o =>
        o.clienteNome.toLowerCase().includes(term) ||
        String(o.id).includes(term),
    );
  });

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.loading.set(true);
    this.erro.set('');
    this.osService.listar().subscribe({
      next:  os => { this.orders.set(os); this.loading.set(false); },
      error: ()  => { this.erro.set('Erro ao carregar OS. Tente novamente.'); this.loading.set(false); },
    });
  }
}
