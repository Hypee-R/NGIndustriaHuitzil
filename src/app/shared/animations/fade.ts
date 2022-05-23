import {
  trigger,
  animate,
  transition,
  style,
  query
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
      query(
          ':leave',
          [style({ display: 'none', opacity: 0 }),],
          { optional: true }
      ),
      query(
          ':self',
          [style({ opacity: 0 }), animate('0.4s', style({ opacity: 1 }))],
          { optional: true }
      )
  ])
]);
