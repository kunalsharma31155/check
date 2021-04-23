import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree , Router} from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router : Router){}
  helper = new JwtHelperService();
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let token = localStorage.getItem('Token');
      const decodedToken = this.helper.decodeToken(token);
      let validity = this.helper.isTokenExpired(token);
      let role = decodedToken.userRole;
      if(token != null && validity == false){
        const decodedToken = this.helper.decodeToken(token);
        let role = decodedToken.userRole;
        let last = state.url.split("/").slice(1);
        if(next.data.roles[0] == role){
          return true;
        }
        else if(next.data.roles[0] == ""){
          this.router.navigate([`/${last[0]}/${role}`]);
          return true;
        }
        else{
          this.router.navigate([`/${last[0]}/${role}`]);
          return true;
        }
    }
    else{
      this.router.navigate([ '/login' ]);
    }
      return false;
  }
  
}
