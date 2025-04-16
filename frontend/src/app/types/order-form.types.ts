import { DeliveryType } from "./delivery.types";
import { OrderStatusType } from "./order-ststus.type";
import { PaymentType } from "./payment.types";

export type OrderType ={
    deliveryType: DeliveryType,
    firstName: string ,
    lastName:string ,
    phone: string ,
    paymentType: PaymentType,
    email: string ,
    street?: string ,
    house?: string ,
    entrance?:string,
    apartment?: string ,
    comment?: string,
    fatherName?: string,
    items?:
    {
        id: string,
        quantity: number,
        price: number,
        total: number,
        name?: string,
    }[],
    totalAmount?: number,
    status?: OrderStatusType,
    statusRus?: string,
    color?: string,


}