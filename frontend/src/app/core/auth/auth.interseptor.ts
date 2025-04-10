import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, catchError, throwError, switchMap} from 'rxjs';
import { AuthService } from './auth.service';
import {DefaultErrorResponse} from '../../types/default-error.type';
import {LoginResponseType} from '../../types/login-response.type';
import {Router} from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private authService: AuthService,
                private router: Router,){}

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
       return  this.authService.refresh()
          .pipe(
            switchMap( ( result: DefaultErrorResponse| LoginResponseType) => {
              let error = '';
              if((result as DefaultErrorResponse).error !== undefined){
                error = (result as DefaultErrorResponse).message;
              }
              const refreshResult = result as LoginResponseType;
              if(!refreshResult.accessToken || refreshResult.refreshToken  || refreshResult.userId){
                error = 'Ошибка авторизации'
              }
              if(error){
                return  throwError(() => new Error(error))
              }

              this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);
              const authReq = request.clone({
                headers: request.headers.set('x-access-token', refreshResult.accessToken)
              });
              return next.handle(authReq);
            }),
            catchError((error)=>{
              this.authService.removeTokens();
              this.router.navigate(['/'])
              return throwError(() => (error))
            })
          )
      }
}
