import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { ItemsModule } from '../items/item.module'
import { OrdersModule } from '../orders/order.module'
import { UsersModule } from '../users/user.module'

@Module({
    imports: [ItemsModule, OrdersModule, UsersModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
