import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";

import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { UserAccessService } from '../../services/user-access.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  formSubmitted = false;
  helper = new JwtHelperService();
  showPassword: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private notifyService: NotificationService,
    private userService: UserService,
    private datatransferService: DataTransferService,
    private userAccess: UserAccessService) { }

  ngOnInit() {
    this.createForm();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  loginUser() {
    this.formSubmitted = true;

    if (this.loginForm.invalid) { return; }
    this.userService.userLogin(this.loginForm.value).subscribe(
      (data: any) => {
        this.notifyService.showSuccess('Login Successfully', "");
        localStorage.setItem('Token', data.token);
        const decodedToken = this.helper.decodeToken(data.token);
        const role = decodedToken.userRole;
        this.router.navigate([`/dashboard`]);
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
}
