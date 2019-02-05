import { Connection } from 'typeorm'

import { OrderEntity } from '../entity/order.entity'

export const orderProviders = [
    {
        provide: 'OrderRepositoryToken',
        useFactory: (connection: Connection) =>
            connection.getRepository(OrderEntity),
        inject: ['DbConnectionToken'],
    },
]
