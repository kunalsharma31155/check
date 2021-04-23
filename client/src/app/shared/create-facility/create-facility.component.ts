import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from '../../services/notification.service';
import { FacilityService } from '../../services/facility.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create-facility',
  templateUrl: './create-facility.component.html',
  styleUrls: ['./create-facility.component.scss']
})
export class CreateFacilityComponent implements OnInit {
  @Input() selectedFacility: any;
  facilityForm: FormGroup;
  formSubmitted = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  // corporates = ["Consulate", "Orchid Cove", "Southern", "Citadel", "Lilac", "Advent", "NHS"];
  corporates;
  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private facilityService: FacilityService,
    private router: Router,
    private notifyService: NotificationService,
    private userService: UserService) { }

  ngOnInit() {
    this.getCorporates();
    if (this.selectedFacility != undefined) {
      this.editForm();
    }
    else {
      this.createForm();
    }
  }

  getCorporates() {
    this.userService.getCorporates().subscribe((data: any) => {
      this.corporates = data.userData;
      console.log(this.corporates)
    }, err => {
      this.notifyService.showError("", err);
    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  createForm() {
    this.facilityForm = this.formBuilder.group({
      facilityName: ['', Validators.required],
      facilityShortName: ['', Validators.required],
      address: this.formBuilder.group({
        line1: ['', Validators.required],
        line2: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', Validators.required],
        state: ['', Validators.required]
      }),
      userRole: ['facility'],
      partOfCorporate: [false],
      nameOfCorporate: [''],
      facilityEmail: [''],
      facilityLoginId: ['', Validators.required],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.MustMatch('password', 'confirmPassword')
    });
  }

  MustMatch(password1: string, password2: string) {
    return (formGroup: FormGroup) => {
      const pass = formGroup.controls[password1];
      const confirmPass = formGroup.controls[password2];

      if (confirmPass.errors && !confirmPass.errors.mustMatch) {
        return;
      }

      // set error on confirmPass if validation fails
      if (pass.value !== confirmPass.value) {
        confirmPass.setErrors({ mustMatch: true });
      } else {
        confirmPass.setErrors(null);
      }
    }
  }

  editForm() {
    if (this.selectedFacility.facilityShortName == undefined) {
      this.facilityForm = this.formBuilder.group({
        activeStatus: [this.selectedFacility.activeStatus, Validators.required],
        facilityEmail: [this.selectedFacility.facilityEmail],
        facilityLoginId: [this.selectedFacility.facilityLoginId, Validators.required],
        facilityName: [this.selectedFacility.facilityName, Validators.required],
        facilityShortName: ['', Validators.required],
        address: this.formBuilder.group({
          line1: ['', Validators.required],
          line2: ['', Validators.required],
          city: ['', Validators.required],
          zipCode: ['', Validators.required],
          state: ['', Validators.required]
        }),
        // userRole: ['facility'],
        partOfCorporate: [this.selectedFacility.partOfCorporate],
        nameOfCorporate: [this.selectedFacility.nameOfCorporate],
      });
    } else {
      this.facilityForm = this.formBuilder.group({
        facilityName: [this.selectedFacility.facilityName, Validators.required],
        facilityShortName: [this.selectedFacility.facilityShortName, Validators.required],
        activeStatus: [this.selectedFacility.activeStatus, Validators.required],
        address: this.formBuilder.group({
          line1: [this.selectedFacility.address.line1, Validators.required],
          line2: [this.selectedFacility.address.line2, Validators.required],
          city: [this.selectedFacility.address.city, Validators.required],
          zipCode: [this.selectedFacility.address.zipCode, Validators.required],
          state: [this.selectedFacility.address.state, Validators.required]
        }),
        partOfCorporate: [this.selectedFacility.partOfCorporate],
        facilityEmail: [this.selectedFacility.facilityEmail],
        facilityLoginId: [this.selectedFacility.facilityLoginId, Validators.required],
        nameOfCorporate: [this.selectedFacility.nameOfCorporate],
      });
    }
  }

  get f() { return this.facilityForm.controls; }

  get ff() {
    let outerGroup = this.facilityForm.controls.address as FormGroup;
    return (outerGroup.controls);
  }

  submitForm() {
    this.formSubmitted = true;
    if (this.facilityForm.invalid) { return; }
    if (this.selectedFacility != undefined) {
      this.updateFacility();
    } else {
      this.newFacility();
    }
  }

  updateFacility() {
    this.facilityService.updateFacility(this.facilityForm.value).subscribe(
      (data: any) => {
        this.notifyService.showSuccess('Facility Updated Successfully', "");
        this.activeModal.close(this.facilityForm.value);
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

  newFacility() {
    this.facilityService.createFacility(this.facilityForm.value).subscribe(
      (data: any) => {
        this.notifyService.showSuccess('Facility Created Successfully', "");
        this.activeModal.close(this.facilityForm.value);
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
  updateRole(e) {
    this.facilityForm.get('nameOfCorporate').setValue(e, {
      onlySelf: true
    })
  }

}
