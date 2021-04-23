import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';

import { FacilityPsychotropicNumberReportComponent } from './facility-psychotropic-number-report.component';



@NgModule({
  declarations: [FacilityPsychotropicNumberReportComponent],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgbModule,
    ChartsModule
  ],
  entryComponents: [FacilityPsychotropicNumberReportComponent],
  exports: [
    FacilityPsychotropicNumberReportComponent
  ]
})
export class FacilityPsychotropicNumberReportModule { }
