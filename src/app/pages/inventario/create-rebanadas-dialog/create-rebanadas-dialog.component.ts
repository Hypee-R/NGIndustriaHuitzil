import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { productoModel } from 'src/app/models/productos.model';

@Component({
  selector: 'app-create-rebanadas-dialog',
  templateUrl: './create-rebanadas-dialog.component.html',
  styleUrls: ['./create-rebanadas-dialog.component.css']
})
export class CreateRebanadasDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() articulo: productoModel = new productoModel();

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();
  @Output() confirmCreate: EventEmitter<{ costoRebanada: number; descripcionRebanada: string }> =
    new EventEmitter<{ costoRebanada: number; descripcionRebanada: string }>();

  submitted = false;
  costoRebanada = 0;
  descripcionRebanada = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible?.currentValue) {
      this.submitted = false;
      this.costoRebanada = 0;
      this.descripcionRebanada = this.buildDescripcionDefault();
    }
  }

  get existenciaDisponible(): number {
    const existencia = Number(this.articulo?.existencia ?? 0);
    return Number.isNaN(existencia) ? 0 : existencia;
  }

  get formInvalid(): boolean {
    return this.existenciaDisponible < 1 || !this.costoRebanada || this.costoRebanada <= 0 || !this.descripcionRebanada?.trim();
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

  crearRebanadas(): void {
    this.submitted = true;
    if (this.formInvalid) {
      return;
    }

    this.confirmCreate.emit({
      costoRebanada: this.costoRebanada,
      descripcionRebanada: this.descripcionRebanada.trim()
    });
  }

  private buildDescripcionDefault(): string {
    const descripcion = this.articulo?.descripcion || '';
    return `${descripcion} - REBANADA 1/8`;
  }
}
