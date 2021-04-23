import { Component, OnInit, Input, HostListener } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';

import { ReportsService } from '../../services/reports.service';
import { NotificationService } from '../../services/notification.service';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

import { formatDate, CommonModule } from '@angular/common';
import { addHeadingRow, addBlankRow, addImageOnTopOfExcel, loadLogo, increaseColumnWidth, wrapText, mergeCell, textSize, textBold, textUnderline, thinBorderForRow, generatedExcelFile } from '../../shared/excelreportgenerate/excel-report-generate'

import * as html2pdf from 'html2pdf.js';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-brief-provider-performance-report',
  templateUrl: './brief-provider-performance-report.component.html',
  styleUrls: ['./brief-provider-performance-report.component.scss']
})
export class BriefProviderPerformanceReportComponent implements OnInit {
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
  constructor(public activeModal: NgbActiveModal,
    private reportService:ReportsService,
    private notificationService:NotificationService) {
    this.getScreenSize();
  }
  finalGraph = [];
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['Patients Encounters', 'Points', 'Effective GDR'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  ngOnInit() {
    this.report = this.reportData;
    this.dateFrom = this.inputData.facilityDateFrom;
    this.dateTo = this.inputData.facilityDateTo;
    this.createGraphs();
  }

  createGraphs() {
    // console.log(this.report);
    for (let i = 0; i < this.report.length; i++) {
      let d: ChartDataSets[] = [];
      let pro = { provider: '', d };
      pro.provider = this.report[i].provider;
      for (let j = 0; j < this.report[i].facility.length; j++) {
        let obj = { label: '', data: [] };
        obj.label = this.report[i].facility[j].facilityName;
        obj.data.push(this.report[i].facility[j].patientsEncounters);
        obj.data.push(this.report[i].facility[j].points);
        obj.data.push(this.report[i].facility[j].effectiveGDR);
        // this.barChartData.push(obj);
        // console.log(obj);
        pro.d.push({ label: obj.label, data: obj.data });
      }
      this.finalGraph.push(pro);
    }
    // console.log(this.finalGraph);
  }
  exportExcel(excelFileName, sheetName): void {
    const workbooke = new Excel.Workbook();
    const worksheet = workbooke.addWorksheet(sheetName);

    const reportHeadingColumnForProviderReport = ['', 'Facility Name', 'Patients Encounters'
      , 'Points', 'Effective GDR'];
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
    const paramProvider = worksheet.addRow(['', 'Provider Name', this.inputData.provider]);
    const paramFromDate = worksheet.addRow(['', 'From Date', formatDate(this.inputData.facilityDateFrom, 'MM-dd-yyyy', 'en-US')]);
    const paramToDate = worksheet.addRow(['', 'To Date', formatDate(this.inputData.facilityDateTo, 'MM-dd-yyyy', 'en-US')]);
    thinBorderForRow(paramFacility);
    thinBorderForRow(paramProvider);
    thinBorderForRow(paramFromDate);
    thinBorderForRow(paramToDate);
    addBlankRow(worksheet, []);

    //For Heading Column and Data
    for (let indexOfProvider = 0; indexOfProvider < this.report.length; indexOfProvider++) {
      const providerNameRow = addHeadingRow(worksheet, ['', 'Provider Name', this.report[indexOfProvider].provider]);
      thinBorderForRow(providerNameRow);

      const headerColumns = addHeadingRow(worksheet, reportHeadingColumnForProviderReport);
      wrapText(headerColumns);
      thinBorderForRow(headerColumns);
      // textBold(headerColumns);
      const addEmptyRow = addBlankRow(worksheet, emptyRow);
      thinBorderForRow(addEmptyRow);

      for (let indexOfFacility = 0; indexOfFacility < this.report[indexOfProvider].facility.length; indexOfFacility++) {
        const addValueInColumns = addHeadingRow(worksheet, ['',
          this.report[indexOfProvider].facility[indexOfFacility].facilityName,
          this.report[indexOfProvider].facility[indexOfFacility].patientsEncounters,
          this.report[indexOfProvider].facility[indexOfFacility].points,
          this.report[indexOfProvider].facility[indexOfFacility].effectiveGDR]);
        wrapText(addValueInColumns);
        thinBorderForRow(addValueInColumns);
      }
      addBlankRow(worksheet, emptyRow);
      addBlankRow(worksheet, emptyRow);
    }

    //For Column Width
    increaseColumnWidth(worksheet, emptyRow);

    //For Generate Excel File
    generatedExcelFile(workbooke, excelFileName, fs);
  }

  createPdf() {
    this.reportService.printBriefProviderPerformanceReport(this.report,'brief-provider-performance-report.pdf',this.dateFrom,this.dateTo).subscribe((data)=>{
      console.log(data);
    },err=>{
      this.notificationService.showError("",err);
      console.log(err);
    })
  }

}
