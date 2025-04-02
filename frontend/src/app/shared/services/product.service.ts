import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Product, Products} from '../../types/product.types';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductsBest(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.api + 'products/best')
  }

  getProducts(): Observable<Products> {
    return this.http.get<Products>(environment.api + 'products')
  }


}
