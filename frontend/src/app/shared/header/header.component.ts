import {Component, HostListener, Input, OnInit} from '@angular/core';
import {CategoryWithTypes} from '../../types/category.types';
import {AuthService} from '../../core/auth/auth.service';
import {DefaultErrorResponse} from '../../types/default-error.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {CartService} from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { Product } from '../../types/product.types';
import {environment} from '../../../environments/environment';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  protected headerTopMenuList = [
    {title: 'Главная', link: '/'},
    {title: 'Каталог', link: '/catalog'},
    {title: 'Отзывы', link: '/', fragment: 'reviews'},
    {title: 'Доставка и оплата', link: '/', fragment: 'delivery'},
  ]
  isLoggedIn: boolean = false;
  count:number = 0;
//  searchValue: string = '';
  products: Product[] = [];
  protected serverStaticPath = environment.serverStaticPath;
  showedSearch: boolean = false;
  searchField = new FormControl();

  @Input() categories: CategoryWithTypes[] = [];

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar,
              private router: Router,
              private cartService: CartService,
              private productService: ProductService,) {
    this.isLoggedIn = authService.getisLoggedIn();
  }

  ngOnInit(): void {
    this.searchField.valueChanges
    .pipe(
      debounceTime(800)
    )
    .subscribe(value => {
      if (value && value.length > 2) {
        this.productService.searchProducts(value)
        .subscribe((data: Product[]) => {
          this.products = data;
          this.showedSearch = true;
        })
      }else{
        this.products = [];
      }
    })

    this.authService.isLogged$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    })

      this.cartService.getCartCount()
        .subscribe((data: { count: number } | DefaultErrorResponse) => {
          if((data as DefaultErrorResponse).error !== undefined){
            throw new Error((data as DefaultErrorResponse).message);
          }
          this.count = (data as { count: number }).count;
        })

    this.cartService.count$
    .subscribe(count => {
      this.count = count;
    })
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: (data: DefaultErrorResponse) => {
          this.doLogout()

        },
        error: (err: HttpErrorResponse) => {
          this.doLogout()
        }
      })
  }

  private doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.snackBar.open('Logout')
    this.router.navigate(['/'])
  }

  /** 
  changeSearchValue(newValue: string) {
    this.searchValue = newValue;

    if (this.searchValue && this.searchValue.length > 2) {
      this.productService.searchProducts(this.searchValue)
      .subscribe((data: Product[]) => {
        this.products = data;
        this.showedSearch = true;
      })
    }else{
      this.products = [];
    }
  }*/
  selectProduct(url: string){
    this.router.navigate(['/product/' + url]);
    this.searchField.setValue('');
    this.products = [];
  }

@HostListener('document:click', ['$event'])
  click(event: Event){
    if(this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1){
      this.showedSearch = false;
    }
  }
}

// this.authService.logout()
//   .subscribe({
//     next: (data: DefaultErrorResponse) => {
//       if (data.error) {
//         this.snackBar.open('Error logout')
//         throw new Error(data.message)
//       }
//
//     },
//     error: (err: HttpErrorResponse) => {
//       if (err.error && err.error.message) {
//         this.snackBar.open(err.error.message);
//       } else {
//         this.snackBar.open('Error logout')
//       }
//     }
//   })
