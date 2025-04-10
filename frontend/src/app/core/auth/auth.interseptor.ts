import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    
    constructor(private authService: AuthService){}
    
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
      ): Observable<HttpEvent<any>> {
      
        const tokens = this.authService.getTokens();
        if (tokens && tokens.accessToken){
            const authReq = request.clone({
                headers: request.headers.set('x-access-token', tokens.accessToken)
            })
            return next.handle(authReq)
            .pipe(
                catchError((error) => {
                    if(error.status === 401 && authReq.url.includes('/login') && authReq.url.includes('/refresh')){
                        return this.handle401Request(authReq, next)
                    }
                    return throwError(()=>error)
                })
            )
        }
    
        return next.handle(request);
      }

      handle401Request( request: HttpRequest<any>, next: HttpHandler){

      }
}