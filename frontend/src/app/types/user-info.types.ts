import { DeliveryType } from "./delivery.types";
import { PaymentType } from "./payment.types";

export type UserInfoType ={
    deliveryType?: DeliveryType,
    firstName?: string ,
    lastName?:string ,
    phone?: string ,
    paymentType?: PaymentType,
    email?: string ,
    street?: string ,
    house?: string ,
    entrance?:string,
    apartment?: string ,
    fatherName?: string,
}