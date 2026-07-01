import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceOrder } from '../core/models';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="card text-[13px] leading-5 text-gray-900">
      <a [routerLink]="['/ordens', order().id]" class="block">
        <p><strong>OS:</strong> #{{ order().id }}</p>
        <p><strong>Cliente:</strong> {{ order().clienteNome }}</p>
        <p><strong>Título:</strong> {{ order().titulo }}</p>
        <p><strong>Status:</strong>
          <span [class]="statusClass()">{{ order().status }}</span>
        </p>
        <p><strong>Prioridade:</strong> {{ order().prioridade }}</p>
        @if (order().tecnicoNome) {
          <p><strong>Técnico:</strong> {{ order().tecnicoNome }}</p>
        }
      </a>
    </article>
  `,
})
export class OrderCardComponent {
  readonly order = input.required<ServiceOrder>();

  statusClass(): string {
    const map: Record<string, string> = {
      ABERTO:       'font-bold text-blue-700',
      EM_ANDAMENTO: 'font-bold text-yellow-700',
      CONCLUIDO:    'font-bold text-green-700',
      CANCELADO:    'font-bold text-red-700',
    };
    return map[this.order().status] ?? 'font-bold text-gray-900';
  }
}
