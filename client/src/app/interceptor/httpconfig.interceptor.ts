import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(private user: UserService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from  localstorage.
    const authToken = localStorage.getItem('Token');
    let newHeaders = req.headers;
    if (authToken) {
      // If we have a token, we append it to our new headers
      newHeaders = newHeaders.append('x-auth-token', authToken);
    }
    const authReq = req.clone({ headers: newHeaders });
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    // const authReq = req.clone({
    //     headers: req.headers.set('x-auth-token', authToken)
    // });

    // send cloned request with header to the next handler.
    return next.handle(authReq).pipe(catchError(err => {
      if (err.status === 401) {
        this.user.logout();
        location.reload(true);
      }
      return next.handle(authReq);
    }));
  }
}
