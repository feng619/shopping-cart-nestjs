import { createConnection } from 'typeorm'

import { ItemEntity } from '../entity/item.entity'
import { OrderEntity } from '../entity/order.entity'
import { UserEntity } from '../entity/user.entity'

export const dbProvider = {
    provide: 'DbConnectionToken',
    useFactory: async () =>
        await createConnection({
            type: 'postgres',
            host: process.env.CART_DB_HOST,
            port: 5432,
            username: 'postgres',
            password: 'pw',
            database: 'pgdb',
            entities: [ItemEntity, OrderEntity, UserEntity],
            synchronize: true, // DEV only, do not use on PROD!
        }),
}
