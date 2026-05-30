import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppStore } from '../../core/app-store.service';
import { MobileLayoutComponent } from '../../layout/mobile-layout.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { OrderSummaryComponent } from '../../shared/order-summary.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, MobileLayoutComponent, ConfirmDialogComponent, OrderSummaryComponent],
  template: `
    <app-mobile-layout>
      @if (order(); as currentOrder) {
        <app-order-summary [order]="currentOrder" />

        @if (currentOrder.status === 'PENDENTE') {
          <div class="mt-10 grid gap-3">
            <button class="btn btn-primary" type="button" (click)="chooseTechnician.set(true)">Escolhe Técnico</button>
            <a class="btn btn-primary" [routerLink]="['/ordens', currentOrder.id, 'editar']">Editar OS</a>
            <button class="btn btn-primary" type="button" (click)="deleteOpen.set(true)">Excluir OS</button>
            <button class="btn btn-primary mt-8" type="button" (click)="startOrder(currentOrder.id)">Iniciar OS</button>
          </div>
        } @else if (currentOrder.status === 'EM_ANDAMENTO') {
          <form class="mt-10 space-y-4" (ngSubmit)="finishOrder(currentOrder.id)">
            <label class="label">Adicionar Observações do Técnico</label>
            <textarea class="input min-h-28" name="notes" [(ngModel)]="notes"></textarea>
            <label class="label">Status</label>
            <select class="input" name="status"><option>Concluída</option></select>
            <button class="btn btn-danger-dark mt-10 w-full" type="submit">Encerrar OS</button>
          </form>
        } @else {
          <p class="mt-8 rounded bg-green-50 p-4 text-center text-sm font-semibold text-green-800">OS concluída.</p>
        }

        <app-confirm-dialog [open]="deleteOpen()" title="Deseja Excluir essa OS?" (cancel)="deleteOpen.set(false)" (confirm)="deleteOrder(currentOrder.id)" />

        @if (chooseTechnician()) {
          <div class="absolute inset-x-0 top-14 z-10 bg-white px-5 py-6 shadow-xl">
            <div class="mb-6 flex items-center justify-between">
              <h2 class="text-lg font-semibold">Selecione o Técnico</h2>
              <button type="button" class="text-xl" (click)="chooseTechnician.set(false)">×</button>
            </div>
            <select class="input" [(ngModel)]="selectedTechnician" name="technician">
              <option [ngValue]="undefined">Select</option>
              @for (technician of store.technicians(); track technician.id) {
                <option [ngValue]="technician.id">{{ technician.name }}</option>
              }
            </select>
            <button class="btn btn-primary mt-8 w-full" type="button" (click)="chooseTechnician.set(false)">Escolhe Técnico</button>
          </div>
        }
      } @else {
        <p class="rounded bg-gray-100 p-6 text-center">OS não encontrada.</p>
      }
    </app-mobile-layout>
  `
})
export class OrderDetailComponent {
  public readonly store = inject(AppStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly id = Number(this.route.snapshot.paramMap.get('id'));
  readonly order = computed(() => this.store.findOrder(this.id));
  readonly deleteOpen = signal(false);
  readonly chooseTechnician = signal(false);
  selectedTechnician?: number;
  notes = '';


  startOrder(id: number): void {
    this.store.setOrderStatus(id, 'EM_ANDAMENTO');
  }

  finishOrder(id: number): void {
    this.store.setOrderStatus(id, 'CONCLUIDA', this.notes || 'Atendimento finalizado pelo técnico.');
  }

  deleteOrder(id: number): void {
    this.store.deleteOrder(id);
    this.router.navigateByUrl('/ordens');
  }
}
