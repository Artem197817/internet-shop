import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../../types/product.types';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {FormsModule} from '@angular/forms';
import {CountSelectorComponent} from '../count-selector/count-selector.component';
import { CartService } from '../../services/cart.service';
import { CartType } from '../../../types/cart.types';

@Component({
  selector: 'product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  imports: [
    NgIf,
    RouterLink,
    FormsModule,
    CountSelectorComponent,
  ],
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent implements OnInit{

  @Input() product!: Product;
  @Input() isLight: boolean = false;
  @Input() countInCart: number | undefined = 0;

 protected serverStaticPath = environment.serverStaticPath;
  public count: number = 1;


constructor(private cartService: CartService){}

ngOnInit(): void {
  if(this.countInCart && this.countInCart > 1){
    this.count =  this.countInCart;
  }
}
  addToCart(){
    this.cartService.updateCart(this.product.id, this.count)
    .subscribe((data: CartType) => {
        this.countInCart = this.count;
    })
  }

  updateCount(value: number){
   this.count = value;
   if(this.countInCart){
    this.cartService.updateCart(this.product.id, this.count)
    .subscribe((data: CartType) => {
      this.countInCart = this.count;
    })
   }
  }

  removeFromCart(){
    this.cartService.updateCart(this.product.id, 0)
    .subscribe((data: CartType) => {
      this.countInCart = 0;
        this.count = 1;
    })
  }
}
