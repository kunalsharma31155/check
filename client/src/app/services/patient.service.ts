import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTransferService } from './data-transfer.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient,
    private router: Router,
    private datatransferService: DataTransferService) { }

  createPatient(data) {
    return this.http.post(`${environment.apiBaseUrl}/patient/create-patient`, data, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getApiUrl() {
    return `${environment.apiBaseUrl}`;
  }

  updatePatient(data) {
    return this.http.post(`${environment.apiBaseUrl}/patient/update-patient`, data, {
      reportProgress: true,
      observe: 'events'
    });
  }

  userLogin(data) {
    return this.http.post(`${environment.apiBaseUrl}/user/login`, data);
  }

  logout() {
    localStorage.removeItem('Token');
    this.router.navigate(['/login']);
    this.datatransferService.changeNavbar(null);
  }

  getAllPatient(page) {
    return this.http.get(`${environment.apiBaseUrl}/patient/get-all-patient/${page}`);
  }

  getAllRequiredDocument() {
    return this.http.get(`${environment.apiBaseUrl}/patient/get-all-required-document`);
  }

  getAllFacility() {
    return this.http.get(`${environment.apiBaseUrl}/facility/get-all-facility`);
  }

  getCurrentUser(id) {
    return this.http.get(`${environment.apiBaseUrl}/user/get-current-user/${id}`);
  }

  detailsOfPatient(data) {
    return this.http.post(`${environment.apiBaseUrl}/patient/patient-test-details`, data);
  }

  setObjectData(patientId, visitId, data) {
    return this.http.post(`${environment.apiBaseUrl}/patient/update-patient-test-details/${patientId}/${visitId}`, data);
  }

  updatePatientsVisitData(patientId, visitId, data) {
    return this.http.post(`${environment.apiBaseUrl}/patient/update-patient-visit-data/${patientId}/${visitId}`, data);
  }

  getPatientDetails(id) {
    return this.http.get(`${environment.apiBaseUrl}/patient/get-patient-details/${id}`);
  }

  getCptCode() {
    return this.http.get(`${environment.apiBaseUrl}/patient/get-cpt-code`);
  }

  softDeleteVisit(visitId, patientId) {
    return this.http.patch(`${environment.apiBaseUrl}/patient/delete-patient-visit-data/${patientId}/${visitId}`, { delete: true });
  }

  searchPatient(search, page) {
    return this.http.get(`${environment.apiBaseUrl}/patient/search-patient/${search}/${page}`);
  }
}
