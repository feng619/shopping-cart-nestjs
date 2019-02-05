import { Connection } from 'typeorm'

import { UserEntity } from '../entity/user.entity'

export const userProviders = [
    {
        provide: 'UserRepositoryToken',
        useFactory: (connection: Connection) =>
            connection.getRepository(UserEntity),
        inject: ['DbConnectionToken'],
    },
]
