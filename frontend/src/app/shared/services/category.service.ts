import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {CategoryType, CategoryWithTypes, TypesResponse} from '../../types/category.types';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api + 'categories')
  }
  getCategoriesWithTypes(): Observable<CategoryWithTypes[]> {
    return this.http.get<TypesResponse[]>(environment.api + 'types')
      .pipe(
        map((types: TypesResponse[]) => {
          const array: CategoryWithTypes[] = [];

              types.forEach((type: TypesResponse) => {

                const foundCategory = array.find(arrayItem => arrayItem.url === type.category.url);
                if(foundCategory){
                  foundCategory.types.push({
                    id: type.id,
                    name: type.name,
                    url: type.url,
                  });
                } else {
                  array.push({
                    id: type.category.id,
                    name: type.category.name,
                    url: type.category.url,
                    types: [
                      {
                        id: type.id,
                        name: type.name,
                        url: type.url,
                      }
                    ]
                  });
                }
              });
          return array;
        })
      )
  }
}
