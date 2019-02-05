import { Get, Delete, Param, Controller } from '@nestjs/common'
import { OrderService } from './order.service'

import { Order } from './order.interface'

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    getAllOrders(): Promise<Order[]> {
        return this.orderService.getAllOrders()
    }

    @Delete(':orderId')
    deleteOrder(@Param('orderId') orderId: string) {
        return this.orderService.deleteOrder(orderId)
    }
}
