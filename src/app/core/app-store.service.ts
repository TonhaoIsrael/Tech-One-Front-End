import { computed, Injectable, signal } from '@angular/core';
import { AppUser, OrderStatus, ServiceOrder, Technician } from './models';

@Injectable({ providedIn: 'root' })
export class AppStore {
  readonly technicians = signal<Technician[]>([
    { id: 1, name: 'Tecnico 1' },
    { id: 2, name: 'Tecnico 2' }
  ]);

  readonly orders = signal<ServiceOrder[]>([
    {
      id: 30021,
      client: 'Israel Jesus',
      type: 'INSTALAÇÃO',
      status: 'PENDENTE',
      address: 'R. Gonçalves Chaves, 602, Centro, Pelotas - RS, 96015-560',
      plan: '400 mb Fibra Óptica',
      date: '2025-10-02',
      time: '10:00 ~ 12:00',
      description: 'Cliente informou que chega depois das 10 hrs.',
      technicianId: 1
    },
    {
      id: 30022,
      client: 'Israel Jesus',
      type: 'INSTALAÇÃO',
      status: 'PENDENTE',
      address: 'R. Gonçalves Chaves, 602, Centro, Pelotas - RS, 96015-560',
      plan: '400 mb Fibra Óptica',
      date: '2025-10-02',
      time: '10:00 ~ 12:00',
      description: 'Cliente informou que chega depois das 10 hrs.',
      technicianId: 1
    },
    ...Array.from({ length: 9 }, (_, index) => ({
      id: 30023 + index,
      client: 'Israel Jesus',
      type: 'MANUTENÇÃO' as const,
      status: 'CONCLUIDA' as const,
      address: 'R. Gonçalves Chaves, 602, Centro, Pelotas - RS, 96015-560',
      plan: '400 mb Fibra Óptica',
      date: '2025-10-02',
      time: '10:00 ~ 12:00',
      description: 'Cliente informou que chega depois das 10 hrs.',
      technicianId: 2
    })),
  ]);

  readonly users = signal<AppUser[]>([
    { id: 671, name: 'Israel Jesus', type: 'Tecnico', email: 'tec1@example.com', login: 'israel1' },
    { id: 672, name: 'Maria Souza', type: 'Administrador', email: 'admin@example.com', login: 'admin' },
    { id: 673, name: 'João Lima', type: 'Usuario', email: 'joao@example.com', login: 'joao' }
  ]);

  readonly openOrders = computed(() => this.orders().filter(order => order.status !== 'CONCLUIDA'));
  readonly completedOrders = computed(() => this.orders().filter(order => order.status === 'CONCLUIDA'));

  findOrder(id: number): ServiceOrder | undefined {
    return this.orders().find(order => order.id === id);
  }

  findUser(id: number): AppUser | undefined {
    return this.users().find(user => user.id === id);
  }

  technicianName(id?: number): string {
    return this.technicians().find(t => t.id === id)?.name ?? 'Sem técnico';
  }

  setOrderStatus(id: number, status: OrderStatus, notes?: string): void {
    this.orders.update(orders => orders.map(order => order.id === id ? { ...order, status, technicianNotes: notes ?? order.technicianNotes } : order));
  }

  deleteOrder(id: number): void {
    this.orders.update(orders => orders.filter(order => order.id !== id));
  }

  deleteUser(id: number): void {
    this.users.update(users => users.filter(user => user.id !== id));
  }
}
