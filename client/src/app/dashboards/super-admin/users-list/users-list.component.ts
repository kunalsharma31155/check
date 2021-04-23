import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef  } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Router} from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators , FormArray} from '@angular/forms';
import { JwtHelperService } from "@auth0/angular-jwt";

import { NotificationService } from '../../../services/notification.service';
import { CreateUserComponent } from '../../../shared/create-user/create-user.component';
import { UserService } from '../../../services/user.service';
import { DataTransferService } from '../../../services/data-transfer.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  helper = new JwtHelperService();
  modalReference: NgbModalRef;
  users : [];
  term;
  p:number;
  navLink;
  loggedInUserId;
  formSubmitted = false;
  userForm :FormGroup;
  showPassword:boolean = false;
  showConfirmPassword:boolean = false;

  constructor(private modalService: NgbModal,
    private notifyService: NotificationService,
    private userService: UserService,
    private router: Router,
    private dataTransferService : DataTransferService,
    private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.getLoggedInUserId();
    this.getCurrentUser();
    this.getUsers();
  }

  togglePassword(){
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(){
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  createForm(){
    this.userForm = this.formBuilder.group({
      adminId : [this.loggedInUserId,[Validators.required]],
      adminPassword : ['',[Validators.required]],
      userId : [this.passowrdUser._id,[Validators.required]],
      password: ['',[Validators.required]],
      confirmPassword: ['',Validators.required]
    },{
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

  getLoggedInUserId(){
    let token = localStorage.getItem('Token');
    const decodedToken = this.helper.decodeToken(token);
    this.loggedInUserId = decodedToken._id;
  }


  role = false;
  getCurrentUser(){
    this.dataTransferService.currentUserDetails.subscribe((data)=>{
      this.role = data.role;
      if(data.role == 'super-admin'){
        this.role = true;
      }
    })
  }


  passowrdUser;
  showPasswordModal(content,user) {
    this.passowrdUser = user;
    this.createForm();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size: 'lg'}).result.then((result) => {
    }, (reason) => {
    });
  }

  get f() { return this.userForm.controls; }

  checkAdminPassword(){
    this.formSubmitted = true;
    if(this.userForm.invalid){ return; }
    this.userService.confirmPasswordForAdmin(this.userForm.value).subscribe((data:any)=>{
      if(data.status == true){
        this.notifyService.showSuccess("","Password Changed Successfully");
        this.modalService.dismissAll();
      }
    },error=>{
      this.notifyService.showError("",error.error.msg);
    })
  }

  getUsers(){
    this.navLink = this.router.url;
    this.userService.getAllUsers().subscribe((data:any)=>{
      this.users = data.users;
    },(err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error,"");
      }
      else if(err.error.msg){
        this.notifyService.showError(err.error.msg,"");
      } else {
        this.notifyService.showError("Something went wrong","");
      }
    })
  }

  createUser() {
    const modalRef = this.modalService.open(CreateUserComponent);
    modalRef.result.then((result) => {
    this.ngOnInit();
  }).catch((error) => {
    if(error == 'Cross click'  || error == 0){
    this.notifyService.showInfo("Form Closed","");
    }else{
      this.notifyService.showError("Something went wrong","");
    }
  });
  }

  updateUser(user){
    const modalRef = this.modalService.open(CreateUserComponent);
    modalRef.componentInstance.selectedUser = user;
    modalRef.result.then((result) => {
    this.ngOnInit();
    }).catch((error) => {
    if(error == 'Cross click'  || error == 0){
    this.notifyService.showInfo("Form Closed","");
    }else{
      this.notifyService.showError("Something went wrong","");
    }
  });
  }
}
