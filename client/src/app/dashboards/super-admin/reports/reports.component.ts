import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JwtHelperService } from "@auth0/angular-jwt";
import { FacilityService } from '../../../services/facility.service';
import { NotificationService } from '../../../services/notification.service';
import { ReportsService } from '../../../services/reports.service';
import { ProviderService } from '../../../services/provider.service';
import { PatientService } from '../../../services/patient.service';
import { FacilityPsychotropicNumberReportComponent } from '../../../reports/facility-psychotropic-number-report/facility-psychotropic-number-report.component';
import { ProviderPerformanceReportComponent } from '../../../reports/provider-performance-report/provider-performance-report.component';
import { BriefProviderPerformanceReportComponent } from '../../../reports/brief-provider-performance-report/brief-provider-performance-report.component';
import { AdminPriorAuthReportComponent } from '../../../reports/admin-prior-auth-report/admin-prior-auth-report.component';
import { FacilityCompanyPatientNotesReportComponent } from '../../../reports/facility-company-patient-notes-report/facility-company-patient-notes-report.component';
import { FacilitySnapShotReportComponent } from '../../../reports/facility-snap-shot-report/facility-snap-shot-report.component';
import { FacilityPracticePerformanceReportComponent } from '../../../reports/facility-practice-performance-report/facility-practice-performance-report.component';
import { FacilityPostRoundingReportComponent } from '../../../reports/facility-post-round-report/facility-post-round-report.component';
import { UserAccessService } from '../../../services/user-access.service';
import { PatientPowerOfAttorneyReportComponent } from '../../../reports/patientpowerofattorneyreport//patient-power-of-attorney-report.component';
import { BillingCompanyMissingDocumentsReportsComponent } from '../../../reports/billing-company-missing-documents-reports/billing-company-missing-documents-reports.component';
import { FacilityDetailedGdrReportComponent } from '../../../reports/facility-detailed-gdr-report/facility-detailed-gdr-report.component';
import { PatientSummaryReportComponent } from '../../../reports/patient-summary-report/patient-summary-report.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  @ViewChild('content1', { static: true }) content1: TemplateRef<any>;
  @ViewChild('content2', { static: true }) content2: TemplateRef<any>;
  @ViewChild('content3', { static: true }) content3: TemplateRef<any>;
  helper = new JwtHelperService();
  searchTerm;
  pageNo;
  patients;
  searching = false;
  public isCollapsed = true;
  public isCollapsed1 = true;
  public isCollapsed2 = true;
  public isCollapsed3 = true;
  public isCollapsed4 = true;
  public isCollapsed5 = true;
  public isCollapsed6 = true;
  public isCollapsed7 = true;
  public isCollapsed8 = true;
  public isCollapsed9 = true;
  public isFacilityPostRoundingCollapsed = true;
  public isCollapsedForBillingmissingreports = true;
  public isCollapsedForFacilityDetailedGDRreports = true;
  public isCollapsedForPatientPowerofAttorneyReport = true;
  public isCollapsed10 = true;
  public isCollapsed11 = true;
  public patientSummaryReport = true;
  psychotropicReportForm: FormGroup;
  facilityPostRoundingReportForm: FormGroup;
  snapShotReportForm: FormGroup;
  providerPerformanceReportForm: FormGroup;
  briefproviderPerformanceReportForm: FormGroup;
  adminPriorReportForm: FormGroup;
  facilityPatientNumberReportForm: FormGroup;
  patientSummaryReportForm: FormGroup;
  facilityPerformanceReportForm: FormGroup;
  PowerOfAttorneyReportForm: FormGroup;
  MissingDocumentsReportForm: FormGroup;
  FacilityDetailedGDRReportForm: FormGroup;
  permission;
  corporateName;

  formSubmitted = false;
  formSubmitted1 = false;
  formSubmitted2 = false;
  formSubmitted3 = false;
  formSubmitted4 = false;
  formSubmitted5 = false;
  formSubmitted6 = false;
  formSubmittedForfacilityPostRounding = false;
  formSubmittedForPowerOfAttorneyReport = false;
  formSubmittedForMissingDocumentsReport = false;
  formSubmittedForFacilityDetailedGDRReport = false;
  formSubmittedPatientSummaryReport = false;
  facilitys = [];
  providers = [];
  patinets = [];

  constructor(private facilityService: FacilityService,
    private notifyService: NotificationService,
    private formBuilder: FormBuilder,
    private reportsService: ReportsService,
    private modalService: NgbModal,
    private providerService: ProviderService,
    private userAccess: UserAccessService,
    private patientService: PatientService) { }

  ngOnInit() {
    this.getuserAccess();
    this.isCollapsedd();
    this.createpsychotropicReportForm();
    this.createsnapShotReportForm();
    this.createproviderPerformanceReportForm();
    this.createbriefproviderPerformanceReportForm();
    this.createadminPriorReportForm();
    this.createfacilityPostRoundingReportForm();
    this.createPowerOfAttorneyReportForm();
    this.createMissingDocumentsReportForm();
    this.createFacilityPatientNumberReportForm();
    this.createPatientSummaryReportForm();
    this.createfacilityPerformanceReportForm();
    this.createFacilityDetailedGDRReportForm();
    this.getFacility();
    this.getProviders();
    this.getPatients();
  }
  config;
  getPatients() {
    this.patientService.getAllPatient(1).subscribe((res: any) => {
      this.patients = res.patients;
      this.config = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: res.totalItems
      };
    })
  }
  searchPatient() {
    if (this.searchTerm != "") {
      this.searching = true;
      this.patientService.searchPatient(this.searchTerm, 1).subscribe((data: any) => {
        this.patients = data.patients;
        this.config = {
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: data.totalItems
        };
      }, err => {
        this.notifyService.showError("", err);
      })
    } else {
      this.getPatients();
      this.searching = false;
    }
  }

  getuserAccess() {
    this.userAccess.getSpecificUserAccess().subscribe((res: any) => {
      this.permission = res.result;
    })
  }

  isCollapsedd() {
    this.isCollapsed = true;
    this.isCollapsed1 = true;
    this.isCollapsed2 = true;
    this.isCollapsed3 = true;
    this.isCollapsed4 = true;
    this.isCollapsed5 = true;
    this.isCollapsed6 = true;
    this.isCollapsed7 = true;
    this.isCollapsed8 = true;
    this.isCollapsed9 = true;
    this.patientSummaryReport = true;
    this.isFacilityPostRoundingCollapsed = true;
    this.isCollapsedForBillingmissingreports = true;
    this.isCollapsedForFacilityDetailedGDRreports = true;
    this.isCollapsedForPatientPowerofAttorneyReport = true;
  }
  collapseFunction(d) {
    if (d == "isCollapsed") {
      this.isCollapsed = false;
      this.isCollapsed1 = true;
      this.isCollapsed2 = true;
      this.isCollapsed7 = true;
    } else if (d == "isCollapsed1") {
      this.isCollapsed = true;
      this.isCollapsed1 = false;
      this.isCollapsed2 = true;
      this.isCollapsed7 = true;
    } else if (d == "isCollapsed2") {
      this.isCollapsed = true;
      this.isCollapsed1 = true;
      this.isCollapsed2 = false;
      this.isCollapsed7 = true;
    } else if (d == "isCollapsed7") {
      this.isCollapsed = true;
      this.isCollapsed1 = true;
      this.isCollapsed2 = true;
      this.isCollapsed7 = false;
    }
  }
  collapseChild1Function(d) {
    if (d == "isCollapsed5") {
      this.isCollapsed5 = false;
      this.isCollapsed6 = true;
    } else if (d == "isCollapsed6") {
      this.isCollapsed6 = false;
      this.isCollapsed5 = true;
    }
  }
  collapseChild2Function(d) {
    if (d == "isCollapsed4") {
      this.isCollapsed4 = false;
      this.isCollapsed3 = true;
      this.isCollapsed9 = true;
      this.isFacilityPostRoundingCollapsed = true;
      this.isCollapsedForBillingmissingreports = true;
      this.isCollapsedForPatientPowerofAttorneyReport = true;
      this.isCollapsed10 = true;
      this.isCollapsed11 = true;
      this.isCollapsedForFacilityDetailedGDRreports = true;
    } else if (d == "isCollapsed3") {
      this.isCollapsed4 = true;
      this.isCollapsed3 = false;
      this.isCollapsed9 = true;
      this.isFacilityPostRoundingCollapsed = true;
      this.isCollapsedForBillingmissingreports = true;
      this.isCollapsedForPatientPowerofAttorneyReport = true;
      this.isCollapsed10 = true;
      this.isCollapsed11 = true;
      this.isCollapsedForFacilityDetailedGDRreports = true;
    } else if (d == "isCollapsed9") {
      this.isCollapsed4 = true;
      this.isCollapsed3 = true;
      this.isCollapsed9 = false;
      this.isFacilityPostRoundingCollapsed = true;
      this.isCollapsedForBillingmissingreports = true;
      this.isCollapsedForPatientPowerofAttorneyReport = true;
      this.isCollapsed10 = true;
      this.isCollapsed11 = true;
      this.isCollapsedForFacilityDetailedGDRreports = true;
    } else if (d == "isCollapsed10") {
      this.isCollapsed4 = true;
      this.isFacilityPostRoundingCollapsed = true;
      this.isCollapsedForBillingmissingreports = true;
      this.isCollapsedForPatientPowerofAttorneyReport = true;
      this.isCollapsed3 = true;
      this.isCollapsed9 = true;
      this.isCollapsed10 = false;
      this.isCollapsed11 = true;
      this.isCollapsedForFacilityDetailedGDRreports = true;
    } else if (d == "isCollapsed11") {
      this.isCollapsed11 = false;
      this.isFacilityPostRoundingCollapsed = true;
      this.isCollapsedForBillingmissingreports = true;
      this.isCollapsedForPatientPowerofAttorneyReport = true;
      this.isCollapsed4 = true;
      this.isCollapsed3 = true;
      this.isCollapsed9 = true;
      this.isCollapsed10 = true;
      this.isCollapsedForFacilityDetailedGDRreports = true;
    } else if (d == "isFacilityPostRoundingCollapsed") {
      this.isCollapsed11 = true;
      this.isFacilityPostRoundingCollapsed = false;
      this.isCollapsedForBillingmissingreports = true;
      this.isCollapsedForPatientPowerofAttorneyReport = true;
      this.isCollapsed4 = true;
      this.isCollapsed3 = true;
      this.isCollapsed9 = true;
      this.isCollapsed10 = true;
      this.isCollapsedForFacilityDetailedGDRreports = true;
    } else if (d == "isCollapsedForBillingmissingreports") {
      this.isCollapsed11 = true;
      this.isFacilityPostRoundingCollapsed = true;
      this.isCollapsedForBillingmissingreports = false;
      this.isCollapsedForPatientPowerofAttorneyReport = true;
      this.isCollapsed4 = true;
      this.isCollapsed3 = true;
      this.isCollapsed9 = true;
      this.isCollapsed10 = true;
      this.isCollapsedForFacilityDetailedGDRreports = true;
    } else if (d == "isCollapsedForPatientPowerofAttorneyReport") {
      this.isCollapsed11 = true;
      this.isFacilityPostRoundingCollapsed = true;
      this.isCollapsedForBillingmissingreports = true;
      this.isCollapsedForPatientPowerofAttorneyReport = false;
      this.isCollapsed4 = true;
      this.isCollapsed3 = true;
      this.isCollapsed9 = true;
      this.isCollapsed10 = true;
      this.isCollapsedForFacilityDetailedGDRreports = true;
    }
    else if (d == "isCollapsedForFacilityDetailedGDRreports") {
      this.isCollapsed11 = true;
      this.isFacilityPostRoundingCollapsed = true;
      this.isCollapsedForBillingmissingreports = true;
      this.isCollapsedForPatientPowerofAttorneyReport = true;
      this.isCollapsed4 = true;
      this.isCollapsed3 = true;
      this.isCollapsed9 = true;
      this.isCollapsed10 = true;
      this.isCollapsedForFacilityDetailedGDRreports = false;
    }
  }
  collapseChild3Function(d) {
    if (d == 'patientSummaryReport') {
      if (this.patientSummaryReport == true) {
        this.patientSummaryReport = false;
      } else {
        this.patientSummaryReport = true;
      }
    }
  }
  // create all form starts
  createpsychotropicReportForm() {
    this.psychotropicReportForm = this.formBuilder.group({
      facility: ['', Validators.required],
      facilityDateFrom: ['', Validators.required],
      facilityDateTo: ['', Validators.required],
    });
  }

  createfacilityPostRoundingReportForm() {
    this.facilityPostRoundingReportForm = this.formBuilder.group({
      facility: ['', Validators.required],
      facilityDateFrom: ['', Validators.required],
      facilityDateTo: ['', Validators.required],
    });
  }

  createPowerOfAttorneyReportForm() {
    this.PowerOfAttorneyReportForm = this.formBuilder.group({
      patient: ['5ffd925d0804bf52c3a15d11', Validators.required],
      facilityDateFrom: ['', Validators.required],
      facilityDateTo: ['', Validators.required],
    });
  }
  createMissingDocumentsReportForm() {
    this.MissingDocumentsReportForm = this.formBuilder.group({
      facility: ['', Validators.required],
      facilityDateFrom: ['', Validators.required],
      facilityDateTo: ['', Validators.required],
    });
  }

  createFacilityDetailedGDRReportForm() {
    this.FacilityDetailedGDRReportForm = this.formBuilder.group({
      facility: ['', Validators.required],
      facilityDateFrom: ['', Validators.required],
      facilityDateTo: ['', Validators.required],
    });
  }

  createsnapShotReportForm() {
    this.snapShotReportForm = this.formBuilder.group({
      facility: ['', Validators.required],
      facilityDateFrom: ['', Validators.required],
      facilityDateTo: ['', Validators.required],
    })
  }

  createproviderPerformanceReportForm() {
    this.providerPerformanceReportForm = this.formBuilder.group({
      facility: ['', Validators.required],
      provider: ['', Validators.required],
      facilityDateFrom: ['', Validators.required],
      facilityDateTo: ['', Validators.required],
    });
  }

  createbriefproviderPerformanceReportForm() {
    this.briefproviderPerformanceReportForm = this.formBuilder.group({
      facility: ['', Validators.required],
      provider: ['', Validators.required],
      facilityDateFrom: ['', Validators.required],
      facilityDateTo: ['', Validators.required],
    });
  }

  createadminPriorReportForm() {
    this.adminPriorReportForm = this.formBuilder.group({
      facility: ['', Validators.required],
      provider: ['', Validators.required],
      facilityDateFrom: ['', Validators.required],
      facilityDateTo: ['', Validators.required],
    });
  }

  createFacilityPatientNumberReportForm() {
    this.facilityPatientNumberReportForm = this.formBuilder.group({
      facility: ['', Validators.required],
      facilityDateFrom: ['', Validators.required],
      facilityDateTo: ['', Validators.required],
    });
  }
  createPatientSummaryReportForm() {
    this.patientSummaryReportForm = this.formBuilder.group({
      facility: ['', Validators.required],
      facilityDateFrom: ['', Validators.required],
      facilityDateTo: ['', Validators.required],
    })
  }
  createfacilityPerformanceReportForm() {
    this.facilityPerformanceReportForm = this.formBuilder.group({
      facility: ['', Validators.required],
      provider: ['', Validators.required],
      facilityDateFrom: ['', Validators.required],
      facilityDateTo: ['', Validators.required],
    });
  }
  // create all froms ends

  // get fields for validation all table starts
  get psychotropicReport() { return this.psychotropicReportForm.controls; }
  get snapShotReport() { return this.snapShotReportForm.controls; }
  get providerPerformanceReport() { return this.providerPerformanceReportForm.controls; }
  get briefproviderPerformanceReport() { return this.briefproviderPerformanceReportForm.controls; }
  get adminpriorReport() { return this.adminPriorReportForm.controls; }
  get facilityPatientNumberReport() { return this.facilityPatientNumberReportForm.controls; }
  get getpatientSummaryReport() { return this.patientSummaryReportForm.controls; }
  get facilityPostRoundingReport() { return this.facilityPostRoundingReportForm.controls; }
  get powerOfAttorneyReport() { return this.PowerOfAttorneyReportForm.controls; }
  get missingDocumentsReport() { return this.MissingDocumentsReportForm.controls; }
  get facilityDetailedGDRReport() { return this.FacilityDetailedGDRReportForm.controls; }
  get facilityPerformanceReport() { return this.facilityPerformanceReportForm.controls; }
  // get field for validation all table ends

  // getting list of facility starts
  getFacility() {
    let token = localStorage.getItem('Token');
    const decodedToken = this.helper.decodeToken(token);
    let role = decodedToken.userRole;
    if (role == "facility-corporate") {
      this.corporateName = decodedToken.name + " " + decodedToken.lastName;
      this.facilityService.getCorporateFacility(this.corporateName).subscribe((data: any) => {
        this.facilitys = data.facilities.filter(function (facility) {
          return facility.activeStatus == true;
        })
      })
    }
    else if (role != "facility") {
      this.facilityService.getAllFacility().subscribe((data: any) => {
        this.facilitys = data.facilities.filter(function (facility) {
          return facility.activeStatus == true;
        })
        if (role == "super-admin" || role == "admin") {
          this.facilitys.push({ facilityName: "all", _id: "all" });
        }
        // }
      }, (err: HttpErrorResponse) => {
        if (err.error.error) {
          this.notifyService.showError(err.error.error, "");
        }
        else if (err.error.msg) {
          this.notifyService.showError(err.error.msg, "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      })
    } else {
      this.facilitys.push({ facilityName: decodedToken.name, _id: decodedToken._id });
    }
  }
  // getting list of facility ends
  // getting list of providers starts

  getProviders() {
    let token = localStorage.getItem('Token');
    const decodedToken = this.helper.decodeToken(token);
    let role = decodedToken.userRole;
    if (role != "provider") {
      this.providerService.getAllProvider().subscribe((data: any) => {
        this.providers = data.providers.filter(function (provider) {
          return provider.activeStatus == true;
        })
        if (role == "super-admin" || role == "admin") {
          this.providers.push({ firstName: "all", _id: "all" });
        }
      }, (err: HttpErrorResponse) => {
        if (err.error.error) {
          this.notifyService.showError(err.error.error, "");
        }
        else if (err.error.msg) {
          this.notifyService.showError(err.error.msg, "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      })
    } else {
      this.providers.push({ firstName: decodedToken.name, _id: decodedToken._id });
    }
  }
  // getting list of provider ends

  // submit form to get report data starts
  psychotropicReportsubmitForm() {
    this.formSubmitted = true;
    if (this.psychotropicReportForm.invalid) { return; }
    this.reportsService.psychotropicReport(this.psychotropicReportForm.value).subscribe((data: any) => {
      const modalRef = this.modalService.open(FacilityPsychotropicNumberReportComponent, { windowClass: "myCustomModalClass" });
      modalRef.componentInstance.reportData = data.reportData;
      modalRef.componentInstance.inputData = this.psychotropicReportForm.value;
      modalRef.result.then((result) => {
        this.ngOnInit();
      }).catch((error) => {
        if (error == 'Cross click' || error == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }
  providerPerformanceReportsubmitForm() {
    this.formSubmitted1 = true;
    if (this.providerPerformanceReportForm.invalid) { return; }
    this.reportsService.providerPerformanceReport(this.providerPerformanceReportForm.value).subscribe((data: any) => {
      const modalRef = this.modalService.open(ProviderPerformanceReportComponent, { windowClass: "myCustomModalFullClass" });
      modalRef.componentInstance.reportData = data.report;
      modalRef.componentInstance.inputData = this.providerPerformanceReportForm.value;
      modalRef.result.then((result) => {
        this.ngOnInit();
      }).catch((error) => {
        if (error == 'Cross click' || error == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }
  briefproviderPerformanceReportsubmitForm() {
    this.formSubmitted2 = true;
    if (this.briefproviderPerformanceReportForm.invalid) { return; }
    this.reportsService.briefproviderPerformanceReport(this.briefproviderPerformanceReportForm.value).subscribe((data: any) => {
      const modalRef = this.modalService.open(BriefProviderPerformanceReportComponent, { windowClass: "myCustomModalClass" });
      modalRef.componentInstance.reportData = data.report;
      modalRef.componentInstance.inputData = this.briefproviderPerformanceReportForm.value;
      modalRef.result.then((result) => {
        this.ngOnInit();
      }).catch((error) => {
        if (error == 'Cross click' || error == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }
  adminPriorAuthReportsubmitForm() {
    this.formSubmitted3 = true;
    if (this.adminPriorReportForm.invalid) { return; }
    this.reportsService.adminPriorAuthReport(this.adminPriorReportForm.value).subscribe((data: any) => {
      const modalRef = this.modalService.open(AdminPriorAuthReportComponent, { windowClass: "myCustomModalClass" });
      modalRef.componentInstance.reportData = data.report;
      modalRef.componentInstance.inputData = this.adminPriorReportForm.value;
      modalRef.result.then((result) => {
        this.ngOnInit();
      }).catch((error) => {
        if (error == 'Cross click' || error == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }

  submitFacilityPostRoundingReportForm() {
    this.formSubmittedForfacilityPostRounding = true;
    if (this.facilityPostRoundingReportForm.invalid) { return; }
    this.reportsService.getFacilityPostRoundingReport(this.facilityPostRoundingReportForm.value).subscribe((data: any) => {
      const modalRef = this.modalService.open(FacilityPostRoundingReportComponent, { windowClass: "myCustomModalClass" });
      modalRef.componentInstance.reportData = data.patients;
      modalRef.componentInstance.inputData = this.facilityPostRoundingReportForm.value;
      modalRef.result.then((result) => {
        this.ngOnInit();
      }).catch((error) => {
        if (error == 'Cross click' || error == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }

  submitPowerOfAttorneyReportForm() {
    this.formSubmittedForPowerOfAttorneyReport = true;
    if (this.PowerOfAttorneyReportForm.invalid) { return; }
    this.reportsService.getPowerOfAttorneyReport(this.PowerOfAttorneyReportForm.value).subscribe((data: any) => {
      const modalRef = this.modalService.open(PatientPowerOfAttorneyReportComponent, { windowClass: "myCustomModalClass" });
      modalRef.componentInstance.reportData = data.patients;
      modalRef.componentInstance.inputData = this.PowerOfAttorneyReportForm.value;
      modalRef.result.then((result) => {
        this.ngOnInit();
      }).catch((error) => {
        if (error == 'Cross click' || error == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }

  submitMissingDocumentsReportForm() {
    this.formSubmittedForMissingDocumentsReport = true;
    if (this.MissingDocumentsReportForm.invalid) { return; }
    this.reportsService.getMissingDocumentsReport(this.MissingDocumentsReportForm.value).subscribe((data: any) => {
      const modalRef = this.modalService.open(BillingCompanyMissingDocumentsReportsComponent, { windowClass: "myCustomModalClass" });
      modalRef.componentInstance.reportData = data.patients;
      modalRef.componentInstance.inputData = this.MissingDocumentsReportForm.value;
      modalRef.result.then((result) => {
        this.ngOnInit();
      }).catch((error) => {
        if (error == 'Cross click' || error == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }

  submitFacilityDetailedGDRReportForm() {
    this.formSubmittedForFacilityDetailedGDRReport = true;
    if (this.FacilityDetailedGDRReportForm.invalid) { return; }
    this.reportsService.getFacilityDetailedGDRReport(this.FacilityDetailedGDRReportForm.value).subscribe((data: any) => {
      const modalRef = this.modalService.open(FacilityDetailedGdrReportComponent, { windowClass: "myCustomModalClass" });
      modalRef.componentInstance.reportData = data.report;
      modalRef.componentInstance.inputData = this.FacilityDetailedGDRReportForm.value;
      modalRef.result.then((result) => {
        this.ngOnInit();
      }).catch((error) => {
        if (error == 'Cross click' || error == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }

  facilityPatientNumberReportsubmitForm() {
    this.formSubmitted4 = true;
    if (this.facilityPatientNumberReportForm.invalid) { return; }
    this.reportsService.getPatientsForFacilityPatientsNumberReport(this.facilityPatientNumberReportForm.value).subscribe((data: any) => {
      this.patients = data.patients;
      if (this.patients.length > 1) {
        this.patients.unshift({ firstName: "all", dob: null, _id: "all" });
      }
      this.modalService.open(this.content1, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      }, (reason) => {
        if (reason == 'Cross click' || reason == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }

  patientSummaryReportSubmitForm() {
    this.formSubmittedPatientSummaryReport = true;
    if (this.patientSummaryReportForm.invalid) { return; }
    this.reportsService.getPatientsForFacilityPatientsNumberReport(this.patientSummaryReportForm.value).subscribe((data: any) => {
      this.patients = data.patients;
      if (this.patients.length > 1) {
        this.patients.unshift({ firstName: "all", dob: null, _id: "all" });
      }
      this.modalService.open(this.content3, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      }, (reason) => {
        if (reason == 'Cross click' || reason == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }


  decideForRecords(patient) {
    let formValue;
    this.finalFacilityBillingCompanyPatientReports(patient);

  }
  decideForRecords2(patient) {
    let formValue;
    this.finalSnapShotReports(patient);
  }
  decideForRecords3(patient) {
    let formValue;
    this.finalPatientSummaryReport(patient);
  }
  finalSnapShotReports(patient) {
    this.reportsService.getFinalSnapShotReport(patient._id, this.patients, this.snapShotReportForm.value).subscribe((data: any) => {
      const modalRef = this.modalService.open(FacilitySnapShotReportComponent, { windowClass: "myCustomModalClass" });
      modalRef.componentInstance.reportData = data.output;
      modalRef.componentInstance.inputData = this.snapShotReportForm.value;
      modalRef.result.then((result) => {
        this.ngOnInit();
      }).catch((error) => {
        if (error == 'Cross click' || error == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }
  finalFacilityBillingCompanyPatientReports(patient) {
    this.reportsService.getFinalPatientsForFacilityPatientsNumberReport(patient._id, this.patients, this.facilityPatientNumberReportForm.value).subscribe((data: any) => {
      const modalRef = this.modalService.open(FacilityCompanyPatientNotesReportComponent, { windowClass: "myCustomModalClass" });
      modalRef.componentInstance.reportData = data.output;
      modalRef.componentInstance.inputData = this.facilityPatientNumberReportForm.value;
      modalRef.result.then((result) => {
        this.ngOnInit();
      }).catch((error) => {
        if (error == 'Cross click' || error == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }
  snapShotReportsubmitForm() {
    this.formSubmitted5 = true;
    if (this.snapShotReportForm.invalid) { return; }
    this.reportsService.getPatientsForFacilityPatientsNumberReport(this.snapShotReportForm.value).subscribe((data: any) => {
      this.patients = data.patients;
      if (this.patients.length > 1) {
        this.patients.unshift({ firstName: "all", dob: null, _id: "all" });
      }
      this.modalService.open(this.content2, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      }, (reason) => {
        if (reason == 'Cross click' || reason == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }
  facilityPerformanceReportsubmitForm() {
    this.formSubmitted6 = true;
    if (this.facilityPerformanceReportForm.invalid) { return; }
    this.reportsService.facilityPerformanceReport(this.facilityPerformanceReportForm.value).subscribe((data: any) => {
      const modalRef = this.modalService.open(FacilityPracticePerformanceReportComponent, { windowClass: "myCustomModalFullClass" });
      modalRef.componentInstance.reportData = data.report;
      modalRef.componentInstance.inputData = this.facilityPerformanceReportForm.value;
      modalRef.result.then((result) => {
        this.ngOnInit();
      }).catch((error) => {
        if (error == 'Cross click' || error == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }
  finalPatientSummaryReport(patient) {
    this.reportsService.getFinalPatientSummaryReport(patient._id, this.patients, this.patientSummaryReportForm.value).subscribe((data: any) => {
      const modalRef = this.modalService.open(PatientSummaryReportComponent, { windowClass: "myCustomModalClass" });
      modalRef.componentInstance.reportData = data.output;
      modalRef.componentInstance.inputData = this.patientSummaryReportForm.value;
      modalRef.result.then((result) => {
        this.ngOnInit();
      }).catch((error) => {
        if (error == 'Cross click' || error == 0) {
          this.notifyService.showInfo("Form Closed", "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }
  // submit form to get report data ends

  // update dropdown values for every form starts
  updatepsychotropicReportForm(e, value) {
    this.psychotropicReportForm.get(value).setValue(e, {
      onlySelf: true
    })
  }
  updatesnapShotReportForm(e, value) {
    this.snapShotReportForm.get(value).setValue(e, {
      onlySelf: true
    })
  }
  updateproviderPerformanceReport(e, value) {
    this.providerPerformanceReportForm.get(value).setValue(e, {
      onlySelf: true
    })
  }
  updatebriefproviderPerformanceReport(e, value) {
    this.briefproviderPerformanceReportForm.get(value).setValue(e, {
      onlySelf: true
    })
  }
  updateadminPriorReport(e, value) {
    this.adminPriorReportForm.get(value).setValue(e, {
      onlySelf: true
    })
  }
  updatefacilityPatientNumberReportsubmitForm(e, value) {
    this.facilityPatientNumberReportForm.get(value).setValue(e, {
      onlySelf: true
    })
  }
  updatefacilityPerformanceReport(e, value) {
    this.facilityPerformanceReportForm.get(value).setValue(e, {
      onlySelf: true
    })
  }
  updatePatientSummaryReport(e, value) {
    this.patientSummaryReportForm.get(value).setValue(e, {
      onlySelf: true
    })
  }
  // update dropdown values for every form ends
  // pageChanged(event) {
  //   this.config.currentPage = event;
  //   if (this.searching == false) {
  //     this.patientService.getAllPatient(event).subscribe((data: any) => {
  //       this.patients = data.patients;
  //       this.config = {
  //         itemsPerPage: 10,
  //         currentPage: event,
  //         totalItems: data.totalItems
  //       };
  //     }, (err: HttpErrorResponse) => {
  //       if (err.error.error) {
  //         this.notifyService.showError(err.error.error, "");
  //       }
  //       else if (err.error.msg) {
  //         this.notifyService.showError(err.error.msg, "");
  //       } else {
  //         this.notifyService.showError("Something went wrong", "");
  //       }
  //     })
  //   } else {
  //     this.patientService.searchPatient(this.searchTerm, event).subscribe((data: any) => {
  //       this.patients = data.patients;
  //       this.config = {
  //         itemsPerPage: 10,
  //         currentPage: event,
  //         totalItems: data.totalItems
  //       };
  //     }, err => {
  //       this.notifyService.showError("", err);
  //     })
  //   }
  // }

}
