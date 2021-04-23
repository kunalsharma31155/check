import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';

import { PatientPowerOfAttorneyReportComponent } from './patient-power-of-attorney-report.component';



@NgModule({
  declarations: [PatientPowerOfAttorneyReportComponent],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgbModule,
    ChartsModule
  ],
  entryComponents: [PatientPowerOfAttorneyReportComponent],
  exports: [PatientPowerOfAttorneyReportComponent]
})
export class PatientPowerOfAttorneyReportModule { }
