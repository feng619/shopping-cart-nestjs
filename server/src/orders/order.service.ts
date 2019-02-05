import { Component, Inject, BadRequestException } from '@nestjs/common'
import { Repository } from 'typeorm'

import { Order } from './order.interface'

@Component()
export class OrderService {
    constructor(
        @Inject('OrderRepositoryToken')
        private readonly orderRepository: Repository<Order>
    ) {}

    async getAllOrders(): Promise<Order[]> {
        try {
            return await this.orderRepository.find()
        } catch (err) {
            return err
        }
    }

    async deleteOrder(order_id: string) {
        try {
            const order = await this.orderRepository.findOne({ order_id })

            if (!order) {
                throw new BadRequestException('訂單不存在')
            }

            return await this.orderRepository.remove(order)
        } catch (err) {
            return err
        }
    }
}
