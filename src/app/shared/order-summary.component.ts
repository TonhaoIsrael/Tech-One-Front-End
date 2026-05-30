import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ServiceOrder } from '../core/models';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  template: `
    <article class="card text-sm leading-6 text-gray-950">
      <p><strong>OS:</strong> {{ order().id }}</p>
      <p><strong>Cliente:</strong> {{ order().client }}</p>
      <p><strong>Tipo:</strong> {{ order().type }}</p>
      <p><strong>Status:</strong> {{ order().status }}</p>
      <p><strong>Endereço:</strong> {{ order().address }}</p>
      <p><strong>Plano:</strong> {{ order().plan }}</p>
      <p><strong>Data:</strong> {{ order().date | date:'dd/MM/yyyy' }}</p>
      <p><strong>Horário:</strong> {{ order().time }}</p>
      <p><strong>Descrição:</strong> {{ order().description }}</p>
      @if (order().technicianNotes) {
        <p><strong>Observações:</strong> {{ order().technicianNotes }}</p>
      }
    </article>
  `,
  imports: [DatePipe]
})
export class OrderSummaryComponent {
  readonly order = input.required<ServiceOrder>();
}
