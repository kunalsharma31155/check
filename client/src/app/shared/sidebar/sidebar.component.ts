import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";

import { UserService } from '../../services/user.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { UserAccessService } from '../../services/user-access.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  helper = new JwtHelperService();
  isMenuCollapsed = true;
  hideSideNav = false;
  navbarList;
  loggedUserName : string;
  loggedUserRole : string;
  loggedUserIntials : string;
  navLinkRole : string;
  access;

  constructor(private userService : UserService,
            private datatransferService : DataTransferService,
            private userAccess : UserAccessService) { }

  toggleSideNav(): void{
    this.hideSideNav = !this.hideSideNav;
  }
  ngOnInit(): void {
    this.getnavbarList();
    this.getUserDetails();
    // this.userService.loadTheme("green");
    // this.loadTheme();
  }


  logout(){
    this.userService.logout();
  }

  getUserDetails(){
    let token = localStorage.getItem('Token');
    const decodedToken = this.helper.decodeToken(token);
    this.datatransferService.currentUserDetails.subscribe((data:any) =>{
      this.loggedUserName = data.name;
      this.loggedUserRole = data.role;
      this.loggedUserIntials = this.loggedUserRole.split('-').map(x => x[0]).join('').toUpperCase();
    })
  }

  openSettings(){
    this.datatransferService.sendClickEvent();
  }

  getnavbarList(){
    this.datatransferService.currentList.subscribe(list =>{
      this.navbarList = list;
    })
  }
}
