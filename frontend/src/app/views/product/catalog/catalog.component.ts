import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../shared/services/product.service';
import {Product} from '../../../types/product.types';
import {CategoryService} from '../../../shared/services/category.service';
import {CategoryWithTypes} from '../../../types/category.types';
import { ActiveParam } from '../../../types/activeParam.types';
import { ActiveParamsUtils } from '../../../shared/utils/active-params.util';
import { AppliedFilterType } from '../../../types/applied-filter.type';
import {debounceTime} from 'rxjs';
import { CartService } from '../../../shared/services/cart.service';
import { CartType } from '../../../types/cart.types';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { FavoriteType } from '../../../types/favorite.types';
import { DefaultErrorResponse } from '../../../types/default-error.type';
import {AuthService} from '../../../core/auth/auth.service';

@Component({
  selector: 'app-catalog',
  standalone: false,
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {

  protected products: Product[] = [];
  protected categoriesWithTypes: CategoryWithTypes[] = [];
  activeParams:ActiveParam = {types: []}
  appliedFilters: AppliedFilterType [] = [];
  sortingOpen = false;
  cart: CartType | null = null;
  favoriteProducts: FavoriteType[] | null = null;
  sortingOptions:{name: string, value: string}[] =[
    {name: 'От А до Я', value: 'az-asc'},
    {name: 'От Я до А', value: 'az-desc'},
    {name: 'По возрастанию цены', value: 'price-asc'},
    {name: 'По убыванию цены', value: 'price-desc'},
  ] ;

  pages:number[] =[];

  constructor(private productService: ProductService,
              private router: Router,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private cartService: CartService,
              private favoriteService: FavoriteService,
              private authService: AuthService,) {}

  ngOnInit(): void {
    this.cartService.getCart()
    .subscribe((data: CartType | DefaultErrorResponse)=>{
      if((data as DefaultErrorResponse).error !== undefined){
        throw new Error((data as DefaultErrorResponse).message);
      }
      this.cart = data as CartType;

      if(this.authService.getisLoggedIn()) {
        this.favoriteService.getFavorites()
          .subscribe({
            next: (data: FavoriteType[] | DefaultErrorResponse) => {
              if ((data as DefaultErrorResponse).error !== undefined) {
                const error = (data as DefaultErrorResponse).message;
                this.processCatalog();
                throw new Error(error);
              }
              this.favoriteProducts = data as FavoriteType[];
              this.processCatalog();
            },
            error: (error) => {
              this.processCatalog();
            }
          });
      }else{
        this.processCatalog();
      }
  });
}

  processCatalog(){
    this.categoryService.getCategoriesWithTypes()
    .subscribe(categories => {
        this.categoriesWithTypes = categories;
        this.activatedRoute.queryParams
          .pipe(
            debounceTime(800)
          )

          .subscribe(params =>{
          this.activeParams = ActiveParamsUtils.processParams(params);

          this.appliedFilters = [];
          this.activeParams.types.forEach(url =>{

            for(let i = 0;i < this.categoriesWithTypes.length; i++){
                const foundType = this.categoriesWithTypes[i].types.find(type => type.url === url)
                if(foundType){
                  this.appliedFilters.push({
                    name:  foundType.name,
                    urlParam: foundType.url
                  })
                }
            }
          });
            if(this.activeParams.heightFrom){
              this.appliedFilters.push({
                name: 'Высота от ' + this.activeParams.heightFrom + ' см',
                urlParam: 'heightFrom'
              })
            }
            if(this.activeParams.heightTo){
              this.appliedFilters.push({
                name: 'Высота до ' + this.activeParams.heightTo + ' см',
                urlParam: 'heightTo'
              })
            }
            if(this.activeParams.diameterFrom){
              this.appliedFilters.push({
                name: 'Диаметр от ' + this.activeParams.diameterFrom + ' см',
                urlParam: 'diameterFrom'
              })
            }
            if(this.activeParams.diameterTo){
              this.appliedFilters.push({
                name: 'Диаметр до ' + this.activeParams.diameterTo + ' см',
                urlParam: 'diameterTo'
              })
            }
          this.productService.getProducts(this.activeParams)
            .subscribe(products => {
              this.pages = [];
              for (let i = 1; i <= products.pages ; i++) {
                this.pages.push(i);
              }
              if(this.cart && this.cart.items.length > 0){
                this.products = products.items.map(product => {
                  if(this.cart){
                    const productInCart = this.cart.items.find(item => item.product.id === product.id);
                    if(productInCart){
                      product.countInCart = productInCart?.quantity
                    }
                  }
                  return product;
                })
              }else{
                this.products = products.items;
              }
              if(this.favoriteProducts){
                this.products = this.products
                .map(product => {
                  if(this.favoriteProducts){
                    const productInFavorite = this.favoriteProducts?.find(item => item.id === product.id)
                    if(productInFavorite){
                      product.isInFavorite = true;
                    }
                  }
                  return product;
                })
              }

            })
        })
    })
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType){
    if(appliedFilter.urlParam === 'heightFrom' || appliedFilter.urlParam === 'heightTo'
    || appliedFilter.urlParam === 'diameterFrom' || appliedFilter.urlParam === 'diameterTo'){
      delete this.activeParams[appliedFilter.urlParam];
    }else{
      this.activeParams.types = this.activeParams.types.filter(item => item !== appliedFilter.urlParam)
    }
    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

  toggleSorting(){
    this.sortingOpen = !this.sortingOpen;
  }

  sort(value: string) {
    this.activeParams.sort = value;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

  openNextPage() {
    if(this.activeParams.page && this.activeParams.page < this.pages.length){
     this.activeParams.page++;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      });
    }
  }

  openPrevPage() {
    if(this.activeParams.page && this.activeParams.page > 1){
      this.activeParams.page--;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      });
    }
  }
}
