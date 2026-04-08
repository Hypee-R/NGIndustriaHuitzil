export interface ConceptoAbono {
  id: number;
  nombre: string;
}

export const CONCEPTOS_ABONO: ConceptoAbono[] = [
  { id: 1, nombre: 'Depósito por Bases' },
  { id: 2, nombre: 'Abono a crédito' },
  { id: 3, nombre: 'Pago parcial' },
  { id: 4, nombre: 'Otro' }
];
