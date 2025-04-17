import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderRoutingModule} from './order-routing.module';
import {CartComponent} from './cart/cart.component';
import {OrderComponent} from './order/order.component';
import {CountSelectorComponent} from '../../shared/components/count-selector/count-selector.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {ProductCardComponent} from '../../shared/components/product-card/product-card.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    CartComponent,
    OrderComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    CountSelectorComponent,
    CarouselModule,
    ProductCardComponent,
    ReactiveFormsModule,
  ]
})
export class OrderModule {
}
