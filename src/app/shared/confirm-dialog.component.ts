import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (open()) {
      <div class="absolute inset-0 z-20 grid place-items-center bg-black/35 px-5">
        <article class="w-full max-w-sm rounded-sm bg-white p-6 shadow-xl">
          <h2 class="text-center text-lg font-semibold text-gray-900">{{ title() }}</h2>
          <ng-content />
          <div class="mt-8 flex justify-between gap-4">
            <button class="btn btn-danger flex-1" type="button" (click)="cancel.emit()">Cancelar</button>
            <button class="btn btn-primary flex-1" type="button" (click)="confirm.emit()">Confirmar</button>
          </div>
        </article>
      </div>
    }
  `
})
export class ConfirmDialogComponent {
  readonly open = input(false);
  readonly title = input('Confirmar ação');
  readonly cancel = output<void>();
  readonly confirm = output<void>();
}
