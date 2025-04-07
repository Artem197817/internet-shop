import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import {CountSelectorComponent} from '../../shared/components/count-selector/count-selector.component';


@NgModule({
  declarations: [
    CartComponent,
    OrderComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    CountSelectorComponent
  ]
})
export class OrderModule { }
