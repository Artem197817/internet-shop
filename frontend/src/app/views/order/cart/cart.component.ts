import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ProductService } from '../../../shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../types/product.types';
import { CartService } from '../../../shared/services/cart.service';
import { CartType } from '../../../types/cart.types';
import { environment } from '../../../../environments/environment';
import {DefaultErrorResponse} from '../../../types/default-error.type';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  extraProducts: Product[] = [];
  cart: CartType | null = null;
  totalAmount: number = 0;
  totalCount: number = 0;
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
    private activatedRoute: ActivatedRoute,
    private cartService: CartService ){

  }

  ngOnInit():void{
    this.productService.getProductsBest()
    .subscribe((data: Product[]) => {
      this.extraProducts = data;
    })

    this.cartService.getCart()
    .subscribe((data: CartType | DefaultErrorResponse ) => {
      if((data as DefaultErrorResponse).error !== undefined){
        const error = (data as DefaultErrorResponse).message;
        throw new Error(error);
      }
        this.cart = data as CartType;
        this.calculateTotal();
    })
  }
  calculateTotal(){
    this.totalAmount = 0;
    this.totalCount = 0;
    if(this.cart){
      this.cart.items.forEach(item =>{
        this.totalAmount += item.quantity * item.product.price;
        this.totalCount += item.quantity;
      })
    }
  }
  updateCount(id:string, value: number){
    if(this.cart){
     this.cartService.updateCart(id, value)
     .subscribe((data: CartType | DefaultErrorResponse) => {
       if((data as DefaultErrorResponse).error !== undefined){
         const error = (data as DefaultErrorResponse).message;
         throw new Error(error);
       }
       this.cart = data as CartType;
       this.calculateTotal();
     })
    }
   }
}
