import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CartType} from '../../types/cart.types';
import {Observable, Subject, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {DefaultErrorResponse} from '../../types/default-error.type';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  count: number = 0;
  count$: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) {
  }

  getCart(): Observable<CartType | DefaultErrorResponse> {
    return this.http.get<CartType | DefaultErrorResponse>(environment.api + 'cart', {withCredentials: true})

  }

  updateCart(productId: string, quantity: number): Observable<CartType | DefaultErrorResponse> {
    return this.http.post<CartType | DefaultErrorResponse>(environment.api + 'cart', {
      productId,
      quantity
    }, {withCredentials: true})
      .pipe(
        tap((data) => {
          if (!data.hasOwnProperty('error')) {
            this.count = 0;
            (data as CartType).items.forEach(item => {
              this.count += item.quantity;

            })
            this.count$.next(this.count);
          }
        })
      )

  }

  getCartCount(): Observable<{ count: number } | DefaultErrorResponse> {
    return this.http.get<{
      count: number
    } | DefaultErrorResponse>(environment.api + 'cart/count', {withCredentials: true})
      .pipe(
        tap((data) => {
          if (!data.hasOwnProperty('error')) {
            this.count = (data as { count: number }).count;
            this.count$.next(this.count);
          }
        })
      )
  }
}
