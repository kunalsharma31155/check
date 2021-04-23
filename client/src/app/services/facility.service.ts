import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTransferService } from './data-transfer.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {

  constructor(private http: HttpClient,
    private router: Router,
    private datatransferService: DataTransferService) { }

  createFacility(data) {
    return this.http.post(`${environment.apiBaseUrl}/facility/create-facility`, data);
  }

  updateFacility(data) {
    return this.http.post(`${environment.apiBaseUrl}/facility/update-facility`, data);
  }

  postRoundData(data) {
    return this.http.post(`${environment.apiBaseUrl}/facility/post-round-data`, data);
  }

  userLogin(data) {
    return this.http.post(`${environment.apiBaseUrl}/user/login`, data);
  }

  logout() {
    localStorage.removeItem('Token');
    this.router.navigate(['/login']);
    this.datatransferService.changeNavbar(null);
  }

  getAllFacility() {
    return this.http.get(`${environment.apiBaseUrl}/facility/get-all-facility`);
  }

  getCurrentUser(id) {
    return this.http.get(`${environment.apiBaseUrl}/user/get-current-user/${id}`);
  }

  psychotropicData(data) {
    return this.http.post(`${environment.apiBaseUrl}/facility/psychotropic-data`, data);
  }

  getCorporateFacility(name) {
    return this.http.get(`${environment.apiBaseUrl}/facility/get-corporate-facility/${name}`);
  }

}
