import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';

import { NotificationService } from '../../services/notification.service';
import { FacilityService } from '../../services/facility.service';
import { ProviderService } from 'src/app/services/provider.service';
import { requiredFileType, uploadProgress, toResponseBody, markAllAsDirty, toFormData, toFormDataForCollection } from '../file-upload/upload-file-validators';

@Component({
  selector: 'app-data-entry-post-rounding',
  templateUrl: './data-entry-post-rounding.component.html',
  styleUrls: ['./data-entry-post-rounding.component.scss']
})
export class DataEntryPostRoundingComponent implements OnInit {
  @Input() selectedUser: any;
  postRoundingForm: FormGroup;
  formSubmitted = false;
  progress = 0;
  facilitys = [];
  providers = [];
  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private notifyService: NotificationService,
    private facilityService: FacilityService,
    private providerService: ProviderService) { }

  ngOnInit() {
    this.createForm();
    this.getAllFacility();
    this.getAllProvider();
  }

  getAllFacility() {
    this.facilityService.getAllFacility().subscribe((data: any) => {
      // this.facilitys = data.facilities;
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

  getAllProvider() {
    this.providerService.getAllProvider().subscribe((data: any) => {
      // this.providers = data.providers;
      this.providers = data.providers.filter(function (provider) {
        return provider.activeStatus == true;
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

  createForm() {
    this.postRoundingForm = this.formBuilder.group({
      providerId: ['', Validators.required],
      facilityId: ['', Validators.required],
      dateOfService: ['', Validators.required],
      image: [null, Validators.required]
    })
  }

  get f() { return this.postRoundingForm.controls; }

  updateFacility(e, value) {
    this.postRoundingForm.get(value).setValue(e, {
      onlySelf: true
    })
  }

  submitForm() {
    this.formSubmitted = true;
    if (this.postRoundingForm.invalid) { return; }
    this.facilityService.postRoundData(toFormData(this.postRoundingForm.value)).subscribe(
      (data: any) => {
        this.notifyService.showSuccess('Post Round Created Successfully', "");
        this.activeModal.close(this.postRoundingForm.value);
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

  updateOptions(e, value) {
  }

}
