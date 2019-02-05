import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm'
import { OrderEntity } from './order.entity'
import { OrderDetails } from './interface'

@Entity()
export class UserEntity {
    @PrimaryColumn('uuid')
    user_id: string

    @Column('text')
    user_name: string

    @Column()
    account: string

    @Column()
    password: string

    @Column()
    credit: number

    @Column('jsonb')
    cart: OrderDetails[]

    @OneToMany(type => OrderEntity, order => order.user)
    orders: OrderEntity[]

    @Column()
    created_time: number

    @Column()
    last_login_time: number
}
