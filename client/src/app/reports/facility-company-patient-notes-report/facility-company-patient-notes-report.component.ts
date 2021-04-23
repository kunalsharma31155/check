import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from '../../services/reports.service';
import { NotificationService } from '../../services/notification.service';

import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-facility-company-patient-notes-report',
  templateUrl: './facility-company-patient-notes-report.component.html',
  styleUrls: ['./facility-company-patient-notes-report.component.scss']
})
export class FacilityCompanyPatientNotesReportComponent implements OnInit {
  @Input() reportData: any;
  @Input() inputData: any;
  searchTerm;
  pageNo: number;
  dateFrom;
  dateTo;
  report;
  apiUrl;
  screenHeight;
  screenWidth;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  constructor(public activeModal: NgbActiveModal,
    private reportsService: ReportsService,
    private notificationService: NotificationService) {
    this.getScreenSize();
  }


  ngOnInit() {
    this.getReportData();
    this.getApiUrl();
  }

  getReportData() {
    for (let i = 0; i < this.reportData.length; i++) {
      let flag = 0;
      for (let j = 0; j < this.reportData[i].patientSummary.length; j++) {
        if (this.reportData[i].patientSummary[j] == ";") {
          flag++;
        }
        if (flag == 3) {
          this.reportData[i].summary1 = this.reportData[i].patientSummary.substr((j + 1), this.reportData[i].patientSummary.length);
          break;
        }
      }
    }
    this.report = this.reportData;
    this.dateFrom = this.inputData.facilityDateFrom;
    this.dateTo = this.inputData.facilityDateTo;
  }
  getApiUrl() {
    this.apiUrl = this.reportsService.getApiUrl();
  }

  createPdf() {
    this.reportsService.printPatientNotesReport(this.report,'facility-patient-notes-report.pdf',this.dateFrom,this.dateTo).subscribe((data)=>{
      console.log(data);
    },err=>{
      this.notificationService.showError("",err);
      console.log(err);
    })
  }

}
