import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { NotificationService } from '../../../services/notification.service';
import { CreateProviderComponent } from '../../../shared/create-provider/create-provider.component';
import { ProviderService } from '../../../services/provider.service';

@Component({
  selector: 'app-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss']
})
export class ProvidersListComponent implements OnInit {
  providers: [];
  searchTerm;
  pageNo: number;
  navLink;
  constructor(private modalService: NgbModal,
    private notifyService: NotificationService,
    private providerService: ProviderService,
    private router: Router) { }

  ngOnInit() {
    this.navLink = this.router.url;
    this.getProviders();
  }

  getProviders() {
    this.providerService.getAllProvider().subscribe((data: any) => {
      this.providers = data.providers;
      // this.providers = data.providers.filter(function(provider) {
      //   return provider.activeStatus == true ;
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

  createProvider() {
    const modalRef = this.modalService.open(CreateProviderComponent);
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

  updateProvider(provider) {
    const modalRef = this.modalService.open(CreateProviderComponent);
    modalRef.componentInstance.selectedProvider = provider;
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
