import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule),
    canActivate : [AuthGuard]
  },
  {
    path:'**',
    redirectTo : 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
