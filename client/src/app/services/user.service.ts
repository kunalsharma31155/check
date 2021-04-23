import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private router: Router) { }

  createUser(data) {
    return this.http.post(`${environment.apiBaseUrl}/user/create-user`, data);
  }

  updateUser(data) {
    return this.http.post(`${environment.apiBaseUrl}/user/update-user`, data);
  }

  userLogin(data) {
    return this.http.post(`${environment.apiBaseUrl}/user/login`, data);
  }

  logout() {
    localStorage.removeItem('Token');
    this.router.navigate(['/login']);
  }

  getAllUsers() {
    return this.http.get(`${environment.apiBaseUrl}/user/get-all-users`);
  }
  getCurrentUser(id) {
    return this.http.get(`${environment.apiBaseUrl}/user/get-current-user/${id}`);
  }

  confirmPasswordForAdmin(data) {
    return this.http.post(`${environment.apiBaseUrl}/user/check-admin-password`, data);
  }

  getCorporates() {
    return this.http.get(`${environment.apiBaseUrl}/user/get-corporates`);
  }

}
