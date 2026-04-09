import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { productoModel } from 'src/app/models/productos.model';

@Component({
  selector: 'app-send-merma-dialog',
  templateUrl: './send-merma-dialog.component.html',
  styleUrls: ['./send-merma-dialog.component.css']
})
export class SendMermaDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() articulo: productoModel = new productoModel();

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();
  @Output() confirmMerma: EventEmitter<{ cantidad: number; motivo: string }> = new EventEmitter<{ cantidad: number; motivo: string }>();

  submitted = false;
  cantidadMerma = 1;
  motivo = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible?.currentValue) {
      this.submitted = false;
      this.cantidadMerma = 1;
      this.motivo = '';
    }
  }

  get existenciaDisponible(): number {
    const existencia = Number(this.articulo?.existencia ?? 0);
    return Number.isNaN(existencia) ? 0 : existencia;
  }

  get cantidadInvalida(): boolean {
    return !this.cantidadMerma || this.cantidadMerma < 1 || this.cantidadMerma > this.existenciaDisponible;
  }

  hideDialog(): void {
    this.closeDialog.emit();
  }

  onVisibleChange(isVisible: boolean): void {
    this.visible = isVisible;
    if (!isVisible) {
      this.closeDialog.emit();
    }
  }

  enviarAMerma(): void {
    this.submitted = true;

    if (this.cantidadInvalida) {
      return;
    }

    this.confirmMerma.emit({
      cantidad: this.cantidadMerma,
      motivo: this.motivo?.trim() ?? ''
    });
  }
}
