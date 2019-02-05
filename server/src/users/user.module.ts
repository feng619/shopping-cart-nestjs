import { Module } from '@nestjs/common'

import { DBModule } from '../db/db.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { userProviders } from './user.providers'
import { itemProviders } from '../items/item.providers'
import { orderProviders } from '../orders/order.providers'

@Module({
    modules: [DBModule],
    controllers: [UserController],
    components: [
        ...userProviders,
        ...itemProviders,
        ...orderProviders,
        UserService,
    ],
})
export class UsersModule {}
