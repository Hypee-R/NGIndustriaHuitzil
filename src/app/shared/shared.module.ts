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
      SideUserComponent
    ],
    exports: [
      NavBarComponent,
      SideBarComponent,
      SideUserComponent
    ]
})
export class SharedModule { }
