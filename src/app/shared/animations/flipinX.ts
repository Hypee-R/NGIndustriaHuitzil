import {
  trigger,
  animate,
  transition,
  style,
  query,
  state
} from '@angular/animations';

export const flipInXAnimation = trigger('flipInXAnimation', [
transition('* => *', [
  query(
      ':leave',
      [style({ display: 'none', opacity: 0}),],
      { optional: true }
  ),
  query(
      ':self',
      [
        style({ opacity: 0 }),
        animate('0.3s', style({ opacity: 1, transform: 'rotateY(360deg)' }))],
      { optional: true }
  )
])
]);
