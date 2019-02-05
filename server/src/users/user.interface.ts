import { OrderEntity } from '../entity/order.entity'
import { OrderDetails } from '../entity/interface'

export interface ShortUser {
    user_name: string
    account: string
    credit: number
    created_time: number
    last_login_time: number
}

export interface User {
    user_id: string
    user_name: string
    account: string
    password: string
    credit: number
    cart: OrderDetails[]
    orders: OrderEntity[]
    created_time: number
    last_login_time: number
}

export interface ShortItemListRow {
    item_id: string
    amount: number
}

export interface ItemListRow {
    item_id: string
    item_name: string
    item_price: number
    amount: number
    subtotal: number
}

export interface ItemList {
    total: number
    item_list: ItemListRow[]
}

export interface OrderListRow {
    order_id: string
    item_list: ItemListRow[]
    created_time: number
    total: number
}

export interface OrderList {
    account: string
    name: string
    order_list: OrderListRow[]
}
