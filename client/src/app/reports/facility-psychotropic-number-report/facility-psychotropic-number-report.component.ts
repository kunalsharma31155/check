import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
import { formatDate, CommonModule, DecimalPipe } from '@angular/common';
import { addHeadingRow, addBlankRow, addImageOnTopOfExcel, loadLogo, increaseColumnWidth, wrapText, mergeCell, textSize, textBold, textUnderline, thinBorderForRow, generatedExcelFile } from '../../shared/excelreportgenerate/excel-report-generate'


import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

import * as html2pdf from 'html2pdf.js';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-facility-psychotropic-number-report',
  templateUrl: './facility-psychotropic-number-report.component.html',
  styleUrls: ['./facility-psychotropic-number-report.component.scss']
})
export class FacilityPsychotropicNumberReportComponent implements OnInit {
  @Input() reportData: any;
  @Input() inputData: any;
  searchTerm;
  pageNo: number;
  dateFrom;
  dateTo;
  showCard1 = false;
  showCard2 = false;
  facilityName;
  average = {
    "facilityDate": "Average", "bedsInFacility": 0, "censusPatients": 0, "patiensOnAntipsychotics": 0, "patiensOnAntiAnxiety": 0,
    "patientsOnAntiDepressants": 0, "patientsOnSedativesHypnotics": 0
  }
  screenHeight;
  screenWidth;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }


  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['Beds In Facility', 'Census Patients', 'Patiens On Antipsychotics', 'Patiens On AntiAnxiety	', 'Patients On Anti Depressants',
    'Patients On Sedatives And Hypnotics'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  finalGraph = [];
  barChartData: ChartDataSets[] = [

  ];

  constructor(public activeModal: NgbActiveModal) {
    this.getScreenSize();
  }


  ngOnInit() {
    this.dateFrom = this.inputData.facilityDateFrom;
    this.dateTo = this.inputData.facilityDateTo;
    this.getReport();
    this.createGraphs();
  }

  createGraphs() {
    for (let i = 0; i < this.reportData.length; i++) {
      let d: ChartDataSets[] = [];
      let pro = { facility: '', d };
      pro.facility = this.reportData[i][this.reportData[i].length - 1];
      for (let j = 0; j < this.reportData[i].length - 1; j++) {
        let obj = { label: '', data: [] };
        obj.label = this.reportData[i][j].facilityDate;

        obj.data.push(this.reportData[i][j].bedsInFacility);
        obj.data.push(this.reportData[i][j].censusPatients);
        obj.data.push(this.reportData[i][j].patiensOnAntipsychotics);
        obj.data.push(this.reportData[i][j].patiensOnAntiAnxiety);
        obj.data.push(this.reportData[i][j].patientsOnAntiDepressants);
        obj.data.push(this.reportData[i][j].patientsOnSedativesHypnotics);
        this.barChartData.push(obj);
        pro.d.push({ label: obj.label, data: obj.data });
      }
      this.finalGraph.push(pro);
    }
  }

  getReport() {
    if (this.reportData[0].length == undefined) {
      this.showCard1 = true;
      for (let i = 0; i < this.reportData.length; i++) {
        this.average.bedsInFacility += parseInt(this.reportData[i].bedsInFacility);
        this.average.censusPatients += parseInt(this.reportData[i].censusPatients);
        this.average.patiensOnAntipsychotics += parseInt(this.reportData[i].patiensOnAntipsychotics);
        this.average.patiensOnAntiAnxiety += parseInt(this.reportData[i].patiensOnAntiAnxiety);
        this.average.patientsOnAntiDepressants += parseInt(this.reportData[i].patientsOnAntiDepressants);
        this.average.patientsOnSedativesHypnotics += parseInt(this.reportData[i].patientsOnSedativesHypnotics);
      }
      this.average.bedsInFacility = this.average.bedsInFacility / this.reportData.length;
      this.average.censusPatients = this.average.censusPatients / this.reportData.length;
      this.average.patiensOnAntipsychotics = this.average.patiensOnAntipsychotics / this.reportData.length;
      this.average.patiensOnAntiAnxiety = this.average.patiensOnAntiAnxiety / this.reportData.length;
      this.average.patientsOnAntiDepressants = this.average.patientsOnAntiDepressants / this.reportData.length;
      this.average.patientsOnSedativesHypnotics = this.average.patientsOnSedativesHypnotics / this.reportData.length;
      this.reportData.push(this.average);
    } else {
      this.showCard2 = true;
    }
  }

  exportExcel(excelFileName, sheetName): void {
    const workbooke = new Excel.Workbook();
    const worksheet = workbooke.addWorksheet(sheetName);

    const reportHeadingColumnForProviderReport = ['', 'Month', 'Beds In Facility'
      , 'Census Patients', 'Patiens On Antipsychotics', 'Patiens On AntiAnxiety', 'Patients On Anti Depressants',
      'Patients On Sedatives And Hypnotics'];
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
    const paramFromDate = worksheet.addRow(['', 'From Date', formatDate(this.inputData.facilityDateFrom, 'MM-dd-yyyy', 'en-US')]);
    const paramToDate = worksheet.addRow(['', 'To Date', formatDate(this.inputData.facilityDateTo, 'MM-dd-yyyy', 'en-US')]);
    thinBorderForRow(paramFacility);
    thinBorderForRow(paramFromDate);
    thinBorderForRow(paramToDate);
    addBlankRow(worksheet, []);

    //For Heading Column and Data for all
    for (let indexOfProvider = 0; indexOfProvider < this.reportData.length && this.reportData[0].length != undefined; indexOfProvider++) {
      const providerNameRow = addHeadingRow(worksheet, ['', 'Facility Name', this.reportData[indexOfProvider][this.reportData[indexOfProvider].length - 1]]);
      thinBorderForRow(providerNameRow);

      const headerColumns = addHeadingRow(worksheet, reportHeadingColumnForProviderReport);
      wrapText(headerColumns);
      thinBorderForRow(headerColumns);
      // textBold(headerColumns);
      const addEmptyRow = addBlankRow(worksheet, emptyRow);
      thinBorderForRow(addEmptyRow);

      for (let indexOfFacility = 0; indexOfFacility < this.reportData[indexOfProvider].length - 1; indexOfFacility++) {
        const censusPatientsPercentage = '(' + (this.reportData[indexOfProvider][indexOfFacility].censusPatients / this.reportData[indexOfProvider][indexOfFacility].bedsInFacility * 100) + '%)';
        const censusPatients = this.reportData[indexOfProvider][indexOfFacility].censusPatients + ' ';

        const patiensOnAntipsychoticsPercentage = '(' + (this.reportData[indexOfProvider][indexOfFacility].patiensOnAntipsychotics / this.reportData[indexOfProvider][indexOfFacility].bedsInFacility * 100) + '%)';
        const patiensOnAntipsychotics = this.reportData[indexOfProvider][indexOfFacility].patiensOnAntipsychotics + ' ';

        const patiensOnAntiAnxietyPercentage = '(' + (this.reportData[indexOfProvider][indexOfFacility].patiensOnAntiAnxiety / this.reportData[indexOfProvider][indexOfFacility].bedsInFacility * 100) + '%)';
        const patiensOnAntiAnxiety = this.reportData[indexOfProvider][indexOfFacility].patiensOnAntiAnxiety + ' ';

        const patientsOnAntiDepressantsPercentage = '(' + (this.reportData[indexOfProvider][indexOfFacility].patientsOnAntiDepressants / this.reportData[indexOfProvider][indexOfFacility].bedsInFacility * 100) + '%)';
        const patientsOnAntiDepressants = this.reportData[indexOfProvider][indexOfFacility].patientsOnAntiDepressants + ' ';

        const patientsOnSedativesHypnoticsPercentage = '(' + (this.reportData[indexOfProvider][indexOfFacility].patientsOnSedativesHypnotics / this.reportData[indexOfProvider][indexOfFacility].bedsInFacility * 100) + '%)';
        const patientsOnSedativesHypnotics = this.reportData[indexOfProvider][indexOfFacility].patientsOnSedativesHypnotics + ' ';

        const addValueInColumns = addHeadingRow(worksheet, ['',
          this.reportData[indexOfProvider][indexOfFacility].facilityDate,
          this.reportData[indexOfProvider][indexOfFacility].bedsInFacility,
          censusPatients.concat(censusPatientsPercentage),
          patiensOnAntipsychotics.concat(patiensOnAntipsychoticsPercentage),
          patiensOnAntiAnxiety.concat(patiensOnAntiAnxietyPercentage),
          patientsOnAntiDepressants.concat(patientsOnAntiDepressantsPercentage),
          patientsOnSedativesHypnotics.concat(patientsOnSedativesHypnoticsPercentage)]);
        wrapText(addValueInColumns);
        thinBorderForRow(addValueInColumns);
      }
      addBlankRow(worksheet, emptyRow);
      addBlankRow(worksheet, emptyRow);
    }

    //for single facility
    if (this.reportData[0].length == undefined) {
      const providerNameRow = addHeadingRow(worksheet, ['', 'Facility Name', this.reportData[0].facilityName]);
      thinBorderForRow(providerNameRow);

      const headerColumns = addHeadingRow(worksheet, reportHeadingColumnForProviderReport);
      wrapText(headerColumns);
      thinBorderForRow(headerColumns);
      const addEmptyRow = addBlankRow(worksheet, emptyRow);
      thinBorderForRow(addEmptyRow);
    }

    for (let indexOfProvider = 0; indexOfProvider < this.reportData.length && this.reportData[0].length == undefined; indexOfProvider++) {
      const addValueInColumns = addHeadingRow(worksheet, ['',
        this.reportData[indexOfProvider].facilityDate,
        this.reportData[indexOfProvider].bedsInFacility,
        this.reportData[indexOfProvider].censusPatients,
        this.reportData[indexOfProvider].patiensOnAntipsychotics,
        this.reportData[indexOfProvider].patiensOnAntiAnxiety,
        this.reportData[indexOfProvider].patientsOnAntiDepressants,
        this.reportData[indexOfProvider].patientsOnSedativesHypnotics
      ]);
      wrapText(addValueInColumns);
      thinBorderForRow(addValueInColumns);
    }

    // if(this.reportData[0].length == undefined){
    //   addBlankRow(worksheet, emptyRow);
    //   addBlankRow(worksheet, emptyRow);
    // }

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

    //   PDF.save('facility-psychotropic-number-report.pdf');
    // });
    if (this.screenWidth <= 1799) {
      let options = {
        margin: 1,
        filename: 'facility-psychotropic-number-report.pdf',
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
        filename: 'facility-psychotropic-number-report.pdf',
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
