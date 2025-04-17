import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {UserInfoType} from '../../types/user-info.types';
import {Observable} from 'rxjs';
import {DefaultErrorResponse} from '../../types/default-error.type';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  updateUserInfo(params: UserInfoType): Observable<DefaultErrorResponse> {
    return this.http.post<DefaultErrorResponse>(environment.api + 'user', params)
  }

  getUserInfo(): Observable<UserInfoType | DefaultErrorResponse> {
    return this.http.get<UserInfoType | DefaultErrorResponse>(environment.api + 'user')
  }
}
