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
        <p><strong>OS:</strong> {{ order().id }}</p>
        <p><strong>Cliente:</strong> {{ order().client }}</p>
        <p><strong>Tipo:</strong> {{ order().type }}</p>
        <p><strong>Status:</strong> <span [class]="statusClass()">{{ order().status }}</span></p>
        <p><strong>Endereço:</strong> {{ order().address }}</p>
      </a>
    </article>
  `
})
export class OrderCardComponent {
  readonly order = input.required<ServiceOrder>();

  statusClass(): string {
    return this.order().status === 'CONCLUIDA' ? 'font-bold text-green-700' : 'font-bold text-gray-900';
  }
}
