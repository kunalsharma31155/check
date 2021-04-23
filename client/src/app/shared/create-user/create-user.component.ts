import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  @Input() selectedUser: any;
  userForm: FormGroup;
  formSubmitted = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  roles = ["admin", "super-admin", "provider", "non-clinical-employee", "medical-assistant", "data-entry-operator", "power-of-attorney", "facility", "facility-corporate", "billing-company"];

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private User: UserService,
    private router: Router,
    private notifyService: NotificationService) { }

  ngOnInit() {
    if (this.selectedUser != undefined) {
      this.editForm();
    }
    else {
      this.createForm();
    }

  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  createForm() {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userRole: ['', Validators.required],
      email: [''],
      userLoginId: ['', Validators.required],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
      assignPrivileges: []
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
    this.userForm = this.formBuilder.group({
      firstName: [this.selectedUser.firstName, Validators.required],
      lastName: [this.selectedUser.lastName, Validators.required],
      userRole: [this.selectedUser.userRole, Validators.required],
      email: [this.selectedUser.email],
      userLoginId: [this.selectedUser.userLoginId, Validators.required],
      activeStatus: [this.selectedUser.activeStatus, Validators.required]
    });
  }

  get f() { return this.userForm.controls; }

  submitForm() {
    this.formSubmitted = true;
    if (this.userForm.invalid) { return; }
    if (this.selectedUser != undefined) {
      this.updateUser();
    } else {
      this.newUser();
    }
  }

  updateUser() {
    this.User.updateUser(this.userForm.value).subscribe(
      (data: any) => {
        this.notifyService.showSuccess('User Updated Successfully', "");
        this.activeModal.close(this.userForm.value);
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

  newUser() {
    this.userForm.value.userLoginId = this.userForm.value.userLoginId.toLowerCase();
    this.userForm.value.email = this.userForm.value.email.toLowerCase();
    this.User.createUser(this.userForm.value).subscribe(
      (data: any) => {
        this.notifyService.showSuccess('User Created Successfully', "");
        this.activeModal.close(this.userForm.value);
      },
      (err: HttpErrorResponse) => {
        if (err.error.error) {
          this.notifyService.showError(err.error.error, "");
        }
        else if (err.error.msg) {
          this.notifyService.showError(err.error.msg.message, "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      }
    );
  }


  updateRole(e) {
    this.userForm.get('userRole').setValue(e, {
      onlySelf: true
    })
  }
}
