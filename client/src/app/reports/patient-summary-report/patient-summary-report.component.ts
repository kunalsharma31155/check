import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from '../../services/reports.service';


import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-patient-summary-report',
  templateUrl: './patient-summary-report.component.html',
  styleUrls: ['./patient-summary-report.component.scss']
})
export class PatientSummaryReportComponent implements OnInit {
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
    private reportsService: ReportsService,) {
    this.getScreenSize();
  }


  ngOnInit() {
    this.report = this.reportData;
    this.dateFrom = this.inputData.facilityDateFrom;
    this.dateTo = this.inputData.facilityDateTo;
    this.getApiUrl();
  }

  getApiUrl() {
    this.apiUrl = this.reportsService.getApiUrl();
  }

}
