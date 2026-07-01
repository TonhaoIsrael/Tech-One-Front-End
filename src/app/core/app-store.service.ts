import { computed, Injectable, signal } from '@angular/core';
import { AppUser, ServiceOrder, StatusOS } from './models';

@Injectable({ providedIn: 'root' })
export class AppStore {

  readonly orders = signal<ServiceOrder[]>([]);
  readonly users  = signal<AppUser[]>([]);

  readonly openOrders      = computed(() => this.orders().filter(o => o.status !== 'CONCLUIDO'));
  readonly completedOrders = computed(() => this.orders().filter(o => o.status === 'CONCLUIDO'));

  findOrder(id: number): ServiceOrder | undefined {
    return this.orders().find(o => o.id === id);
  }

  setOrderStatus(id: number, status: StatusOS): void {
    this.orders.update(list =>
      list.map(o => (o.id === id ? { ...o, status } : o)),
    );
  }

  deleteOrder(id: number): void {
    this.orders.update(list => list.filter(o => o.id !== id));
  }

  findUser(id: number): AppUser | undefined {
    return this.users().find(u => u.id === id);
  }

  deleteUser(id: number): void {
    this.users.update(list => list.filter(u => u.id !== id));
  }
}
