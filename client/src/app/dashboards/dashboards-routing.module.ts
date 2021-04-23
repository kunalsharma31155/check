import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleGuard } from '../guards/role.guard';

const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   canActivate : [RoleGuard],
  //   redirectTo:'home'
  // },
  {
    path : '',
    loadChildren: () => import('./super-admin/super-admin.module').then(m => m.SuperAdminModule),
    // canActivate : [RoleGuard]
  },
  {
    path : '**',
    redirectTo : ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
