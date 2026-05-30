import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppStore } from '../../core/app-store.service';
import { MobileLayoutComponent } from '../../layout/mobile-layout.component';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [FormsModule, RouterLink, MobileLayoutComponent],
  template: `
    <app-mobile-layout>
      <div class="content-medium flex min-h-0 flex-1 flex-col">
        <h1 class="mb-8 text-center text-2xl font-bold">{{ title() }}</h1>
        <form class="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto pr-1 pb-4" (ngSubmit)="save()">
          <select class="input" name="client" [(ngModel)]="client"><option>Israel Jesus</option></select>
          <select class="input" name="type" [(ngModel)]="type"><option>INSTALAÇÃO</option><option>MANUTENÇÃO</option></select>
          <select class="input" name="technicianId" [(ngModel)]="technicianId">
            <option [ngValue]="undefined">Selecione Técnico</option>
            @for (technician of store.technicians(); track technician.id) {
              <option [ngValue]="technician.id">{{ technician.name }}</option>
            }
          </select>
          <input class="input" name="date" [(ngModel)]="date" type="date" />
          <select class="input" name="status" [(ngModel)]="status"><option>PENDENTE</option><option>EM_ANDAMENTO</option><option>CONCLUIDA</option></select>
          <textarea class="input min-h-24" name="description" [(ngModel)]="description" placeholder="Descrição"></textarea>

          <div class="action-bar mt-2">
            <a routerLink="/ordens" class="btn btn-danger">Cancelar</a>
            <button class="btn btn-primary" type="submit">Confirmar</button>
          </div>
        </form>
      </div>
    </app-mobile-layout>
  `
})
export class OrderFormComponent {
  public readonly store = inject(AppStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly id = Number(this.route.snapshot.paramMap.get('id')) || undefined;
  readonly editingOrder = computed(() => this.id ? this.store.findOrder(this.id) : undefined);
  readonly title = computed(() => this.id ? 'Editar OS' : 'Cria OS');

  client = this.editingOrder()?.client ?? 'Israel Jesus';
  type = this.editingOrder()?.type ?? 'INSTALAÇÃO';
  technicianId = this.editingOrder()?.technicianId;
  date = this.editingOrder()?.date ?? '2025-10-02';
  status = this.editingOrder()?.status ?? 'PENDENTE';
  description = this.editingOrder()?.description ?? '';


  save(): void {
    this.router.navigateByUrl('/ordens');
  }
}
