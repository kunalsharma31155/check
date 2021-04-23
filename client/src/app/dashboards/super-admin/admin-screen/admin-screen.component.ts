import { Component, OnInit } from '@angular/core';
import { UserAccessService } from '../../../services/user-access.service';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {
  permission;
  constructor(private userAccess : UserAccessService) { }

  ngOnInit() {
    this.getuserAccess();
  }

  getuserAccess(){
    this.userAccess.getSpecificUserAccess().subscribe((res:any)=>{
      this.permission = res.result;
    })
  }

}
