import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PatientService } from '../../../services/patient.service';
import { UpdatePatientRecordComponent } from '../../../shared/update-patient-record/update-patient-record.component';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-visit-details',
  templateUrl: './visit-details.component.html',
  styleUrls: ['./visit-details.component.scss']
})
export class VisitDetailsComponent implements OnInit {
  visits;
  searchTerm;
  pageNo: number;

  constructor(private route: ActivatedRoute,
    private modalService: NgbModal,
    private patientService: PatientService,
    private notifyService: NotificationService) { }

  ngOnInit() {
    this.getVisitData();
  }

  getVisitData() {
    const id = this.route.snapshot.paramMap.get('id');
    this.patientService.getPatientDetails(id).subscribe((res: any) => {
      this.visits = res.patient;
    })
  }

  updatePatient(patient) {
    // const modalRef = this.modalService.open(CreatePatientComponent, { size: 'lg', backdrop: 'static' });
    const modalRef = this.modalService.open(UpdatePatientRecordComponent, { ariaLabelledBy: 'Patient-visit-data', size: 'lg' });
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
  closeResult: string;
  softDeleteVisit(content, visit) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.patientService.softDeleteVisit(visit._id, visit.parentId).subscribe((res) => {
          this.notifyService.showSuccess("Deleted Successfully", "");
        }, err => {
          this.notifyService.showError("", err);
        })
      }
    }, (reason) => {
    });
  }
}
