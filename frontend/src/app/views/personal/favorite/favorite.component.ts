import {Component, OnInit} from '@angular/core';
import {FavoriteService} from '../../../shared/services/favorite.service';
import {DefaultErrorResponse} from '../../../types/default-error.type';
import {FavoriteType} from '../../../types/favorite.types';
import {environment} from '../../../../environments/environment';
import {CartService} from '../../../shared/services/cart.service';
import {CartType} from '../../../types/cart.types';
import {count, forkJoin} from 'rxjs';

@Component({
  selector: 'app-favorite',
  standalone: false,
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {

  protected products: FavoriteType[] = [];
  protected count: number = 0;
  protected serverStaticPath = environment.serverStaticPath;
  public cart: CartType | null = null;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService,) {
    this.count = cartService.getCount();
  }

  ngOnInit(): void {
    forkJoin({
      favorites: this.favoriteService.getFavorites(),
      cart: this.cartService.getCart()
    }).subscribe({
      next: ({ favorites, cart }) => {
        // Handle favorites response
        if ((favorites as DefaultErrorResponse).error !== undefined) {
          const error = (favorites as DefaultErrorResponse).message;
          this.handleError(error);
          return;
        }
        this.products = favorites as FavoriteType[];

        if ((cart as DefaultErrorResponse).error !== undefined) {
          const error = (cart as DefaultErrorResponse).message;
          this.handleError(error);
          return;
        }
        this.cart = cart as CartType;

        if (this.products.length > 0 && this.cart.items.length > 0 && this.cart.items)  {
          this.products.forEach(product => {
            if(this.cart && this.cart.items.length > 0){
              const productInCart = this.cart.items.find(item => item.product.id === product.id);
              product.isInCart = !!productInCart;
            }
          });
        }
      },
      error: (err) => {
        this.handleError('Ошибка загрузки данных');
        console.error(err);
      }
    });

    this.cartService.count$
      .subscribe(count => {
        this.count = count;
      })

  }

  private handleError(message: string) {
    console.error(message);
  }





  addToCart(product: FavoriteType) {
    this.cartService.updateCart(product.id, 1)
      .subscribe((data: CartType | DefaultErrorResponse) => {
        if ((data as DefaultErrorResponse).error !== undefined) {
          throw new Error((data as DefaultErrorResponse).message);
        }
        product.isInCart = true;
      })
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorites(id)
      .subscribe(data => {
        if (data.error) {
          throw new Error(data.message);
        }
        this.products = this.products.filter(item => item.id !== id);
      })
  }
}
