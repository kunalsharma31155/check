import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient,
    private router: Router) { }

  psychotropicReport(data) {
    return this.http.post(`${environment.apiBaseUrl}/report/psychotropic-report`, data);
  }
  providerPerformanceReport(data) {
    return this.http.post(`${environment.apiBaseUrl}/report/provider-performance-report`, data);
  }
  briefproviderPerformanceReport(data) {
    return this.http.post(`${environment.apiBaseUrl}/report/brief-provider-performance-report`, data);
  }
  adminPriorAuthReport(data) {
    return this.http.post(`${environment.apiBaseUrl}/report/admin-prior-auth-report`, data);
  }
  getPatientsForFacilityPatientsNumberReport(data) {
    return this.http.post(`${environment.apiBaseUrl}/report/get-patients-for-facility-patient-number-report`, data);
  }
  getFinalPatientsForFacilityPatientsNumberReport(patientId, patients, input) {
    const data = { patientId, patients, input }
    return this.http.post(`${environment.apiBaseUrl}/report/get-final-patients-for-facility-patient-number-report`, data);
  }
  getFinalPatientSummaryReport(patientId, patients, input) {
    const data = { patientId, patients, input }
    return this.http.post(`${environment.apiBaseUrl}/report/get-final-patient-summary-report`, data);
  }
  getFinalSnapShotReport(patientId, patients, input) {
    const data = { patientId, patients, input }
    return this.http.post(`${environment.apiBaseUrl}/report/get-final-snap-shot-report`, data);
  }

  getFacilityPostRoundingReport(params) {
    return this.http.post(`${environment.apiBaseUrl}/report/get-final-facility-post-rounding-report`, params);
  }

  getMissingDocumentsReport(params) {
    return this.http.post(`${environment.apiBaseUrl}/report/get-final-missing-document-report`, params);
  }
  getFacilityDetailedGDRReport(params) {
    return this.http.post(`${environment.apiBaseUrl}/report/get-facility-detailed-gdr-report`, params);
  }

  getPowerOfAttorneyReport(params) {
    return this.http.post(`${environment.apiBaseUrl}/report/get-power-of-attorney-report`, params);
  }

  facilityPerformanceReport(data) {
    return this.http.post(`${environment.apiBaseUrl}/report/facility-performance-report`, data);
  }
  getApiUrl() {
    return `${environment.apiBaseUrl}`;
  }

  printFacilityDetailedGDRReport(report,reportName,from,to){
    const data = {report,reportName,from,to}
    return this.http.post(`${environment.apiBaseUrl}/report/print-facility-detailed-gdr-report`, data);
  }

  printProviderPerformanceReport(report,reportName,from,to){
    const data = {report,reportName,from,to}
    return this.http.post(`${environment.apiBaseUrl}/report/print-provider-performance-report`, data);
  }

  printBriefProviderPerformanceReport(report,reportName,from,to){
    const data = {report,reportName,from,to}
    return this.http.post(`${environment.apiBaseUrl}/report/print-brief-provider-performance-report`, data);
  }

  printPatientNotesReport(report,reportName,from,to){
    const data = {report,reportName,from,to}
    return this.http.post(`${environment.apiBaseUrl}/report/print-patient-notes-report`, data);
  }

  printFacilityPracticePerformanceReport(report,reportName,from,to){
    const data = {report,reportName,from,to}
    return this.http.post(`${environment.apiBaseUrl}/report/print-facility-practice-performance-report`, data);
  }

}
