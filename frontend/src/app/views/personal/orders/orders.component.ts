import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../../shared/services/order.service';
import {OrderType} from '../../../types/order-form.types';
import {DefaultErrorResponse} from '../../../types/default-error.type';
import {OrderStatusUtils} from '../../../shared/utils/order-status.util';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  orders: OrderType[] = [];

  constructor(private orderService: OrderService) {
  }


  ngOnInit(): void {
    this.orderService.getOrders()
      .subscribe((data: OrderType[] | DefaultErrorResponse) => {
        if ((data as DefaultErrorResponse).error !== undefined) {
          throw new Error((data as DefaultErrorResponse).message);
        }
        this.orders = (data as OrderType[]).map(item => {
          const status = OrderStatusUtils.getStatusAndColor(item.status);
          item.statusRus = status.name;
          item.color = status.color;
          return item;
        })
      })
  }
}
