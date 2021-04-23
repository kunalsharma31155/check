import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';


import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

import { formatDate, CommonModule } from '@angular/common';
import { addHeadingRow, addBlankRow, addImageOnTopOfExcel, loadLogo, increaseColumnWidth, wrapText, mergeCell, textSize, textBold, textUnderline, thinBorderForRow, generatedExcelFile } from '../../shared/excelreportgenerate/excel-report-generate'

import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-admin-prior-auth-report',
  templateUrl: './admin-prior-auth-report.component.html',
  styleUrls: ['./admin-prior-auth-report.component.scss']
})
export class AdminPriorAuthReportComponent implements OnInit {
  @Input() reportData: any;
  @Input() inputData: any;
  searchTerm;
  pageNo: number;
  dateFrom;
  dateTo;
  screenHeight;
  screenWidth;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  constructor(public activeModal: NgbActiveModal) {
    this.getScreenSize();
  }

  ngOnInit() {
    this.dateFrom = this.inputData.facilityDateFrom;
    this.dateTo = this.inputData.facilityDateTo;
  }

  exportExcel(excelFileName, sheetName): void {
    const workbooke = new Excel.Workbook();
    const worksheet = workbooke.addWorksheet(sheetName);

    const reportHeadingColumnForProviderReport = ['', 'Patient Name', 'Patient DOB'
      , 'Patient Facility', 'Patient Provider', 'Patient Prior Auth'];
    const emptyRow: string[] = new Array(reportHeadingColumnForProviderReport.length).fill('');

    //For Logo
    addBlankRow(worksheet, []);
    loadLogo(workbooke);
    addImageOnTopOfExcel(worksheet);
    addBlankRow(worksheet, []);
    addBlankRow(worksheet, []);
    addBlankRow(worksheet, []);
    addBlankRow(worksheet, []);

    //For Address
    const address = addBlankRow(worksheet, ['', 'Psychiatry Care \n10840 N US Highway 301 \nOxford FL 34484 Oxford FL 34484 \nOffice:(352) 445-1200 \nFax: (888) 248-4348',]);
    wrapText(address);
    addBlankRow(worksheet, []);
    addBlankRow(worksheet, []);
    addBlankRow(worksheet, []);
    addBlankRow(worksheet, []);
    mergeCell(worksheet, ['B6:D10']);

    // For Report Name
    const reportNameHeading = addHeadingRow(worksheet, ['', sheetName]);
    mergeCell(worksheet, ['B11:D11']);
    textSize(reportNameHeading);
    textUnderline(reportNameHeading);
    textBold(reportNameHeading);
    wrapText(reportNameHeading);
    addBlankRow(worksheet, []);

    //For Input Parameters
    const paramFacility = addHeadingRow(worksheet, ['', 'Facility Name', this.inputData.facility]);
    const paramProvider = addHeadingRow(worksheet, ['', 'Provider Name', this.inputData.provider]);
    const paramFromDate = worksheet.addRow(['', 'From Date', formatDate(this.inputData.facilityDateFrom, 'MM-dd-yyyy', 'en-US')]);
    const paramToDate = worksheet.addRow(['', 'To Date', formatDate(this.inputData.facilityDateTo, 'MM-dd-yyyy', 'en-US')]);
    thinBorderForRow(paramFacility);
    thinBorderForRow(paramProvider);
    thinBorderForRow(paramFromDate);
    thinBorderForRow(paramToDate);
    addBlankRow(worksheet, []);

    //For Heading Column and Data for all
    const headerColumns = addHeadingRow(worksheet, reportHeadingColumnForProviderReport);
    wrapText(headerColumns);
    thinBorderForRow(headerColumns);
    const addEmptyRow = addBlankRow(worksheet, emptyRow);
    thinBorderForRow(addEmptyRow);

    //for single facility
    for (let indexOfProvider = 0; indexOfProvider < this.reportData.length; indexOfProvider++) {
      const addValueInColumns = addHeadingRow(worksheet, ['',
        this.reportData[indexOfProvider].parentId,
        formatDate(this.reportData[indexOfProvider].dateOfService, 'MM-dd-yyyy', 'en-US'),
        this.reportData[indexOfProvider].patientFacility,
        this.reportData[indexOfProvider].patientProvider,
        this.reportData[indexOfProvider].patientPriorAuth
      ]);
      wrapText(addValueInColumns);
      thinBorderForRow(addValueInColumns);
    }

    //For Column Width
    increaseColumnWidth(worksheet, emptyRow);

    //For Generate Excel File
    generatedExcelFile(workbooke, excelFileName, fs);
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

    //   PDF.save('admin-prior-auth-report.pdf');
    // });
    if (this.screenWidth <= 1799) {
      let options = {
        margin: 1,
        filename: 'admin-prior-auth-report.pdf',
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
        filename: 'admin-prior-auth-report.pdf',
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
