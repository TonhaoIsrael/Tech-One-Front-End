import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppStore } from '../../core/app-store.service';
import { MobileLayoutComponent } from '../../layout/mobile-layout.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, MobileLayoutComponent, ConfirmDialogComponent],
  template: `
    <app-mobile-layout>
      @if (order(); as currentOrder) {
        <div class="order-detail">
          <article class="order-panel">
            <p><span>OS:</span> {{ currentOrder.id }}</p>
            <p><strong>Cliente: {{ currentOrder.client }}</strong></p>
            <p><span>Tipo:</span> {{ currentOrder.type }}</p>
            <p><span>Status:</span> {{ currentOrder.status }}</p>
            <p><span>Endereço:</span> {{ currentOrder.address }}</p>
            <p><span>Plano:</span> {{ currentOrder.plan }}</p>
            <p class="date-line"><span>Data:</span> {{ currentOrder.date | date:'dd/MM/yyyy' }}</p>
            <p class="time-line"><span>Horario:</span> {{ currentOrder.time }}</p>
            <p class="description-line"><span>Descrição:</span> {{ currentOrder.description }}</p>
            @if (currentOrder.technicianNotes) {
              <p class="description-line"><span>Observações:</span> {{ currentOrder.technicianNotes }}</p>
            }
          </article>

          @if (currentOrder.status === 'PENDENTE') {
            <div class="detail-actions">
              <button class="btn detail-button" type="button" (click)="openTechnicianPicker(currentOrder.technicianId)">Escolhe Tecnico</button>
              <a class="btn detail-button" [routerLink]="['/ordens', currentOrder.id, 'editar']">Editar OS</a>
              <button class="btn detail-button" type="button" (click)="deleteOpen.set(true)">Excluir OS</button>
            </div>
          } @else if (currentOrder.status === 'EM_ANDAMENTO') {
            <form class="finish-form" (ngSubmit)="finishOrder(currentOrder.id)">
              <label class="label">Adicionar Observações do Técnico</label>
              <textarea class="input" name="notes" [(ngModel)]="notes"></textarea>
              <label class="label">Status</label>
              <select class="input" name="status"><option>Concluída</option></select>
              <button class="btn detail-button" type="submit">Encerrar OS</button>
            </form>
          } @else {
            <p class="done-message">OS concluída.</p>
          }
        </div>

        <app-confirm-dialog [open]="deleteOpen()" title="Deseja Excluir essa OS?" (cancel)="deleteOpen.set(false)" (confirm)="deleteOrder(currentOrder.id)" />

        @if (chooseTechnician()) {
          <div class="technician-backdrop">
            <div class="technician-sheet">
              <div class="sheet-header">
                <h2>Selecione o Técnico</h2>
                <button type="button" aria-label="Fechar" (click)="chooseTechnician.set(false)">×</button>
              </div>
              <select class="input" [(ngModel)]="selectedTechnician" name="technician">
                <option [ngValue]="undefined">Sem técnico</option>
                @for (technician of store.technicians(); track technician.id) {
                  <option [ngValue]="technician.id">{{ technician.name }}</option>
                }
              </select>
              <button class="btn detail-button" type="button" (click)="saveTechnician(currentOrder.id)">Escolhe Tecnico</button>
            </div>
          </div>
        }
      } @else {
        <div class="not-found">
          <p>OS não encontrada.</p>
          <a class="btn detail-button" routerLink="/ordens">Voltar</a>
        </div>
      }
    </app-mobile-layout>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
      min-height: 0;
    }

    .order-detail {
      flex: 1;
      min-height: 0;
      width: 100%;
      overflow-y: auto;
      padding: 83px 3px 24px;
      scrollbar-width: none;
    }

    .order-detail::-webkit-scrollbar {
      display: none;
    }

    .order-panel {
      min-height: 424px;
      border-radius: 5px;
      background: #d7d7d9;
      padding: 6px 6px 12px;
      color: #0d0f12;
      font-size: 1.06rem;
      line-height: 1.2;
      letter-spacing: .08em;
    }

    .order-panel p {
      margin: 0 0 8px;
    }

    .order-panel strong {
      font-weight: 900;
    }

    .order-panel span {
      font-weight: 400;
    }

    .date-line {
      padding-top: 10px;
    }

    .time-line {
      padding-top: 18px;
    }

    .description-line {
      padding-top: 4px;
      padding-left: 6px;
    }

    .detail-actions {
      display: grid;
      gap: 14px;
      padding-top: 13px;
    }

    .detail-button {
      width: 100%;
      min-height: 60px;
      border-radius: 5px;
      background: #218ca2;
      color: #fff;
      font-size: 1.06rem;
      font-weight: 900;
      letter-spacing: .08em;
    }

    .detail-button:hover {
      background: #1d7f92;
    }

    .finish-form {
      display: grid;
      gap: 10px;
      margin-top: 14px;
      border-radius: 5px;
      background: #d7d7d9;
      padding: 14px;
    }

    .finish-form .input {
      margin-bottom: 4px;
      border-radius: 5px;
      background: #fff;
    }

    .finish-form textarea.input {
      min-height: 116px;
    }

    .done-message,
    .not-found {
      margin-top: 14px;
      border-radius: 5px;
      background: #d7d7d9;
      padding: 16px;
      text-align: center;
      color: #111827;
      font-weight: 800;
    }

    .technician-backdrop {
      position: absolute;
      inset: 0;
      z-index: 15;
      display: flex;
      align-items: flex-end;
      background: rgba(17, 24, 39, .34);
      padding: 16px;
    }

    .technician-sheet {
      width: 100%;
      border-radius: 8px;
      background: #fff;
      padding: 18px 16px;
      box-shadow: 0 -18px 44px rgba(15, 23, 42, .2);
    }

    .sheet-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }

    .sheet-header h2 {
      margin: 0;
      color: #111827;
      font-size: 1.1rem;
      font-weight: 900;
    }

    .sheet-header button {
      width: 36px;
      height: 36px;
      border: 0;
      border-radius: 999px;
      background: #f3f4f6;
      color: #374151;
      font-size: 1.35rem;
      line-height: 1;
      cursor: pointer;
    }

    .technician-sheet .input {
      border-radius: 5px;
      background: #f3f4f6;
    }

    @media (max-width: 430px) {
      .order-detail {
        padding-top: 83px;
      }
    }
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

  openTechnicianPicker(technicianId?: number): void {
    this.selectedTechnician = technicianId;
    this.chooseTechnician.set(true);
  }

  saveTechnician(id: number): void {
    this.store.setOrderTechnician(id, this.selectedTechnician);
    this.chooseTechnician.set(false);
  }

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
