import { Component, OnInit } from '@angular/core';

import { DataTransferService } from '../../services/data-transfer.service';
import { UserAccessService } from '../../services/user-access.service';
@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent implements OnInit {
  access;
  navbar = [{name:"Home",logo:"fa fa-home",link:""},
  {name:"Admin",logo:"fa fa-user-circle",link:"admin"},
  {name:"Data Entry",logo:"fa fa-database",link:"data-entry"},
  {name:"Reports",logo:"fa fa-file-text",link:"reports"},
];

  constructor(private datatransferService : DataTransferService,
    private userAccess : UserAccessService) { }

  ngOnInit() {
    this.navBar();
  }

  navBar(){
    this.userAccess.getSpecificUserAccess().subscribe((res:any)=>{
      this.access = res.result;
      for(let i=0;i<this.navbar.length;i++){
        if(this.navbar[i].link == "admin" && this.access.admin == false){
          this.navbar.splice(i, 1);
        }else if(this.navbar[i].link == "data-entry" && this.access.dataentry == false){
          this.navbar.splice(i, 1);
        }else if(this.navbar[i].link == "reports" && this.access.reports == false){
            this.navbar.splice(i, 1);
        }
      }
    this.datatransferService.changeNavbar(this.navbar);
    })
  }
}
