import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FavoriteType } from '../../types/favorite.types';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';
import { DefaultErrorResponse } from '../../types/default-error.type';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient) { }

  getFavorites(): Observable<FavoriteType[] | DefaultErrorResponse> {
    return this.http.get<FavoriteType[] | DefaultErrorResponse>(environment.api + 'favorites')
  }
}
