import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {DefaultErrorResponse} from '../../types/default-error.type';
import { OrderType } from '../../types/order-form.types';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(private http: HttpClient) {
  }


  createOrder(params: OrderType): Observable<OrderType | DefaultErrorResponse> {
    return this.http.post<OrderType | DefaultErrorResponse>(environment.api + 'orders', {
        params
    }, {withCredentials: true})
  }

  getOrders(): Observable<OrderType[] | DefaultErrorResponse> {
    return this.http.get<OrderType[] | DefaultErrorResponse>(environment.api + 'orders')
  }

}