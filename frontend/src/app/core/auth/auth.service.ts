import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {DefaultErrorResponse} from '../../types/default-error.type';
import {LoginResponseType} from '../../types/login-response.type';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged:boolean = false;
  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }
  public getisLoggedIn(): boolean{
    return this.isLogged;
  }

  login(email: string, password: string, rememberMe: boolean = false): Observable<DefaultErrorResponse | LoginResponseType> {
    return this.http.post<DefaultErrorResponse | LoginResponseType>(environment.api + 'login', {
      email,
      password,
      rememberMe,
    })
  }
 public signup(email: string, password: string, passwordRepeat: string): Observable<DefaultErrorResponse | LoginResponseType> {
    return this.http.post<DefaultErrorResponse | LoginResponseType>(environment.api + 'signup', {
      email,
      password,
      passwordRepeat,
    })
  }
 public logout(): Observable<DefaultErrorResponse> {
    const tokens = this.getTokens()
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultErrorResponse>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken,
      })
    }
    throw throwError(() => 'Can token not find')
  }

  public setTokens(accessToken: string, refreshToken: string): void{
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }
  public removeTokens(): void{
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }
  public getTokens(): {accessToken: string|null, refreshToken: string|null }{
    return {accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)};

  }

   set userId(userId: string | null){
    if(userId) {
      localStorage.setItem(this.userIdKey, userId);
    }else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  get userId():string | null{
    return localStorage.getItem(this.userIdKey);
  }
}
