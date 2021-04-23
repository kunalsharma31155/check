import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from '../../services/reports.service';
import { NotificationService } from '../../services/notification.service';
// import * as XLSX from 'xlsx';
import { HostListener } from "@angular/core";
import { formatDate, CommonModule } from '@angular/common';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { addHeadingRow, addBlankRow, addImageOnTopOfExcel, loadLogo, increaseColumnWidth, wrapText, mergeCell, textSize, textBold, textUnderline, thinBorderForRow, generatedExcelFile } from '../../shared/excelreportgenerate/excel-report-generate'
// import { jsPDF } from "jspdf";
import jsPDF from 'jspdf';
// import * as jsPDF from 'jspdf';
import * as jpt from 'jspdf-autotable';
@Component({
  selector: 'app-provider-performance-report',
  templateUrl: './provider-performance-report.component.html',
  styleUrls: ['./provider-performance-report.component.scss']
})
export class ProviderPerformanceReportComponent implements OnInit {
  @ViewChild('ppr', { static: false }) htmlData: ElementRef;
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

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['patientsEncounters', 'Assessedcapacity', 'Changeddiagnosis', 'Dementiatestperformed', 'Didpsychotherapy', 'Dischargedpt',
    'FailedGDR', 'Identifiednewtrauma', 'Initiatedpriorauth', 'NoGDR', 'Orderedlabs', 'Psychologicaltestperformed', 'Referptto', 'decreasemed',
    'effectiveGDR', 'increasemed', 'points',
    'startmed', 'stopmeds'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  finalGraph = [];
  barChartData: ChartDataSets[] = [

  ];
  // { data: [45, 37, 60, 70, 46, 33, 45, 37, 60, 70, 46, 33, 45, 37, 60, 70, 46, 33, 54], label: 'facility1' },
  // { data: [87, 87, 90, 20, 66, 93, 25, 37, 90, 20, 86, 23, 65, 97, 10, 40, 86, 93, 14], label: 'facility2' },
  // { data: [86, 23, 65, 97, 10, 40, 86, 45, 37, 60, 70, 46, 33, 45, 46, 33, 45, 37, 87], label: 'facility3' },


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
        obj.data.push(this.report[i].facility[j].Assessedcapacity);
        obj.data.push(this.report[i].facility[j].Changeddiagnosis);
        obj.data.push(this.report[i].facility[j].Dementiatestperformed);
        obj.data.push(this.report[i].facility[j].Didpsychotherapy);
        obj.data.push(this.report[i].facility[j].Dischargedpt);
        obj.data.push(this.report[i].facility[j].FailedGDR);
        obj.data.push(this.report[i].facility[j].Identifiednewtrauma);
        obj.data.push(this.report[i].facility[j].Initiatedpriorauth);
        obj.data.push(this.report[i].facility[j].NoGDR);
        obj.data.push(this.report[i].facility[j].Orderedlabs);
        obj.data.push(this.report[i].facility[j].Psychologicaltestperformed);
        obj.data.push(this.report[i].facility[j].Referptto);
        obj.data.push(this.report[i].facility[j].decreasemed);
        obj.data.push(this.report[i].facility[j].effectiveGDR);
        obj.data.push(this.report[i].facility[j].increasemed);
        obj.data.push(this.report[i].facility[j].points);
        obj.data.push(this.report[i].facility[j].startmed);
        obj.data.push(this.report[i].facility[j].stopmeds);
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

    const reportHeadingColumnForProviderReport = ['', 'Facility', 'Patients Encounters'
      , 'Assessed Capacity', 'Changed Diagnosis', 'Dementia Test Performed', 'Did Psychotherapy', 'Discharged Pt'
      , 'Failed GDR', 'Identified New Trauma', 'Initiated Prior Auth', 'No GDR', 'Ordered Labs'
      , 'Psychological Test Performed', 'Refer Pt To', 'Decrease Med', 'Effective GDR', 'Increase Med', 'Points'
      , 'Start Med', 'Stop Meds'];
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
          this.report[indexOfProvider].facility[indexOfFacility].Assessedcapacity,
          this.report[indexOfProvider].facility[indexOfFacility].Changeddiagnosis,
          this.report[indexOfProvider].facility[indexOfFacility].Dementiatestperformed,
          this.report[indexOfProvider].facility[indexOfFacility].Didpsychotherapy,
          this.report[indexOfProvider].facility[indexOfFacility].Dischargedpt,
          this.report[indexOfProvider].facility[indexOfFacility].FailedGDR,
          this.report[indexOfProvider].facility[indexOfFacility].Identifiednewtrauma,
          this.report[indexOfProvider].facility[indexOfFacility].Initiatedpriorauth,
          this.report[indexOfProvider].facility[indexOfFacility].NoGDR,
          this.report[indexOfProvider].facility[indexOfFacility].Orderedlabs,
          this.report[indexOfProvider].facility[indexOfFacility].Psychologicaltestperformed,
          this.report[indexOfProvider].facility[indexOfFacility].Referptto,
          this.report[indexOfProvider].facility[indexOfFacility].decreasemed,
          this.report[indexOfProvider].facility[indexOfFacility].effectiveGDR,
          this.report[indexOfProvider].facility[indexOfFacility].increasemed,
          this.report[indexOfProvider].facility[indexOfFacility].points,
          this.report[indexOfProvider].facility[indexOfFacility].startmed,
          this.report[indexOfProvider].facility[indexOfFacility].stopmeds]);
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
    this.reportService.printProviderPerformanceReport(this.report,'provider-performance-report.pdf',this.dateFrom,this.dateTo).subscribe((data)=>{
      console.log(data);
    },err=>{
      this.notificationService.showError("",err);
      console.log(err);
    })
  }
}

