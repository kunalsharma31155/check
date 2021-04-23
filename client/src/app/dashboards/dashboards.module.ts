import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

const modules = [
  CommonModule,
  DashboardsRoutingModule,
  SuperAdminModule,
  NgbModule
]

@NgModule({
  declarations: [],
  imports: [
    ...modules
  ]
})
export class DashboardsModule { }
