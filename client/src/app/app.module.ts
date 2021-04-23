import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { ChartsModule, ThemeService } from 'ng2-charts';

import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { DashboardsModule } from './dashboards/dashboards.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreatePatientComponent } from './shared/create-patient/create-patient.component';
import { CreateUserComponent } from './shared/create-user/create-user.component';
import { CreateFacilityComponent } from './shared/create-facility/create-facility.component';
import { UpdatePatientRecordComponent } from './shared/update-patient-record/update-patient-record.component';
import { DataEntryPostRoundingComponent } from './shared/data-entry-post-rounding/data-entry-post-rounding.component';
import { PsychotropicNumberComponent } from './shared/psychotropic-number/psychotropic-number.component';
import { CreateProviderComponent } from './shared/create-provider/create-provider.component';
import { FileUploadComponent } from './shared/file-upload/file-upload.component';
import { ProgressComponent } from './shared/progress/progress.component';
import { ConfirmDeleteModalComponent } from './shared/confirm-delete-modal/confirm-delete-modal.component';

const modules = [
  BrowserModule,
  AppRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  BrowserAnimationsModule,
  Ng2SearchPipeModule,
  NgxPaginationModule,
  NgxSpinnerModule,
  HttpClientModule,
  ToastrModule.forRoot({
    positionClass: 'toast-top-right'
  }),
  DashboardsModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModule,
  ChartsModule
]

@NgModule({
  declarations: [
    AppComponent,
    CreatePatientComponent,
    CreateUserComponent,
    CreateFacilityComponent,
    UpdatePatientRecordComponent,
    DataEntryPostRoundingComponent,
    PsychotropicNumberComponent,
    CreateProviderComponent,
    FileUploadComponent,
    ProgressComponent,
    ConfirmDeleteModalComponent,
  ],
  imports: [
    ...modules
  ],
  entryComponents: [
    CreatePatientComponent,
    CreateUserComponent,
    CreateFacilityComponent,
    UpdatePatientRecordComponent,
    DataEntryPostRoundingComponent,
    PsychotropicNumberComponent,
    CreateProviderComponent
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpConfigInterceptor,
    multi: true
  },
    ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
