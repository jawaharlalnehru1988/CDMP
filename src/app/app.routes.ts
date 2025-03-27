import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', loadComponent: () => import("./auth/auth.component").then(c => c.AuthComponent)},
    {path: 'auth', redirectTo: '', pathMatch: 'full'},
    {path: 'dashboard', loadComponent:()=> import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent)}
    
];
