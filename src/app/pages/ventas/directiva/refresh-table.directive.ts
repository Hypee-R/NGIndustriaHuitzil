import { Directive, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { productoVentaModel } from 'src/app/models/productoVenta.model';

@Directive({
  selector: '[appRefreshTable]'
})
export class RefreshTableDirective implements OnChanges{

  @Input() appRefreshTable !: number;

  constructor(  private templateRef : TemplateRef<any>,
                private viewContainerRef : ViewContainerRef )
                 {
                  this.viewContainerRef.createEmbeddedView(templateRef)
                 }

  ngOnChanges(changes: SimpleChanges): void {
    
    if(changes['appRefreshTable']){
      this.viewContainerRef.clear()
      this.viewContainerRef.createEmbeddedView(this.templateRef)

    }
  }

}
