import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';

import { NotificationService } from '../../services/notification.service';
import { FacilityService } from '../../services/facility.service';

@Component({
  selector: 'app-psychotropic-number',
  templateUrl: './psychotropic-number.component.html',
  styleUrls: ['./psychotropic-number.component.scss']
})
export class PsychotropicNumberComponent implements OnInit {
  @Input() selectedUser: any;
  psychotropicForm: FormGroup;
  formSubmitted = false;
  facilitys = [];

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private notifyService: NotificationService,
    private facilityService: FacilityService) { }

  ngOnInit() {
    this.createForm();
    this.getAllFacility();
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

  createForm() {
    this.psychotropicForm = this.formBuilder.group({
      facility: ['', Validators.required],
      facilityName: [''],
      facilityDate: ['', Validators.required],
      bedsInFacility: ['', Validators.required],
      censusPatients: ['', Validators.required],
      patiensOnAntipsychotics: ['', Validators.required],
      patiensOnAntiAnxiety: ['', Validators.required],
      patientsOnAntiDepressants: ['', Validators.required],
      patientsOnSedativesHypnotics: ['', Validators.required]
    })
  }
  assignFacilityName() {
    for (let i = 0; i < this.facilitys.length; i++) {
      if (this.facilitys[i]._id == this.psychotropicForm.value.facility)
        this.psychotropicForm.value.facilityName = this.facilitys[i].facilityName;
    }
  }
  submitForm() {
    this.formSubmitted = true;
    if (this.psychotropicForm.invalid) { return; }
    this.assignFacilityName();
    this.facilityService.psychotropicData(this.psychotropicForm.value).subscribe(
      (data: any) => {
        this.notifyService.showSuccess('Patient Data Added Successfully', "");
        this.activeModal.close(this.psychotropicForm.value);
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
  get facilityData() {
    return this.psychotropicForm.get('facility') as FormArray;
  }

  get f() { return this.psychotropicForm.controls; }

  addFacility() {
    this.facilityData.push(this.formBuilder.group({ facilityName: '', facilityDate: '' }));
  }

  deleteFacility(index) {
    this.facilityData.removeAt(index);
  }

  updateFacility(e) {
    this.psychotropicForm.get('facility').setValue(e, {
      onlySelf: true
    })
  }

}
