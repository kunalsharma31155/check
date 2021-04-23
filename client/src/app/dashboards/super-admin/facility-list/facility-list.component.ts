import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { NotificationService } from '../../../services/notification.service';
import { CreateFacilityComponent } from '../../../shared/create-facility/create-facility.component';
import { FacilityService } from '../../../services/facility.service';

@Component({
  selector: 'app-facility-list',
  templateUrl: './facility-list.component.html',
  styleUrls: ['./facility-list.component.scss']
})
export class FacilityListComponent implements OnInit {
  facilitys = [];
  searchTerm;
  pageNo: number;
  navLink;

  constructor(private modalService: NgbModal,
    private notifyService: NotificationService,
    private facilityService: FacilityService,
    private router: Router) {
  }

  ngOnInit() {
    this.navLink = this.router.url;
    this.getAllFacility()
  }

  getAllFacility() {
    this.facilityService.getAllFacility().subscribe((data: any) => {
      this.facilitys = data.facilities;
      // this.facilitys =  data.facilities.filter(function(facility) {
      //   return facility.activeStatus == true ;
      // })
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


  newFacility() {
    const modalRef = this.modalService.open(CreateFacilityComponent);
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

  updateFacility(facility) {
    const modalRef = this.modalService.open(CreateFacilityComponent);
    modalRef.componentInstance.selectedFacility = facility;
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
}
