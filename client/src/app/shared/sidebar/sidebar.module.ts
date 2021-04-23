import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbCollapseModule,NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

import { SidebarComponent } from './sidebar.component';

@NgModule({
  declarations: [SidebarComponent],
  imports: [
    CommonModule,
    NgbCollapseModule,
    NgbDropdownModule,
    RouterModule,
  ],
  exports: [SidebarComponent]
})
export class SidebarModule { }
