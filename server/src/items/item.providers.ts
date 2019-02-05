import { Connection } from 'typeorm'

import { ItemEntity } from '../entity/item.entity'

export const itemProviders = [
    {
        provide: 'ItemRepositoryToken',
        useFactory: (connection: Connection) =>
            connection.getRepository(ItemEntity),
        inject: ['DbConnectionToken'],
    },
]
