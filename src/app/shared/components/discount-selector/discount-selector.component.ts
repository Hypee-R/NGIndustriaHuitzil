import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-discount-selector',
  template: `
    <p-dropdown [options]="discountOptions" [(ngModel)]="selectedDiscount" (onChange)="onSelectDiscount($event.value)" [style]="{'width':'350px'}" optionLabel="label"></p-dropdown>
  `
})
export class DiscountSelectorComponent {
  discountOptions: any[];
  selectedDiscount: number;

  @Output() discountSelected = new EventEmitter<number>();

  constructor() {
    this.discountOptions = this.generateDiscountOptions();
    this.selectedDiscount = 0; // Inicializar el descuento seleccionado como 0
  }

  generateDiscountOptions(): any[] {
    const options = [];
    options.push({ label: 'Aplica un descuento', value: 0 }); // Cambié la leyenda por "Selecciona un descuento"
    for (let i = 5; i <= 100; i += 5) {
      options.push({ label: i + '%', value: i });
    }
    return options;
  }

  onSelectDiscount(selectedValue: number) {
    this.discountSelected.emit(selectedValue);
  }
}
