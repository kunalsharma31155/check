import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from '../../services/reports.service';
import { NotificationService } from '../../services/notification.service';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
import { formatDate, CommonModule } from '@angular/common';
import { addHeadingRow, addBlankRow, addImageOnTopOfExcel, loadLogo, increaseColumnWidth, wrapText, mergeCell, textSize, textBold, textUnderline, thinBorderForRow, generatedExcelFile } from '../../shared/excelreportgenerate/excel-report-generate'


import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

import * as html2pdf from 'html2pdf.js';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-facility-practice-performance-report',
  templateUrl: './facility-practice-performance-report.component.html',
  styleUrls: ['./facility-practice-performance-report.component.scss']
})
export class FacilityPracticePerformanceReportComponent implements OnInit {
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
    'FailedGDR', 'DidGDR', 'Identifiednewtrauma', 'Initiatedpriorauth', 'NoGDR', 'Orderedlabs', 'Psychologicaltestperformed', 'Referptto', 'decreasemed',
    'effectiveGDR', 'increasemed', 'points',
    'startmed', 'stopmeds'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  finalGraph = [];
  barChartData: ChartDataSets[] = [

  ];

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
      let pro = { facility: '', d };
      pro.facility = this.report[i].facility;
      for (let j = 0; j < this.report[i].provider.length; j++) {
        let obj = { label: '', data: [] };
        obj.label = this.report[i].provider[j].providerName;

        obj.data.push(this.report[i].provider[j].patientsEncounters);
        obj.data.push(this.report[i].provider[j].Assessedcapacity);
        obj.data.push(this.report[i].provider[j].Changeddiagnosis);
        obj.data.push(this.report[i].provider[j].Dementiatestperformed);
        obj.data.push(this.report[i].provider[j].Didpsychotherapy);
        obj.data.push(this.report[i].provider[j].Dischargedpt);
        obj.data.push(this.report[i].provider[j].FailedGDR);
        obj.data.push(this.report[i].provider[j].DidGDR);
        obj.data.push(this.report[i].provider[j].Identifiednewtrauma);
        obj.data.push(this.report[i].provider[j].Initiatedpriorauth);
        obj.data.push(this.report[i].provider[j].NoGDR);
        obj.data.push(this.report[i].provider[j].Orderedlabs);
        obj.data.push(this.report[i].provider[j].Psychologicaltestperformed);
        obj.data.push(this.report[i].provider[j].Referptto);
        obj.data.push(this.report[i].provider[j].decreasemed);
        obj.data.push(this.report[i].provider[j].effectiveGDR);
        obj.data.push(this.report[i].provider[j].increasemed);
        obj.data.push(this.report[i].provider[j].points);
        obj.data.push(this.report[i].provider[j].startmed);
        obj.data.push(this.report[i].provider[j].stopmeds);
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

    const reportHeadingColumnForProviderReport = ['', 'Provider', 'Patients Encounters'
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
    for (let indexOfFacility = 0; indexOfFacility < this.report.length; indexOfFacility++) {
      const providerNameRow = addHeadingRow(worksheet, ['', 'Facility Name', this.report[indexOfFacility].facility]);
      thinBorderForRow(providerNameRow);

      const headerColumns = addHeadingRow(worksheet, reportHeadingColumnForProviderReport);
      wrapText(headerColumns);
      thinBorderForRow(headerColumns);
      // textBold(headerColumns);
      const addEmptyRow = addBlankRow(worksheet, emptyRow);
      thinBorderForRow(addEmptyRow);

      for (let indexOfProvider = 0; indexOfProvider < this.report[indexOfFacility].provider.length; indexOfProvider++) {
        const addValueInColumns = addHeadingRow(worksheet, ['',
          this.report[indexOfFacility].provider[indexOfProvider].providerName,
          this.report[indexOfFacility].provider[indexOfProvider].patientsEncounters,
          this.report[indexOfFacility].provider[indexOfProvider].Assessedcapacity,
          this.report[indexOfFacility].provider[indexOfProvider].Changeddiagnosis,
          this.report[indexOfFacility].provider[indexOfProvider].Dementiatestperformed,
          this.report[indexOfFacility].provider[indexOfProvider].Didpsychotherapy,
          this.report[indexOfFacility].provider[indexOfProvider].Dischargedpt,
          this.report[indexOfFacility].provider[indexOfProvider].FailedGDR,
          this.report[indexOfFacility].provider[indexOfProvider].Identifiednewtrauma,
          this.report[indexOfFacility].provider[indexOfProvider].Initiatedpriorauth,
          this.report[indexOfFacility].provider[indexOfProvider].NoGDR,
          this.report[indexOfFacility].provider[indexOfProvider].Orderedlabs,
          this.report[indexOfFacility].provider[indexOfProvider].Psychologicaltestperformed,
          this.report[indexOfFacility].provider[indexOfProvider].Referptto,
          this.report[indexOfFacility].provider[indexOfProvider].decreasemed,
          this.report[indexOfFacility].provider[indexOfProvider].effectiveGDR,
          this.report[indexOfFacility].provider[indexOfProvider].increasemed,
          this.report[indexOfFacility].provider[indexOfProvider].points,
          this.report[indexOfFacility].provider[indexOfProvider].startmed,
          this.report[indexOfFacility].provider[indexOfProvider].stopmeds]);
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
    this.reportService.printFacilityPracticePerformanceReport(this.report,'facility-practice-performance-report.pdf',this.dateFrom,this.dateTo).subscribe((data)=>{
      console.log(data);
    },err=>{
      this.notificationService.showError("",err);
      console.log(err);
    })
  }

}
