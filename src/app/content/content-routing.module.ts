import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContentComponent } from './content.component';
import { contentRoutes } from './content.routes';

const routes: Routes = [
    {
        path: '',
        component: ContentComponent,
        children: contentRoutes,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ],
    declarations: []
})
export class ContentRoutingModule { }
