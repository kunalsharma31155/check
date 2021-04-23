import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UsersListComponent } from './users-list/users-list.component';
import { FacilityListComponent } from './facility-list/facility-list.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { AdminScreenComponent } from './admin-screen/admin-screen.component';
import { ReportsComponent } from './reports/reports.component';
import { ProvidersListComponent } from './providers-list/providers-list.component';
import { VisitDetailsComponent } from './visit-details/visit-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'users-list',
    component: UsersListComponent
  },
  {
    path: 'admin',
    component: AdminScreenComponent
  },
  {
    path: 'facility-list',
    component: FacilityListComponent
  },
  {
    path: 'patient-list',
    component: PatientListComponent
  },
  {
    path: 'data-entry',
    component: DataEntryComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'providers-list',
    component: ProvidersListComponent
  },
  {
    path: 'visit-details/:id',
    component: VisitDetailsComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
