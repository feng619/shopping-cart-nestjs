import { UserEntity } from '../entity/user.entity'
import { OrderDetails } from '../entity/interface'

export interface Order {
    order_id: string
    user: UserEntity
    order_details: OrderDetails[]
    created_time: number
}
