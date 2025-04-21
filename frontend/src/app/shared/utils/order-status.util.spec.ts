import { OrderStatusType } from "../../types/order-ststus.type";
import { OrderStatusUtils } from "./order-status.util"

describe('order status util',()=>{

it('should return name and color with no status',()=>{
    const result = OrderStatusUtils.getStatusAndColor(null);
    expect(result.name).not.toBe('');
    expect(result.color).not.toBe('');
})

it('should return new order status with wrong status',()=>{
    const result = OrderStatusUtils.getStatusAndColor('test' as OrderStatusType);
    expect(result.name).toBe('Новый');
})












})