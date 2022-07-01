import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SideUserComponent } from './components/side-user/side-user.component';

//PrimeNG
import { PanelMenuModule } from 'primeng/panelmenu';
import {TieredMenuModule} from 'primeng/tieredmenu';
import { ItemEmptyComponent } from './components/item-empty/item-empty.component';
import { LoadingComponent } from './components/loading/loading.component';



@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      RouterModule,
      ReactiveFormsModule,
      //PrimeNG
      PanelMenuModule,
      TieredMenuModule,
    ],
    declarations: [
      NavBarComponent,
      SideBarComponent,
      SideUserComponent,
      ItemEmptyComponent,
      LoadingComponent
    ],
    exports: [
      NavBarComponent,
      SideBarComponent,
      SideUserComponent,
      ItemEmptyComponent,
      LoadingComponent,
    ]
})
export class SharedModule { }
