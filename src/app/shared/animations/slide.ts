import {
  trigger,
  animate,
  transition,
  style,
  query,
  state
} from '@angular/animations';

export const SlideAnimation = trigger('SlideAnimation', [
  transition('* => *', [
    query(
      ':leave',
      [
        style({ opacity: 1, right: 0 }),
        animate('0.3s', style({ opacity: .5, right: -1000 }))],
      { optional: true }
    ),
    query(
      ':self',
      [
        style({ opacity: 0, right: -1000 }),
        animate('0.3s', style({ opacity: 1, right: 0 }))],
      { optional: true }
    )
  ])
]);
