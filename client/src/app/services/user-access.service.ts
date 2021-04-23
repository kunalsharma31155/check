import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAccessService {
  helper = new JwtHelperService();


  constructor(private http: HttpClient) { }

  getAllUsersAccess(){
    return this.http.get(`${environment.apiBaseUrl}/user-access/get-all-user-access`);
  }

  updateUserAccess(data){
    return this.http.post(`${environment.apiBaseUrl}/user-access/update-user-access`,data);
  }

  getSpecificUserAccess(){
    let token = localStorage.getItem('Token');
    const decodedToken = this.helper.decodeToken(token);
    return this.http.get(`${environment.apiBaseUrl}/user-access/get-specific-user-access/${decodedToken.userRole}`);
  }

}
