import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { HomeComponent } from './home/home.component';
import { SuperAdminComponent } from './super-admin.component';
import { SidebarModule } from '../../shared/sidebar/sidebar.module';
import { FacilityPsychotropicNumberReportModule } from '../../reports/facility-psychotropic-number-report/facility-psychotropic-number-report.module'
import { ProviderPerformanceReportModule } from '../../reports/provider-performance-report/provider-performance-report.module';
import { BriefProviderPerformanceReportModule } from '../../reports/brief-provider-performance-report/brief-provider-performance-report.module';
import { FacilityCompanyPatientNotesReportModule } from '../../reports/facility-company-patient-notes-report/facility-company-patient-notes-report.module';
import { FacilityPostRoundingReportModule } from '../../reports/facility-post-round-report/facility-post-round-report.module';
import { PatientPowerOfAttorneyReportModule } from '../../reports/patientpowerofattorneyreport/patient-power-of-attorney-report.module';
import { BillingCompanyMissingDocumentsReportsModule } from '../../reports/billing-company-missing-documents-reports/billing-company-missing-documents-reports.module';
import { FacilityDetailedGdrReportModule } from '../../reports/facility-detailed-gdr-report/facility-detailed-gdr-report.module';
import { PatientSummaryReportModule } from '../../reports/patient-summary-report/patient-summary-report.module';

import { FacilitySnapShotReportModule } from '../../reports/facility-snap-shot-report/facility-snap-shot-report.module';
import { AdminPriorAuthReportModule } from '../../reports/admin-prior-auth-report/admin-prior-auth-report.module';
import { FacilityPracticePerformanceReportModule } from '../../reports/facility-practice-performance-report/facility-practice-performance-report.module';
import { UsersListComponent } from './users-list/users-list.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { FacilityListComponent } from './facility-list/facility-list.component';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { AdminScreenComponent } from './admin-screen/admin-screen.component';
import { ReportsComponent } from './reports/reports.component';
import { ProvidersListComponent } from './providers-list/providers-list.component';
import { VisitDetailsComponent } from './visit-details/visit-details.component';


const modules = [
  CommonModule,
  SuperAdminRoutingModule,
  SidebarModule,
  FormsModule,
  Ng2SearchPipeModule,
  NgxPaginationModule,
  NgbModule,
  ProviderPerformanceReportModule,
  BriefProviderPerformanceReportModule,
  FacilityPsychotropicNumberReportModule,
  AdminPriorAuthReportModule,
  ReactiveFormsModule,
  FacilityCompanyPatientNotesReportModule,
  FacilityPostRoundingReportModule,
  PatientPowerOfAttorneyReportModule,
  BillingCompanyMissingDocumentsReportsModule,
  FacilitySnapShotReportModule,
  FacilityPracticePerformanceReportModule,
  FacilityDetailedGdrReportModule,
  PatientSummaryReportModule
]

@NgModule({
  declarations: [HomeComponent, SuperAdminComponent, UsersListComponent, PatientListComponent, FacilityListComponent, DataEntryComponent, AdminScreenComponent, ReportsComponent, ProvidersListComponent, VisitDetailsComponent],
  imports: [
    ...modules
  ],
  entryComponents: []
})
export class SuperAdminModule { }
