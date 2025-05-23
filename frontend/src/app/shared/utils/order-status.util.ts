import {OrderStatusType} from "../../types/order-ststus.type";


export class OrderStatusUtils {
  static getStatusAndColor(status: OrderStatusType | undefined | null): { name: string, color: string } {
    let name = 'Новый';
    let color = "#456F49"

    switch (status) {
      case OrderStatusType.delivery:
        name = 'Доставка';
        break;
      case OrderStatusType.cancelled:
        name = 'Отменен';
        color = '#FF7575'
        break;
      case OrderStatusType.pending:
        name = 'Обработка';
        color = '#456F49'
        break;
      case OrderStatusType.success:
        name = 'Выполнен';
        color = '#B6D5B9'
        break;

    }
    return {name, color};
  }
}
