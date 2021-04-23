import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { NotificationService } from '../../../services/notification.service';
import { CreatePatientComponent } from '../../../shared/create-patient/create-patient.component';
import { UpdatePatientRecordComponent } from '../../../shared/update-patient-record/update-patient-record.component';
import { PatientService } from '../../../services/patient.service';
import * as helper from '../../../helper/common'


@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  navLink;

  constructor(private modalService: NgbModal,
    private notifyService: NotificationService,
    private patientService: PatientService,
    private router: Router) { }

  searching = false;
  patients = [];
  searchTerm;
  pageNo: number;
  test;

  ngOnInit() {
    this.navLink = this.router.url;
    this.getAllPatient();
  }
  config;
  getAllPatient() {
    this.navLink = this.router.url;
    this.patientService.getAllPatient(1).subscribe((data: any) => {
      for (let index = 0; index < data.patients.length; index++) {
        data.patients[index].patientDOB = helper.dateFormatConverter(data.patients[index].patientDOB);
      }
      this.patients = data.patients;
      this.config = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: data.totalItems
      };
    }, (err: HttpErrorResponse) => {
      if (err.error.error) {
        this.notifyService.showError(err.error.error, "");
      }
      else if (err.error.msg) {
        this.notifyService.showError(err.error.msg, "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    })
  }

  searchPatient() {
    if (this.searchTerm != "") {
      this.searching = true;
      this.patientService.searchPatient(this.searchTerm, 1).subscribe((data: any) => {
        for (let index = 0; index < data.patients.length; index++) {
          data.patients[index].patientDOB = helper.dateFormatConverter(data.patients[index].patientDOB);
        }
        this.patients = data.patients;
        this.config = {
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: data.totalItems
        };
      }, err => {
        this.notifyService.showError("", err);
      })
    } else {
      this.getAllPatient();
      this.searching = false;
    }
  }

  updatePatient(patient) {
    // const modalRef = this.modalService.open(CreatePatientComponent, { size: 'lg', backdrop: 'static' });
    const modalRef = this.modalService.open(CreatePatientComponent);
    modalRef.componentInstance.selectedPatient = patient;
    modalRef.result.then((result) => {
      this.ngOnInit();
    }).catch((error) => {
      if (error == 'Cross click' || error == 0) {
        this.notifyService.showInfo("Form Closed", "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    });
  }

  newPatient() {
    const modalRef = this.modalService.open(CreatePatientComponent);
    modalRef.result.then((result) => {
      this.ngOnInit();
    }).catch((error) => {
      if (error == 'Cross click' || error == 0) {
        this.notifyService.showInfo("Form Closed", "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    });
  }

  pageChanged(event) {
    this.config.currentPage = event;
    if (this.searching == false) {
      this.patientService.getAllPatient(event).subscribe((data: any) => {
        for (let index = 0; index < data.patients.length; index++) {
          data.patients[index].patientDOB = helper.dateFormatConverter(data.patients[index].patientDOB);
        }
        this.patients = data.patients;
        this.config = {
          itemsPerPage: 10,
          currentPage: event,
          totalItems: data.totalItems
        };
      }, (err: HttpErrorResponse) => {
        if (err.error.error) {
          this.notifyService.showError(err.error.error, "");
        }
        else if (err.error.msg) {
          this.notifyService.showError(err.error.msg, "");
        } else {
          this.notifyService.showError("Something went wrong", "");
        }
      })
    } else {
      this.patientService.searchPatient(this.searchTerm, event).subscribe((data: any) => {
        for (let index = 0; index < data.patients.length; index++) {
          data.patients[index].patientDOB = helper.dateFormatConverter(data.patients[index].patientDOB);
        }
        this.patients = data.patients;
        this.config = {
          itemsPerPage: 10,
          currentPage: event,
          totalItems: data.totalItems
        };
      }, err => {
        this.notifyService.showError("", err);
      })
    }
  }

}
