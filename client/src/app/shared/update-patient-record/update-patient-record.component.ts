import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { JwtHelperService } from "@auth0/angular-jwt";
import * as _ from "lodash";

import { NotificationService } from '../../services/notification.service';
import { PatientService } from '../../services/patient.service';
import { UserService } from '../../services/user.service';
import { ProviderService } from '../../services/provider.service';
import { requiredFileType, uploadProgress, toResponseBody, markAllAsDirty, toFormData, toFormDataForCollection } from '../file-upload/upload-file-validators';
import { ReportsService } from '../../services/reports.service';


interface Item {
  name: string;
  value: string;
}

@Component({
  selector: 'app-update-patient-record',
  templateUrl: './update-patient-record.component.html',
  styleUrls: ['./update-patient-record.component.scss']
})
export class UpdatePatientRecordComponent implements OnInit {
  @Input() selectedPatient: any;
  patientName;
  progress = 0;
  patientForm: FormGroup;
  formSubmitted = false;
  facilitys = [];
  providers = [];
  providersCopy = [];
  typeOfServices: Array<any> = ['Med Management', 'Psychotherapy', 'Scale Management'];
  helper = new JwtHelperService();

  selectedMeds: [string];
  medChangesOption = [{ name: "Start", value: "start" },
  { name: "Increase", value: "increase" },
  { name: "Decrease", value: "decrease" },
  { name: "Stop", value: "stop" }] as Item[];
  meds: any = ["Nuedexta", "Nuplazid", "Austedo", "Ingrezza", "Caplyta", "Secuado", "Invega", "Genesight"];
  psychologicalTest: any = ["PHQ9", "MMSE", "GAD7","PANSS", "GDS", "BIMS", "SLUMS", "MOCA", "NPIQ", "BTQ", "PCL", "BSDS", "ISI", "AIMS","MIS"];
  cognitiveAssessmentTest: any = ["BIMS", "MOCA", "NPIQ"];
  // cptCode = ["90792", "90791", "99307", "99308", "99309", "99310", "99334", "99335", "99336", "99337", "90832", "90834", "90837", "99483", "99484", "9999999"];
  cptCode = [];
  medCount = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private User: UserService,
    private router: Router,
    private notifyService: NotificationService,
    private patientService: PatientService,
    private providerService: ProviderService,
    private SpinnerService: NgxSpinnerService,
    private reportsService: ReportsService) { }

  ngOnInit() {
    this.getLoggedInUser();
    this.getFacility();
    this.getProviders();
    this.getCPTCode();
    this.getApiUrl();
    this.patientName = this.selectedPatient.firstName;
    console.log(this.patientName);
    console.log(this.selectedPatient);
    if (this.selectedPatient.dateOfService == undefined) {
      this.createForm();
      this.selectedMedChanges();
    } else {
      this.editForm();
    }
  }

  getCPTCode() {
    this.patientService.getCptCode().subscribe((res: any) => {
      this.cptCode = res.cpt;
    })
  }

  savedByName;
  savedById;
  getLoggedInUser() {
    let token = localStorage.getItem('Token');
    const decodedToken = this.helper.decodeToken(token);
    this.savedByName = decodedToken.name;
    this.savedById = decodedToken._id;
  }

  getFacility() {
    this.patientService.getAllFacility().subscribe((data: any) => {
      this.facilitys = data.facilities.filter(function (facility) {
        return facility.activeStatus == true;
      })

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

  getProviders() {
    this.providerService.getAllProvider().subscribe((data: any) => {
      // this.providers, this.providersCopy = data.providers.filter(function (provider) {
      //   return provider.activeStatus == true;
      // });
      this.providers = data.providers.filter(function (provider) {
        return provider.activeStatus == true;
      });
      // why
      // this.providersCopy = data.providers.filter(function(provider) {
      //   return provider.activeStatus == true ;
      // });
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

  apiUrl;
  getApiUrl() {
    this.apiUrl = this.reportsService.getApiUrl();
  }

  editForm() {
    for (var key in this.selectedPatient) {
      if (this.selectedPatient.hasOwnProperty(key)) {
        if (this.selectedPatient[key] == "true") {
          this.selectedPatient[key] = true;
        } else if (this.selectedPatient[key] == "false") {
          this.selectedPatient[key] = false;
        }
      }
    }
    this.patientForm = this.formBuilder.group({
      parentId: [this.selectedPatient.parentId],
      dateOfService: [formatDate(this.selectedPatient.dateOfService, 'yyyy-MM-dd', 'en'), Validators.required],
      patientFacility: [this.selectedPatient.patientFacility],
      typeOfService: [this.selectedPatient.typeOfService],
      patientProvider: [this.selectedPatient.patientProvider],
      patientFacilityId: [this.selectedPatient.patientFacilityId],
      patientProviderId: [this.selectedPatient.patientProviderId],
      patientTrauma: [Boolean(this.selectedPatient.patientTrauma)],
      patientNewTrauma: [this.selectedPatient.patientNewTrauma],
      patientPainAssessment: [this.selectedPatient.patientPainAssessment],
      patientNewPainAssessment: [this.selectedPatient.patientNewPainAssessment],
      noGDR: [this.selectedPatient.noGDR],
      noGDRComment: [this.selectedPatient.noGDRComment],
      didGDR: [this.selectedPatient.didGDR],
      didGDRComment: [this.selectedPatient.didGDRComment],
      failedGDR: [this.selectedPatient.failedGDR],
      failedGDRComment: [this.selectedPatient.failedGDRComment],
      patientUnstableCheck: [this.selectedPatient.patientUnstableCheck],
      patientUnstable: [this.selectedPatient.patientUnstable],
      patientUnstableMedCheck: [this.selectedPatient.patientUnstableMedCheck],
      patientpsychotherapy: [this.selectedPatient.patientpsychotherapy],
      patientAssessedCapacity: [this.selectedPatient.patientAssessedCapacity],
      patientAssessedCapacityComment: [this.selectedPatient.patientAssessedCapacityComment],
      patientMedChanges: [this.selectedPatient.patientMedChanges],
      patientMedChangesCount: [this.selectedPatient.patientMedChangesCount],
      patientSelectedMedChanges: this.formBuilder.array([]),
      patientSelectedMedChangesStart: this.formBuilder.array([]),
      patientSelectedMedChangesIncrease: this.formBuilder.array([]),
      patientSelectedMedChangesDecrease: this.formBuilder.array([]),
      patientSelectedMedChangesStop: this.formBuilder.array([]),
      patientDischargedPT: [this.selectedPatient.patientDischargedPT],
      patientDischargedComment: [this.selectedPatient.patientDischargedComment],
      patientPriorAuthCheck: [this.selectedPatient.patientPriorAuthCheck],
      patientPriorAuth: [this.selectedPatient.patientPriorAuth],
      patientOrderedLabsCheck: [this.selectedPatient.patientOrderedLabsCheck],
      patientOrderedLabs: [this.selectedPatient.patientOrderedLabs],
      patientPsychologicalTesting: [this.selectedPatient.patientPsychologicalTesting],
      patientPsychologicalTestingName: this.formBuilder.array([]),
      patientPsychologicalTestingScore: this.formBuilder.array([]),
      performedCognitiveAssessmentTest: [this.selectedPatient.performedCognitiveAssessmentTest],
      performedCognitiveAssessmentTestName: this.formBuilder.array([]),
      performedCognitiveAssessmentTestScore: this.formBuilder.array([]),
      patientCorrectedDDXCheck: [this.selectedPatient.patientCorrectedDDXCheck],
      patientCorrectedDDX: [this.selectedPatient.patientCorrectedDDX],
      patientReferToCheck: [this.selectedPatient.patientReferToCheck],
      patientReferTo: [this.selectedPatient.patientReferTo],
      patientDepressiveDisorderDx: [this.selectedPatient.patientDepressiveDisorderDx],
      patientDepressiveDisorderDxDuration: [this.selectedPatient.patientDepressiveDisorderDxDuration],
      patientCognitiveImpairmentDx: [this.selectedPatient.patientCognitiveImpairmentDx],
      patientCognitiveImpairmentDxDuration: [this.selectedPatient.patientCognitiveImpairmentDxDuration],
      initiatedBakerAct: [this.selectedPatient.initiatedBakerAct],
      cptCode: [this.selectedPatient.cptCode, Validators.required],
      sitter1to1: [this.selectedPatient.sitter1to1],
      startedOrRemoved1to1Sitter: [this.selectedPatient.startedOrRemoved1to1Sitter],
      image: new FormControl(null, []),
      patientSummary: [this.selectedPatient.patientSummary],
      softDeleted: [this.selectedPatient.softDeleted],
      document: [this.selectedPatient.document],
      savedByName: [this.savedByName],
      savedById: [this.savedById],
    });
    this.editCognitiveAssessmentTest(this.selectedPatient.performedCognitiveAssessmentTestName, this.selectedPatient.performedCognitiveAssessmentTestScore);
    this.editPsychologicalTesting(this.selectedPatient.patientPsychologicalTestingName, this.selectedPatient.patientPsychologicalTestingScore);
    this.editselectedMedChanges(this.selectedPatient.patientSelectedMedChanges);
    this.editStart(this.selectedPatient.patientSelectedMedChangesStart);
    this.editIncrease(this.selectedPatient.patientSelectedMedChangesIncrease);
    this.editDecrease(this.selectedPatient.patientSelectedMedChangesDecrease);
    this.editStop(this.selectedPatient.patientSelectedMedChangesStop);
  }

  Ddx = false;
  Cdx = false;
  createForm() {
    if (this.selectedPatient.patientTestData > 0) {
      if (this.selectedPatient.patientTestData[this.selectedPatient.patientTestData.length - 1].patientDepressiveDisorderDx == "true") {
        this.Ddx = true;
      } else {
        this.Ddx = false;
      }
      if (this.selectedPatient.patientTestData[this.selectedPatient.patientTestData.length - 1].patientCognitiveImpairmentDx == "true") {
        this.Cdx = true;
      } else {
        this.Cdx = false;
      }
    }
    this.patientForm = this.formBuilder.group({
      parentId: [this.selectedPatient._id],
      dateOfService: [null, Validators.required],
      patientFacility: [this.selectedPatient.patientFacility],
      typeOfService: [],
      patientProvider: [this.selectedPatient.patientProvider],
      patientFacilityId: [this.selectedPatient.patientFacilityId],
      patientProviderId: [this.selectedPatient.patientProviderId],
      patientTrauma: [true],
      patientNewTrauma: [''],
      patientPainAssessment: [true],
      patientNewPainAssessment: [''],
      noGDR: [false],
      noGDRComment: [],
      didGDR: [false],
      didGDRComment: [],
      failedGDR: [false],
      failedGDRComment: [],
      patientUnstableCheck: [false],
      patientUnstable: [''],
      patientUnstableMedCheck: [],
      patientpsychotherapy: [false],
      patientAssessedCapacity: [false],
      patientAssessedCapacityComment: [],
      patientMedChanges: [false],
      patientMedChangesCount: [''],
      patientSelectedMedChanges: this.formBuilder.array([]),
      patientSelectedMedChangesStart: this.formBuilder.array([this.formBuilder.group({ patientSelectedMedChangesStart: '' })]),
      patientSelectedMedChangesIncrease: this.formBuilder.array([this.formBuilder.group({ patientSelectedMedChangesIncrease: '' })]),
      patientSelectedMedChangesDecrease: this.formBuilder.array([this.formBuilder.group({ patientSelectedMedChangesDecrease: '' })]),
      patientSelectedMedChangesStop: this.formBuilder.array([this.formBuilder.group({ patientSelectedMedChangesStop: '' })]),
      patientDischargedPT: [false],
      patientDischargedComment: [''],
      patientPriorAuthCheck: [false],
      patientPriorAuth: [''],
      patientOrderedLabsCheck: [false],
      patientOrderedLabs: [''],
      patientPsychologicalTesting: [false],
      patientPsychologicalTestingName: this.formBuilder.array([this.formBuilder.group({ patientPsychologicalTestingName: '' })]),
      patientPsychologicalTestingScore: this.formBuilder.array([this.formBuilder.group({ patientPsychologicalTestingScore: '' })]),
      performedCognitiveAssessmentTest: [false],
      performedCognitiveAssessmentTestName: this.formBuilder.array([this.formBuilder.group({ performedCognitiveAssessmentTestName: '' })]),
      performedCognitiveAssessmentTestScore: this.formBuilder.array([this.formBuilder.group({ performedCognitiveAssessmentTestScore: '' })]),
      patientCorrectedDDXCheck: [false],
      patientCorrectedDDX: [''],
      patientReferToCheck: [false],
      patientReferTo: [''],
      patientDepressiveDisorderDx: [this.Ddx],
      patientDepressiveDisorderDxDuration: [],
      patientCognitiveImpairmentDx: [this.Cdx],
      patientCognitiveImpairmentDxDuration: [],
      initiatedBakerAct: [false],
      cptCode: ['', Validators.required],
      sitter1to1: [false],
      startedOrRemoved1to1Sitter: [],
      // removed1to1Sitter: [false],
      image: new FormControl(null, []),
      patientSummary: [''],
      softDeleted: [false],
      savedByName: [this.savedByName],
      savedById: [this.savedById]
    });


  }

  editselectedMedChanges(changes) {
    this.medChangesOption.forEach((item: Item, i) => {
      let fg = this.formBuilder.group({});
      for (var k in changes[i]) {
        fg.addControl(this.medChangesOption[i].name, this.formBuilder.control(changes[i][k]));
      }
      this.ff.push(fg);
    });
  }

  selectedMedChanges() {
    this.medChangesOption.forEach((item: Item, i) => {
      let fg = this.formBuilder.group({});
      fg.addControl(this.medChangesOption[i].name, this.formBuilder.control(false));
      this.ff.push(fg);
    });
  }

  get f() { return this.patientForm.controls; }
  get ff() { return this.patientForm.get("patientSelectedMedChanges") as FormArray; }
  get fff() { return (this.patientForm.get("patientSelectedMedChanges") as FormArray).controls; }
  get cpt() { return this.patientForm.get('cptCode'); }

  get medStart() { return this.patientForm.get('patientSelectedMedChangesStart') as FormArray; }
  get medIncrease() { return this.patientForm.get('patientSelectedMedChangesIncrease') as FormArray; }
  get medDecrease() { return this.patientForm.get('patientSelectedMedChangesDecrease') as FormArray; }
  get medStop() { return this.patientForm.get('patientSelectedMedChangesStop') as FormArray; }
  get PsychologicalTestingName() { return this.patientForm.get('patientPsychologicalTestingName') as FormArray; }
  get PsychologicalTestingScore() { return this.patientForm.get('patientPsychologicalTestingScore') as FormArray; }
  get CognitiveAssessmentTestName() { return this.patientForm.get('performedCognitiveAssessmentTestName') as FormArray; }
  get CognitiveAssessmentTestScore() { return this.patientForm.get('performedCognitiveAssessmentTestScore') as FormArray; }

  summary
  createSummary() {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(this.patientForm.value.dateOfService)
    let dd = [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-');
    this.summary = "Date Of Service : " + dd + "; Facility : " + this.patientForm.value.patientFacility +
      "; Provider : " + this.patientForm.value.patientProvider;
    if (this.patientForm.value.patientDepressiveDisorderDx == true) { this.summary = this.summary + "; Patient Has Depressive Disorder Dx : " + this.patientForm.value.patientDepressiveDisorderDxDuration }
    if (this.patientForm.value.patientCognitiveImpairmentDx == true) { this.summary = this.summary + "; Patient Has Cognitive Impairment Dx : " + this.patientForm.value.patientCognitiveImpairmentDxDuration }
    if (this.patientForm.value.patientTrauma == true) { this.summary = this.summary + "; Performed Trauma Assessment : " + this.patientForm.value.patientNewTrauma }
    if (this.patientForm.value.patientPainAssessment == true) { this.summary = this.summary + "; Performed Pain Assessment : " + this.patientForm.value.patientNewPainAssessment }
    if (this.patientForm.value.noGDR == true) { this.summary = this.summary + "; No GDR : " + this.patientForm.value.noGDRComment }
    if (this.patientForm.value.didGDR == true) { this.summary = this.summary + "; Did GDR : " + this.patientForm.value.didGDRComment }
    if (this.patientForm.value.failedGDR == true) { this.summary = this.summary + "; Failed GDR : " + this.patientForm.value.failedGDRComment }
    if (this.patientForm.value.patientUnstableCheck == true) { this.summary = this.summary + "; Patient Unstable : " + this.patientForm.value.patientUnstableMedCheck + " , " + this.patientForm.value.patientUnstable }
    if (this.patientForm.value.patientpsychotherapy == true) { this.summary = this.summary + "; Did Psychotherapy" }
    if (this.patientForm.value.patientAssessedCapacity == true) { this.summary = this.summary + "; Assessed Capacity : " + this.patientForm.value.patientAssessedCapacityComment }
    if (this.patientForm.value.patientMedChanges == true) {
      this.summary = this.summary + "; Patient Med Changes : Continues Med " + this.patientForm.value.patientMedChangesCount + " ,  [";
      if (this.patientForm.value.patientSelectedMedChangesStart[0].patientSelectedMedChangesStart != "") {
        this.summary = this.summary + "Start - ( ";
        for (let k = 0; k < this.patientForm.value.patientSelectedMedChangesStart.length; k++) {
          this.summary = this.summary + this.patientForm.value.patientSelectedMedChangesStart[k].patientSelectedMedChangesStart + ",";
        }
        this.summary = this.summary + "),"
      }

      if (this.patientForm.value.patientSelectedMedChangesIncrease[0].patientSelectedMedChangesIncrease != "") {
        this.summary = this.summary + "Increase - ( ";
        for (let k = 0; k < this.patientForm.value.patientSelectedMedChangesIncrease.length; k++) {
          this.summary = this.summary + this.patientForm.value.patientSelectedMedChangesIncrease[k].patientSelectedMedChangesIncrease + ",";
        }
        this.summary = this.summary + "),"
      }

      if (this.patientForm.value.patientSelectedMedChangesDecrease[0].patientSelectedMedChangesDecrease != "") {
        this.summary = this.summary + "Decrease - ( ";
        for (let k = 0; k < this.patientForm.value.patientSelectedMedChangesDecrease.length; k++) {
          this.summary = this.summary + this.patientForm.value.patientSelectedMedChangesDecrease[k].patientSelectedMedChangesDecrease + ",";
        }
        this.summary = this.summary + "),"
      }

      if (this.patientForm.value.patientSelectedMedChangesStop[0].patientSelectedMedChangesStop != "") {
        this.summary = this.summary + "Stop - ( ";
        for (let k = 0; k < this.patientForm.value.patientSelectedMedChangesStop.length; k++) {
          this.summary = this.summary + this.patientForm.value.patientSelectedMedChangesStop[k].patientSelectedMedChangesStop + ",";
        }
        this.summary = this.summary + "),"
      }
      this.summary = this.summary + "]";
    }
    if (this.patientForm.value.patientDischargedPT == true) { this.summary = this.summary + "; Patient Discharge : " + this.patientForm.value.patientDischargedComment }
    if (this.patientForm.value.patientPsychologicalTesting == true) {
      this.summary = this.summary + ", Perform Psychological Testing : [";
      for (let i = 0; i < this.patientForm.value.patientPsychologicalTestingName.length; i++) {
        this.summary = this.summary + "(" + this.patientForm.value.patientPsychologicalTestingName[i].patientPsychologicalTestingName + " - " + this.patientForm.value.patientPsychologicalTestingScore[i].patientPsychologicalTestingScore + ")";
      }
      this.summary = this.summary + "]"
    }
    if (this.patientForm.value.performedCognitiveAssessmentTest == true) {
      this.summary = this.summary + ", Performed Cognitive Assessment : [";
      for (let i = 0; i < this.patientForm.value.performedCognitiveAssessmentTestName.length; i++) {
        this.summary = this.summary + "(" + this.patientForm.value.performedCognitiveAssessmentTestName[i].performedCognitiveAssessmentTestName + " - " + this.patientForm.value.performedCognitiveAssessmentTestScore[i].performedCognitiveAssessmentTestScore + ")";
      }
      this.summary = this.summary + "]"
    }
    if (this.patientForm.value.patientPriorAuthCheck == true) { this.summary = this.summary + "; Initiated Prior Auth : " + this.patientForm.value.patientPriorAuth }
    if (this.patientForm.value.patientOrderedLabsCheck == true) { this.summary = this.summary + "; Patient Ordered Labs : " + this.patientForm.value.patientOrderedLabs }
    if (this.patientForm.value.patientCorrectedDDXCheck == true) { this.summary = this.summary + "; Corrected DX : " + this.patientForm.value.patientCorrectedDDX }
    if (this.patientForm.value.patientReferToCheck == true) { this.summary = this.summary + "; Referred Patient To : " + this.patientForm.value.patientReferTo }
    if (this.patientForm.value.initiatedBakerAct == true) { this.summary = this.summary + "; Initiated Baker Act" }
    if (this.patientForm.value.cptCode) { this.summary = this.summary + "; CPT Code : " + this.patientForm.value.cptCode }
    if (this.patientForm.value.sitter1to1 == true) { this.summary = this.summary + "; 1:1 sitter : " + this.patientForm.value.startedOrRemoved1to1Sitter }
    return this.summary;
  }

  async submitForm() {
    let id1;
    let id2;
    let value1 = this.patientForm.value.patientProvider;
    let value2 = this.patientForm.value.patientFacility;
    await this.providers.forEach(function (item) {
      if (item.firstName == value1) {
        id1 = item._id;
      }
    })
    this.patientForm.value.patientProviderId = id1;
    await this.facilitys.forEach(function (item) {
      if (item.facilityName == value2) {
        id2 = item._id;
      }
    })
    this.patientForm.value.patientFacilityId = id2;
    this.formSubmitted = true;
    if (this.patientForm.invalid) { return; }
    this.SpinnerService.show();
    let summary = await this.createSummary();
    this.patientForm.value.patientSummary = summary;
    if (this.patientForm.value.patientSelectedMedChanges.length <= 0 || this.patientForm.value.patientSelectedMedChangesDecrease <= 0 ||
      this.patientForm.value.patientSelectedMedChangesIncrease <= 0 || this.patientForm.value.patientSelectedMedChangesStart <= 0 ||
      this.patientForm.value.patientSelectedMedChangesStop <= 0 || this.patientForm.value.patientPsychologicalTestingName <= 0 ||
      this.patientForm.value.patientPsychologicalTestingScore <= 0 || this.patientForm.value.performedCognitiveAssessmentTestName <= 0 ||
      this.patientForm.value.performedCognitiveAssessmentTestScore <= 0) {
      console.log("object getting null"); return;
    }
    let objects = {
      patientSelectedMedChanges: this.patientForm.value.patientSelectedMedChanges,
      patientSelectedMedChangesDecrease: this.patientForm.value.patientSelectedMedChangesDecrease,
      patientSelectedMedChangesIncrease: this.patientForm.value.patientSelectedMedChangesIncrease,
      patientSelectedMedChangesStart: this.patientForm.value.patientSelectedMedChangesStart,
      patientSelectedMedChangesStop: this.patientForm.value.patientSelectedMedChangesStop,
      patientPsychologicalTestingName: this.patientForm.value.patientPsychologicalTestingName,
      patientPsychologicalTestingScore: this.patientForm.value.patientPsychologicalTestingScore,
      performedCognitiveAssessmentTestName: this.patientForm.value.performedCognitiveAssessmentTestName,
      performedCognitiveAssessmentTestScore: this.patientForm.value.performedCognitiveAssessmentTestScore
    }
    if (this.selectedPatient.dateOfService == undefined) {
      this.addNewVisitData(objects);
    } else {
      this.updateVisitData(objects);
    }
  }

  async addNewVisitData(objects) {
    this.patientService.detailsOfPatient(toFormData(this.patientForm.value)).subscribe(
      (data: any) => {
        this.patientService.setObjectData(data.parentId, data._id, objects).subscribe((res: any) => {
          this.notifyService.showSuccess('Patient Data Added Successfully', "");
          this.activeModal.close(this.patientForm.value);
          this.SpinnerService.hide();
        }, (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          if (err.error.error) {
            this.notifyService.showError(err.error.error, "");
          }
          else if (err.error.msg) {
            this.notifyService.showError(err.error.msg, "");
          } else {
            this.notifyService.showError("Something went wrong", "");
          }
        })
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        if (err.error.error) {
          this.notifyService.showError(err.error.error, "");
        }
        else if (err.error.msg) {
          this.notifyService.showError(err.error.msg, "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      }
    );
  }

  async updateVisitData(objects) {
    this.patientService.updatePatientsVisitData(this.selectedPatient.parentId, this.selectedPatient._id, toFormData(this.patientForm.value)).subscribe(
      (data: any) => {
        this.patientService.setObjectData(this.selectedPatient.parentId, this.selectedPatient._id, objects).subscribe((res: any) => {
          this.notifyService.showSuccess('Patient Data Updated Successfully', "");
          this.activeModal.close(this.patientForm.value);
          this.SpinnerService.show();
        }, (err: HttpErrorResponse) => {
          this.SpinnerService.show();
          if (err.error.error) {
            this.notifyService.showError(err.error.error, "");
          }
          else if (err.error.msg) {
            this.notifyService.showError(err.error.msg, "");
          } else {
            this.notifyService.showError("Something went wrong", "");
          }
        })
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

  resetForm(obj, d) {

  }

  addStart() { this.medStart.push(this.formBuilder.group({ patientSelectedMedChangesStart: '' })); }
  editStart(start) {
    for (let i = 0; i < start.length; i++) {
      this.medStart.push(this.formBuilder.group({ patientSelectedMedChangesStart: start[i].patientSelectedMedChangesStart }));
    }
  }
  deleteStart(index) { this.medStart.removeAt(index); }

  addIncrease() { this.medIncrease.push(this.formBuilder.group({ patientSelectedMedChangesIncrease: '' })); }
  editIncrease(increase) {
    for (let i = 0; i < increase.length; i++) {
      this.medIncrease.push(this.formBuilder.group({ patientSelectedMedChangesIncrease: increase[i].patientSelectedMedChangesIncrease }));
    }
  }
  deleteIncrease(index) { this.medIncrease.removeAt(index); }

  addDecrease() { this.medDecrease.push(this.formBuilder.group({ patientSelectedMedChangesDecrease: '' })); }
  editDecrease(decrease) {
    for (let i = 0; i < decrease.length; i++) {
      this.medDecrease.push(this.formBuilder.group({ patientSelectedMedChangesDecrease: decrease[i].patientSelectedMedChangesDecrease }));
    }
  }
  deleteDecrease(index) { this.medDecrease.removeAt(index); }

  addStop() { this.medStop.push(this.formBuilder.group({ patientSelectedMedChangesStop: '' })); }
  editStop(stop) {
    for (let i = 0; i < stop.length; i++) {
      this.medStop.push(this.formBuilder.group({ patientSelectedMedChangesStop: stop[i].patientSelectedMedChangesStop }));
    }
  }
  deleteStop(index) { this.medStop.removeAt(index); }

  addPsychologicalTesting() {
    this.PsychologicalTestingName.push(this.formBuilder.group({ patientPsychologicalTestingName: '' }));
    this.PsychologicalTestingScore.push(this.formBuilder.group({ patientPsychologicalTestingScore: '' }));
  }
  editPsychologicalTesting(name, score) {
    for (let i = 0; i < name.length; i++) {
      this.PsychologicalTestingName.push(this.formBuilder.group({ patientPsychologicalTestingName: name[i].patientPsychologicalTestingName }));
      this.PsychologicalTestingScore.push(this.formBuilder.group({ patientPsychologicalTestingScore: score[i].patientPsychologicalTestingScore }));
    }
  }
  deletePsychologicalTesting(index) {
    this.PsychologicalTestingName.removeAt(index);
    this.PsychologicalTestingScore.removeAt(index);
  }

  addCognitiveAssessmentTest() {
    this.CognitiveAssessmentTestName.push(this.formBuilder.group({ performedCognitiveAssessmentTestName: '' }));
    this.CognitiveAssessmentTestScore.push(this.formBuilder.group({ performedCognitiveAssessmentTestScore: '' }));
  }
  editCognitiveAssessmentTest(name, score) {
    for (let i = 0; i < name.length; i++) {
      this.CognitiveAssessmentTestName.push(this.formBuilder.group({ performedCognitiveAssessmentTestName: name[i].performedCognitiveAssessmentTestName }));
      this.CognitiveAssessmentTestScore.push(this.formBuilder.group({ performedCognitiveAssessmentTestScore: score[i].performedCognitiveAssessmentTestScore }));
    }
  }
  deleteCognitiveAssessmentTest(index) {
    this.CognitiveAssessmentTestName.removeAt(index);
    this.CognitiveAssessmentTestScore.removeAt(index);
  }

  updateSelect(e, value) {
    this.patientForm.get(value).setValue(e, {
      onlySelf: true
    })
    if (value == 'typeOfService') {
      this.getProviders();
      this.providers = this.providersCopy.filter(provider => {
        return (provider.providerTypes != undefined && provider.providerTypes.includes(e));
      })
    }
  }

}
