import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";

import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
  helper = new JwtHelperService();
  public userDetails: any = { name: "", role: "" };
  public navbarList: any = [];
  public userPermission: any = {};

  private userDetailSource = new BehaviorSubject(this.userDetails);
  private navbarSource = new BehaviorSubject(this.navbarList);

  private subject = new Subject<any>();
  sendClickEvent() {
    this.subject.next();
  }
  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  constructor(private userService: UserService,
    private notificationService: NotificationService) {
    // this.getCurrentUser();
  }

  currentUserDetails = this.userDetailSource.asObservable();
  changeUserDetails() {
    this.userDetailSource.next(this.userDetails);
  }


  currentList = this.navbarSource.asObservable();
  changeNavbar(list: any) {
    this.navbarSource.next(list);
    this.getCurrentUser();
  }

  getCurrentUser() {
    let token = localStorage.getItem('Token');
    const decodedToken = this.helper.decodeToken(token);
    this.userService.getCurrentUser(decodedToken._id).subscribe((data: any) => {
      this.userDetails.name = data.userData.firstName;
      this.userDetails.role = data.userData.userRole;
      this.changeUserDetails();
    }, (err) => {
      this.notificationService.showError("", "Something Went Wrong");
    })
  }

}
