import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from '../../services/notification.service';
import { PatientService } from '../../services/patient.service';
import { ProviderService } from '../../services/provider.service';
import { requiredFileType, uploadProgress, toResponseBody, markAllAsDirty, toFormData, toFormDataForCollection } from '../file-upload/upload-file-validators';
@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.scss']
})
export class CreatePatientComponent implements OnInit {
  @Input() selectedPatient: any;
  patientForm: FormGroup;
  documentTypes = [];
  // [{documentName:'Gas Receipt', _id:'123'}, {documentName:'Cell Phone Receipt', _id:'124'}, {documentName:'Other Receipt', _id:'125'}
  // ,{documentName:'Other Receipt1', _id:'126'}];
  formSubmitted = false;
  dob;
  progress = 0;
  uploadFiles = [];
  apiUrl;
  facilitys = [];
  providers = [];
  reasons = ["Moved Facility", "Home", "Home AMA", "Assisted Living", "Hospital", "Death", "Other", "Hospice", "Patient no longer in care of Practice"]

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private notifyService: NotificationService,
    private providerService: ProviderService) { }

  ngOnInit() {
    this.getRequiredDocument();
    if (this.selectedPatient != undefined) {
      this.apiUrl = this.patientService.getApiUrl();
      // this.fillterUploadFiles();
      this.editForm();
    }
    else {
      this.createForm();
    }
    this.getFacility();
    this.getProviders();
  }

  getRequiredDocument() {
    this.patientService.getAllRequiredDocument().subscribe((data: any) => {
      this.documentTypes = data.documents;
      if (this.selectedPatient != undefined) {
        this.fillterUploadFiles();
      }
    }, (err: HttpErrorResponse) => {
      this.notifyService.showError("Something went wrong", "");
    });
  }

  fillterUploadFiles() {
    this.selectedPatient.documents.forEach(element => {
      var a = (this.documentTypes.filter(e => e._id.includes(element.documentId)));
      this.uploadFiles.push(Object.assign({}, a))
    });

    this.selectedPatient.documents.forEach(element => {
      this.documentTypes = this.documentTypes.filter(e => !e._id.includes(element.documentId))
    });
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
      this.providers = data.providers;
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

  createForm() {
    this.patientForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      patientDOB: ['', Validators.required],
      patientFacility: ['', Validators.required],
      patientFacilityId: [''],
      patientProvider: ['', Validators.required],
      patientProviderId: [''],
      documents: this.formBuilder.array([this.addDocumentsGroup()]),
      dischargeReason: ['']
    });
  }

  private addDocumentsGroup(): FormGroup {
    return this.formBuilder.group({
      fileName: [''],
      image: new FormControl(null, []),
      // documentDate:[]
    });
  }

  addDocument(): void {
    this.documentArray.push(this.addDocumentsGroup());
  }

  get documentArray(): FormArray {
    return <FormArray>this.patientForm.get('documents');
  }

  removeDocument(index: number): void {
    this.documentArray.removeAt(index);
    if (this.documentArray.length == 0) {
      this.addDocument();
    }
  }

  editForm() {
    this.patientForm = this.formBuilder.group({
      firstName: [this.selectedPatient.firstName, Validators.required],
      lastName: [this.selectedPatient.lastName, Validators.required],
      patientId: [this.selectedPatient._id, Validators.required],
      patientFacility: [this.selectedPatient.patientFacility, Validators.required],
      patientFacilityId: [this.selectedPatient.patientFacilityId, Validators.required],
      patientProvider: [this.selectedPatient.patientProvider, Validators.required],
      patientProviderId: [this.selectedPatient.patientProviderId, Validators.required],
      powerOfAttorneyUserId: [this.selectedPatient.powerOfAttorneyUserId],
      activeStatus: [this.selectedPatient.activeStatus, Validators.required],
      documents: this.formBuilder.array([this.addDocumentsGroup()]),
      dischargeReason: [this.selectedPatient.dischargeReason]
    });
  }

  get f() { return this.patientForm.controls; }

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
    if (this.patientForm.invalid) {
      if (this.patientForm.value.patientFacilityId == "" || this.patientForm.value.patientFacilityId == undefined ||
        this.patientForm.value.patientProviderId == "" || this.patientForm.value.patientProviderId == undefined) {
        return;
      }
    }
    if (this.selectedPatient != undefined) {
      await this.updatePatient();
    } else {
      await this.newPatient();
    }
  }

  updatePatient() {
    this.patientService.updatePatient(toFormDataForCollection(this.patientForm.value))
      .pipe(
        uploadProgress(progress => (this.progress = progress)),
        toResponseBody()
      )
      .subscribe(
        (data: any) => {
          this.progress = 0;
          this.notifyService.showSuccess('Patient Details Updated Successfully', "");
          this.activeModal.close(this.patientForm.value);
        },
        (err: HttpErrorResponse) => {
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

  newPatient() {
    this.patientService.createPatient(toFormDataForCollection(this.patientForm.value))
      .pipe(
        uploadProgress(progress => (this.progress = progress)),
        toResponseBody()
      )
      .subscribe(
        (data: any) => {
          this.progress = 0;
          this.notifyService.showSuccess('Patient Created Successfully', "");
          this.activeModal.close(this.patientForm.value);
        },
        (err: HttpErrorResponse) => {
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
  validateDOB(e) {
    let year = new Date(e).getFullYear();
    let today = new Date().getFullYear();
    if (today - year >= 100) {

    }
  }

  updatePatientFacility(e) {
    this.patientForm.get('patientFacility').setValue(e, {
      onlySelf: true
    })
  }

  updatePatientProvider(e) {
    this.patientForm.get('patientProvider').setValue(e, {
      onlySelf: true
    })
  }

  updateDischargeReason(e) {
    this.patientForm.get('dischargeReason').setValue(e, {
      onlySelf: true
    })
  }

}
