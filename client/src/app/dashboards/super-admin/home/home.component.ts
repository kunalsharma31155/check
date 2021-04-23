import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { DataTransferService } from '../../../services/data-transfer.service';
import { UserAccessService } from '../../../services/user-access.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('content1', { static: true }) content1: TemplateRef<any>;
  clickEventsubscription: Subscription;
  totalPatients = 80;
  totalFacility = 53;
  totalProvider = 25;
  form: FormGroup;
  submitted = false;
  userAccessData;
  activeTab = "2";
  permission;

  constructor(private modalService: NgbModal,
    private userAccess: UserAccessService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private dataTransferService: DataTransferService) {
    this.clickEventsubscription = this.dataTransferService.getClickEvent().subscribe(() => {
      this.openModal();
    })
  }

  ngOnInit() {
    this.createForm("");
    this.getuserAccess();
  }

  getuserAccess() {
    this.userAccess.getSpecificUserAccess().subscribe((res: any) => {
      this.permission = res.result;
    })
  }

  createForm(data) {
    this.form = this.formBuilder.group({
      userRole: [data.userRole, Validators.required],
      userRoleId: [data.userRoleId, Validators.required],
      admin: [data.admin],
      dataentry: [data.dataentry],
      reports: [data.reports],
      createSuperAdmin: [data.createSuperAdmin],
      createAdmin: [data.createAdmin],
      createOtherUser: [data.createOtherUser],
      createFacility: [data.createFacility],
      createPatient: [data.createPatient],
      createProvider: [data.createProvider],
      patientDataEntry: [data.patientDataEntry],
      postRoundingDataEntry: [data.postRoundingDataEntry],
      providerReport: [data.providerReport],
      facilityReport: [data.facilityReport],
      adminReport: [data.adminReport],
      facilityPsychotorpicNo: [data.facilityPsychotorpicNo],
      providerPerformanceReportDetail: [data.providerPerformanceReportDetail],
      briefProviderPerformanceReportDetail: [data.briefProviderPerformanceReportDetail],
      adminPriorAuthReport: [data.adminPriorAuthReport],
      facilityPostRoundingReport: [data.facilityPostRoundingReport],
      facilityPsychotropicNumberReport: [data.facilityPsychotropicNumberReport],
      billingCompanyPatientNotesReport: [data.billingCompanyPatientNotesReport],
      facilitySnapSHotReport: [data.facilitySnapSHotReport],
      facilityPracticePerformanceReport: [data.facilityPracticePerformanceReport],
      powerOfAttorneyReport: [data.powerOfAttorneyReport],
      billingCompanyMissingDocumentsReport: [data.billingCompanyMissingDocumentsReport],
      patientSummaryReport: [data.patientSummaryReport],
      patientReport: [data.patientReport],
      facilityDetailedGDRReport: [data.facilityDetailedGDRReport]
    })
  }

  showActiveTabId(a) {
    this.createForm(this.userAccessData[a - 1]);
  }

  openModal() {
    this.getUserAccess();
    this.modalService.open(this.content1, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
    }, (reason) => {
    });
  }

  getUserAccess() {
    this.userAccess.getAllUsersAccess().subscribe((res: any) => {
      this.userAccessData = res.result;
      this.showActiveTabId("2");
    })
  }

  submitForm() {
    this.submitted = true;
    if (this.form.invalid) { return; }
    this.userAccess.updateUserAccess(this.form.value).subscribe((res) => {
      this.notificationService.showSuccess("", "Update Successfully");
    })
  }

}
