import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SideUserComponent } from './components/side-user/side-user.component';
import { DiscountSelectorComponent } from './components/discount-selector/discount-selector.component';


//PrimeNG
import { PanelMenuModule } from 'primeng/panelmenu';
import {TieredMenuModule} from 'primeng/tieredmenu';
import { ItemEmptyComponent } from './components/item-empty/item-empty.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SalesPaymentTypeComponent } from './components/charts/sales-payment-type/sales-payment-type.component';
import { SalesLocationRankingComponent } from './components/charts/sales-location-ranking/sales-location-ranking.component';
import { EmployeeSalesRankingComponent } from './components/charts/employee-sales-ranking/employee-sales-ranking.component';
import { RankingItemsSoldComponent } from './components/charts/ranking-items-sold/ranking-items-sold.component';
import { DropdownModule } from 'primeng/dropdown';
import { NgApexchartsModule } from 'ng-apexcharts';
//import { NgxBarcode6Module } from 'ngx-barcode6';


@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      RouterModule,
      ReactiveFormsModule,
      //ApexCharts
      NgApexchartsModule,
      //PrimeNG
      PanelMenuModule,
      TieredMenuModule,
      DropdownModule,
    ],
    declarations: [
      NavBarComponent,
      SideBarComponent,
      SideUserComponent,
      ItemEmptyComponent,
      LoadingComponent,
      SalesPaymentTypeComponent,
      SalesLocationRankingComponent,
      EmployeeSalesRankingComponent,
      RankingItemsSoldComponent,
      DiscountSelectorComponent
    ],
    exports: [
      NavBarComponent,
      SideBarComponent,
      SideUserComponent,
      ItemEmptyComponent,
      LoadingComponent,
      SalesPaymentTypeComponent,
      SalesLocationRankingComponent,
      EmployeeSalesRankingComponent,
      RankingItemsSoldComponent,
      DiscountSelectorComponent,
    ]
})
export class SharedModule { }
