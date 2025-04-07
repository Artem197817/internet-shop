import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Product, Products} from '../../types/product.types';
import {ActiveParam} from '../../types/activeParam.types';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.api + 'products';

  constructor(private http: HttpClient) { }

  getProductsBest(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.api + 'products/best')
  }

  getProducts(params?: ActiveParam): Observable<Products> {
    return this.http.get<Products>(this.apiUrl, { params: params });
  }

  getProduct(url: string): Observable<Product> {
    return this.http.get<Product>(this.apiUrl + '/' + url);
  }

}



  // getProducts(params?: ActiveParam): Observable<Products> {
  //   let httpParams = new HttpParams();
  //
  //   if (params?.types) {
  //     params.types.forEach((type) => {
  //       httpParams = httpParams.append('types', type);
  //     });
  //   }
  //   if (params?.heightFrom) {
  //     httpParams = httpParams.append('heightFrom', params.heightFrom);
  //   }
  //   if (params?.heightTo) {
  //     httpParams = httpParams.append('heightTo', params.heightTo);
  //   }
  //   if (params?.diameterFrom) {
  //     httpParams = httpParams.append('diameterFrom', params.diameterFrom);
  //   }
  //   if (params?.diameterTo) {
  //     httpParams = httpParams.append('diameterTo', params.diameterTo);
  //   }
  //   if (params?.sort) {
  //     httpParams = httpParams.append('sort', params.sort);
  //   }
  //   if (params?.page) {
  //     httpParams = httpParams.append('page', params.page.toString());
  //   }
  //
  //   return this.http.get<Products>(this.apiUrl, { params: httpParams });
  // }