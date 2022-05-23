import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';

export const contentRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    {
        path: '**',
        redirectTo: 'home'
    }


];
