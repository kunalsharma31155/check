import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';

import { FacilityCompanyPatientNotesReportComponent } from './facility-company-patient-notes-report.component';



@NgModule({
  declarations: [FacilityCompanyPatientNotesReportComponent],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgbModule,
    ChartsModule
  ],
  entryComponents: [FacilityCompanyPatientNotesReportComponent],
  exports: [FacilityCompanyPatientNotesReportComponent]
})
export class FacilityCompanyPatientNotesReportModule { }
