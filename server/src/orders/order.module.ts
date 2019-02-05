import { Module } from '@nestjs/common'

import { DBModule } from '../db/db.module'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { orderProviders } from './order.providers'

@Module({
    modules: [DBModule],
    controllers: [OrderController],
    components: [...orderProviders, OrderService],
})
export class OrdersModule {}
