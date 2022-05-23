import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContentComponent } from '../content/content.component';
import { SharedModule } from '../shared/shared.module';
import { ContentRoutingModule } from '../content/content-routing.module';

import { HomeComponent } from './home/home.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ContentRoutingModule,
        // StoreModule.forFeature('viewUsers', usersReducer),
    ],
    declarations: [
        ContentComponent,
        HomeComponent,
    ]
})
export class PagesModule { }
