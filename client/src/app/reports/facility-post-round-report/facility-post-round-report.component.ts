import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from '../../services/reports.service';


import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-facility-post-rounding-report',
  templateUrl: './facility-post-round-report.component.html',
  styleUrls: ['./facility-post-round-report.component.scss']
})
export class FacilityPostRoundingReportComponent implements OnInit {
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

  createPdf() {
    let DATA = document.getElementById('excel-table');
    // html2canvas(DATA).then(canvas => {

    //   let fileWidth = 250;
    //   let fileHeight = canvas.height * fileWidth / canvas.width;

    //   const FILEURI = canvas.toDataURL('image/png')
    //   let PDF = new jsPDF('l', 'mm', 'a4');
    //   let position = 0;
    //   PDF.addImage(FILEURI, 'PNG', 10, position, fileWidth, fileHeight)

    //   PDF.save('facility-post-rounding-report.pdf');
    // });
    if (this.screenWidth <= 1799) {
      let options = {
        margin: 1,
        filename: 'facility-post-rounding-report.pdf',
        html2canvas: {
          dpi: 192,
          letterRendering: true,
          allowTaint: true,
          useCORS: true,
          logging: false,
          scrollX: true,
          scrollY: true,
          windowWidth: this.screenWidth,
          windowHeight: this.screenHeight,
          width: this.screenWidth + 420,
          height: this.screenHeight,
        },
        jsPDF: {
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        }
      };

      html2pdf().set(options).from(DATA).save();
    } else {
      let options = {
        margin: 10,
        filename: 'facility-post-rounding-report.pdf',
        html2canvas: {
          dpi: 192,
          letterRendering: true,
          allowTaint: true,
          useCORS: true,
          logging: false,
          scrollX: true,
          scrollY: true,
          windowWidth: this.screenWidth,
          windowHeight: this.screenHeight,
          width: this.screenWidth,
          height: this.screenHeight
        },
        jsPDF: {
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        }
      };

      html2pdf().set(options).from(DATA).save();
    }
  }

}
