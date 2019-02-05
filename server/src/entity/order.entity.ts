import { Column, Entity, PrimaryColumn, ManyToOne } from 'typeorm'
import { UserEntity } from './user.entity'
import { OrderDetails } from './interface'

@Entity()
export class OrderEntity {
    @PrimaryColumn('uuid')
    order_id: string

    @ManyToOne(type => UserEntity, user => user.orders, {
        cascade: true,
    })
    user: UserEntity

    @Column('jsonb')
    order_details: OrderDetails[]

    @Column()
    created_time: number
}
