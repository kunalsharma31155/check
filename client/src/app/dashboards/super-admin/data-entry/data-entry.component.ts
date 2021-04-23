import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';

import { UpdatePatientRecordComponent } from '../../../shared/update-patient-record/update-patient-record.component';
import { DataEntryPostRoundingComponent } from '../../../shared/data-entry-post-rounding/data-entry-post-rounding.component';
import { PsychotropicNumberComponent } from '../../../shared/psychotropic-number/psychotropic-number.component';
import { NotificationService } from '../../../services/notification.service';
import { PatientService } from '../../../services/patient.service';
import { UserAccessService } from '../../../services/user-access.service';
import * as helper from '../../../helper/common'

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent implements OnInit {
  closeResult = '';
  patients = [];
  searchTerm;
  pageNo: number;
  permission;
  searching = false;
  constructor(private modalService: NgbModal,
    private notifyService: NotificationService,
    private patientService: PatientService,
    private userAccess: UserAccessService) { }

  ngOnInit() {
    this.getuserAccess();
    this.getAllPatient();

  }
  config = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  getAllPatient() {
    this.patientService.getAllPatient(1).subscribe((data: any) => {
      for (let index = 0; index < data.patients.length; index++) {
        if (data.patients[index].activeStatus == false) {
          data.patients.splice(index, 1);
        }
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



  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'Patient-visit-data', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  postRounding() {
    const modalRef = this.modalService.open(DataEntryPostRoundingComponent, { size: 'md', backdrop: 'static' });
    modalRef.result.then((result) => {
    }).catch((error) => {
      if (error == 'Cross click' || error == 0) {
        this.notifyService.showInfo("Form Closed", "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    });
  }

  psychotropic() {
    const modalRef = this.modalService.open(PsychotropicNumberComponent, { size: 'md', backdrop: 'static' });
    modalRef.result.then((result) => {
    }).catch((error) => {
      if (error == 'Cross click' || error == 0) {
        this.notifyService.showInfo("Form Closed", "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    });
  }

  updatePatient(patientData) {
    const modalRef = this.modalService.open(UpdatePatientRecordComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.selectedPatient = patientData;
    modalRef.result.then((result) => {
    }).catch((error) => {
      if (error == 'Cross click' || error == 0) {
        this.notifyService.showInfo("Form Closed", "");
      } else {
        this.notifyService.showError("Something went wrong", "");
      }
    });
  }

  getuserAccess() {
    this.userAccess.getSpecificUserAccess().subscribe((res: any) => {
      this.permission = res.result;
    })
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
