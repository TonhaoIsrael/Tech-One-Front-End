import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppStore } from '../../core/app-store.service';
import { MobileLayoutComponent } from '../../layout/mobile-layout.component';
import { OrderCardComponent } from '../../shared/order-card.component';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [FormsModule, MobileLayoutComponent, OrderCardComponent],
  template: `
    <app-mobile-layout>
      <div class="content-wide orders-list-content">
        <input class="input orders-search" [(ngModel)]="search" placeholder="Digite Número da OS ou Nome do Cliente*" />

        <div class="list-scroll list-grid-desktop">
          @for (order of filteredOrders(); track order.id) {
            <app-order-card [order]="order" />
          } @empty {
            <p class="rounded bg-gray-100 p-6 text-center text-sm text-gray-600">Nenhuma OS encontrada.</p>
          }
        </div>
      </div>
    </app-mobile-layout>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
      min-height: 0;
    }

    .orders-list-content {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .orders-search {
      margin-bottom: 1.25rem;
      text-align: center;
    }
  `
})
export class OrdersListComponent {
  private readonly store = inject(AppStore);
  private readonly route = inject(ActivatedRoute);
  search = '';
  private readonly routeStatus = this.route.snapshot.data['status'] as string | undefined;
  private readonly allOrders = computed(() => {
    const orders = this.store.orders();
    if (!this.routeStatus) return orders;
    return orders.filter(order => order.status === this.routeStatus);
  });

  filteredOrders() {
    const term = this.search.toLowerCase().trim();
    if (!term) return this.allOrders();
    return this.allOrders().filter(order => order.client.toLowerCase().includes(term) || String(order.id).includes(term));
  }

}
