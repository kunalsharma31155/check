import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTransferService } from './data-transfer.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  constructor(private http: HttpClient,
    private router: Router,
    private datatransferService : DataTransferService) { }

  createProvider(data){
    return this.http.post(`${environment.apiBaseUrl}/provider/create-provider`,data);
  }

  updateProvider(data){
    return this.http.post(`${environment.apiBaseUrl}/provider/update-provider`,data);
  }

  userLogin(data){
    return this.http.post(`${environment.apiBaseUrl}/user/login`,data);
  }

  logout(){
    localStorage.removeItem('Token');
    this.router.navigate(['/login']);
    this.datatransferService.changeNavbar(null);
  }

  getAllProvider(){
    return this.http.get(`${environment.apiBaseUrl}/provider/get-all-providers`);
  }
  getCurrentUser(id) {
    return this.http.get(`${environment.apiBaseUrl}/user/get-current-user/${id}`);
  }

}
