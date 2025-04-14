import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {Product} from '../../../types/product.types';
import {ProductService} from '../../../shared/services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {CartService} from '../../../shared/services/cart.service';
import {CartType} from '../../../types/cart.types';
import {FavoriteService} from '../../../shared/services/favorite.service';
import {DefaultErrorResponse} from '../../../types/default-error.type';
import {FavoriteType} from '../../../types/favorite.types';
import {AuthService} from '../../../core/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {

  count: number = 1
  protected bestProducts: Product[] = [];
  protected product!: Product;
  protected serverStaticPath = environment.serverStaticPath;

  protected customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    margin: 26,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },

      940: {
        items: 4
      }
    },
    nav: false
  }

  constructor(private productService: ProductService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private cartService: CartService,
              private favoriteService: FavoriteService,
              private authService: AuthService,
              private snackBar: MatSnackBar,) {
  }


  ngOnInit() {
    this.activatedRoute.params
      .subscribe(params => {
        this.productService.getProduct(params['url'])
          .subscribe((data: Product) => {
            this.product = data;
            this.cartService.getCart()
              .subscribe((cartData: CartType | DefaultErrorResponse) => {
                if ((cartData as DefaultErrorResponse).error !== undefined) {
                  throw new Error((cartData as DefaultErrorResponse).message);
                }
                if (cartData as CartType) {
                  const productInCart = (cartData as CartType).items.find(item => item.product.id === data.id)
                  if (productInCart) {
                    this.product.countInCart = productInCart.quantity;
                    this.count = this.product.countInCart;
                  }
                }
              });

            if (this.authService.getisLoggedIn()) {
              this.favoriteService.getFavorites()
                .subscribe((data: FavoriteType[] | DefaultErrorResponse) => {
                  if ((data as DefaultErrorResponse).error !== undefined) {
                    const error = (data as DefaultErrorResponse).message;
                    throw new Error(error);
                  }
                  const products = data as FavoriteType[];
                  const currentProductExist = products.find(item => item.id === this.product.id);
                  if (currentProductExist) {
                    this.product.isInFavorite = true;
                  }
                })
            }
          })
      })


    this.productService.getProductsBest()
      .subscribe((bestProducts: Product[]) => {
        this.bestProducts = bestProducts;
      })
  }


  addToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultErrorResponse) => {
        if ((data as DefaultErrorResponse).error !== undefined) {
          throw new Error((data as DefaultErrorResponse).message);
        }
        this.product.countInCart = this.count;
      })
  }

  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultErrorResponse) => {
        if ((data as DefaultErrorResponse).error !== undefined) {
          throw new Error((data as DefaultErrorResponse).message);
        }
        this.product.countInCart = 0;
        this.count = 1;
      })
  }

  updateCount(value: number) {
    this.count = value;
    if (this.product.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultErrorResponse) => {
          if ((data as DefaultErrorResponse).error !== undefined) {
            throw new Error((data as DefaultErrorResponse).message);
          }
          this.product.countInCart = this.count;
        })
    }
  }

  addToFavorite() {
    if (!this.authService.getisLoggedIn()) {
      this.snackBar.open('Опция доступна для авторизованных пользователей');
    }
    if (this.product.isInFavorite) {
      this.favoriteService.removeFavorites(this.product.id)
        .subscribe(data => {
          if (data.error) {
            throw new Error(data.message);
          }
          this.product.isInFavorite = false;
        })
      return;
    }
    this.favoriteService.addToFavorites(this.product.id)
      .subscribe((data: FavoriteType | DefaultErrorResponse) => {
        if ((data as DefaultErrorResponse).error !== undefined) {
          const error = (data as DefaultErrorResponse).message;
          throw new Error(error);
        }
        this.product.isInFavorite = true;
      })
  }
}
