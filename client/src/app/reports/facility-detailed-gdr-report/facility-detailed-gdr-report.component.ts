import { Component, OnInit, Input, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from '../../services/reports.service';
import { NotificationService } from '../../services/notification.service';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
import { formatDate, CommonModule, DecimalPipe } from '@angular/common';
import { addHeadingRow, addBlankRow, addImageOnTopOfExcel, loadLogo, increaseColumnWidth, wrapText, mergeCell, textSize, textBold, textUnderline, thinBorderForRow, generatedExcelFile } from '../../shared/excelreportgenerate/excel-report-generate'


// import { jsPDF } from "jspdf";
// declare let jsPDF;
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-facility-detailed-gdr-report',
  templateUrl: './facility-detailed-gdr-report.component.html',
  styleUrls: ['./facility-detailed-gdr-report.component.scss']
})
export class FacilityDetailedGdrReportComponent implements OnInit {
  @ViewChild('content', { static: true }) content: ElementRef;
  @Input() reportData: any;
  @Input() inputData: any;
  searchTerm;
  pageNo: number;
  dateFrom;
  dateTo;
  report;
  screenHeight;
  screenWidth;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  constructor(public activeModal: NgbActiveModal, private reportService : ReportsService,private notificationService:NotificationService) {
    this.getScreenSize();
  }

  ngOnInit() {
    this.report = this.reportData;
    this.dateFrom = this.inputData.facilityDateFrom;
    this.dateTo = this.inputData.facilityDateTo;
  }

  createPdf(){
    this.reportService.printFacilityDetailedGDRReport(this.report,'facility-detailed-gdr-report.pdf',this.dateFrom,this.dateTo).subscribe((data)=>{
      console.log(data);
    },err=>{
      this.notificationService.showError("",err);
      console.log(err);
    })
  }
}
