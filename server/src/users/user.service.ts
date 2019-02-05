import {
    Component,
    Inject,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common'
import { Repository } from 'typeorm'
import * as uuidv4 from 'uuid/v4'
import * as _ from 'lodash'
import * as bcrypt from 'bcrypt'

import {
    User,
    ShortUser,
    ItemList,
    ItemListRow,
    ShortItemListRow,
    OrderList,
    OrderListRow,
} from './user.interface'
import { Item } from '../items/item.interface'
import { Order } from '../orders/order.interface'
import { UserEntity } from '../entity/user.entity'
import { OrderEntity } from '../entity/order.entity'
import {
    CreateUserDto,
    UserLoginDto,
    UserDepositDto,
    UserAddItemDto,
    UserRemoveItemDto,
    UserCheckoutDto,
} from './user.dto'

@Component()
export class UserService {
    constructor(
        @Inject('UserRepositoryToken')
        private readonly userRepository: Repository<User>,
        @Inject('ItemRepositoryToken')
        private readonly itemRepository: Repository<Item>,
        @Inject('OrderRepositoryToken')
        private readonly orderRepository: Repository<Order>
    ) {}

    async getAllUsers(): Promise<User[]> {
        try {
            return await this.userRepository.find()
        } catch (err) {
            return err
        }
    }

    async getUser(user_id: string): Promise<ShortUser> {
        try {
            const user = await this.userRepository.findOne({ user_id })

            if (!user) {
                throw new BadRequestException('用戶不存在')
            }

            const {
                account,
                user_name,
                credit,
                created_time,
                last_login_time,
            } = user

            return { account, user_name, credit, created_time, last_login_time }
        } catch (err) {
            return err
        }
    }

    async getUserOrderList(user_id: string): Promise<OrderList> {
        try {
            const user = await this.userRepository.findOne({
                relations: ['orders'],
                where: { user_id },
            })

            if (!user) {
                throw new BadRequestException('用戶不存在')
            }

            const order_list = await Promise.all(
                user.orders.map(
                    async (obj): Promise<OrderListRow> => {
                        const { order_id, order_details, created_time } = obj
                        const { total, item_list } = await this.getItemList(
                            order_details
                        )

                        return {
                            order_id,
                            item_list,
                            created_time,
                            total,
                        }
                    }
                )
            )

            return {
                account: user.account,
                name: user.user_name,
                order_list,
            }
        } catch (err) {
            return err
        }
    }

    async getUserCart(user_id: string): Promise<ItemList> {
        try {
            const user = await this.userRepository.findOne({ user_id })

            if (!user) {
                throw new BadRequestException('用戶不存在')
            }

            return await this.getItemList(user.cart)
        } catch (err) {
            return err
        }
    }

    async getItemList(items: ShortItemListRow[]): Promise<ItemList> {
        try {
            if (items.length === 0) {
                return { total: 0, item_list: [] }
            }

            let total = 0
            const item_list = await Promise.all(
                items.map(
                    async (obj): Promise<ItemListRow> => {
                        const { item_id, amount } = obj
                        const item = await this.itemRepository.findOne({
                            item_id,
                        })
                        const subtotal = item.price * amount

                        total += subtotal

                        return {
                            item_id,
                            item_name: item.item_name,
                            item_price: item.price,
                            amount,
                            subtotal,
                        }
                    }
                )
            )

            return { total, item_list }
        } catch (err) {
            return err
        }
    }

    async createUser(param: CreateUserDto) {
        try {
            const duplicatedUser = await this.userRepository.findOne({
                account: param.account,
            })

            if (duplicatedUser) {
                throw new UnauthorizedException('該信箱已經註冊過')
            }

            const user = new UserEntity()
            const now = parseInt(String(Date.now() / 1000), 10)
            const uuid = uuidv4()
            const saltRounds = 10

            user.user_id = uuid
            user.user_name = param.user_name
            user.account = param.account
            user.password = bcrypt.hashSync(param.password, saltRounds)
            user.credit = param.credit
            user.cart = []
            user.orders = []
            user.created_time = now
            user.last_login_time = now

            await this.userRepository.save(user)

            return
        } catch (err) {
            return err
        }
    }

    async login(param: UserLoginDto) {
        try {
            const { account, password } = param
            const user = await this.userRepository.findOne({ account })

            if (!user) {
                throw new BadRequestException('用戶不存在')
            }

            const passed = bcrypt.compareSync(password, user.password)

            if (!passed) {
                throw new UnauthorizedException('密碼錯誤')
            }

            const { user_id, user_name } = user

            return { user_id, user_name }
        } catch (err) {
            return err
        }
    }

    async deposit(param: UserDepositDto) {
        try {
            const { amount } = param
            const user = await this.userRepository.findOne({
                user_id: param.user_id,
            })

            if (!user) {
                throw new BadRequestException('用戶不存在')
            }

            const { user_id, user_name } = user

            user.credit += amount

            await this.userRepository.save(user)

            return { user_id, user_name }
        } catch (err) {
            return err
        }
    }

    async addItem(param: UserAddItemDto) {
        try {
            const { user_id, item_id, amount } = param
            const user = await this.userRepository.findOne({ user_id })
            const item = await this.itemRepository.findOne({ item_id })

            if (!user) {
                throw new BadRequestException('用戶不存在')
            }

            if (!item) {
                throw new BadRequestException('商品不存在')
            }

            const duplicatedItem = _.find(user.cart, { item_id })

            // 檢查商品庫存
            if (amount > item.items_in_stock) {
                throw new UnauthorizedException('商品庫存不足')
            }

            // 加入購物車
            if (duplicatedItem) {
                duplicatedItem.amount += amount
            } else {
                user.cart.push({ item_id, amount })
            }

            item.items_in_stock -= amount

            await this.userRepository.save(user)
            await this.itemRepository.save(item)

            return
        } catch (err) {
            return err
        }
    }

    async removeItem(param: UserRemoveItemDto) {
        try {
            const { user_id, item_id } = param
            const user = await this.userRepository.findOne({ user_id })
            const item = await this.itemRepository.findOne({ item_id })

            if (!user) {
                throw new BadRequestException('用戶不存在')
            }

            if (!item) {
                throw new BadRequestException('商品不存在')
            }

            const removeItem = _.find(user.cart, cv => cv.item_id === item_id)

            if (!removeItem) {
                throw new BadRequestException('無法在購物車內找到要移除的商品')
            }

            _.remove(user.cart, cv => cv.item_id === item_id)

            // 補回庫存
            item.items_in_stock += removeItem.amount

            await this.userRepository.save(user)
            await this.itemRepository.save(item)

            return
        } catch (err) {
            return err
        }
    }

    async checkout(param: UserCheckoutDto) {
        try {
            const { user_id } = param
            const user = await this.userRepository.findOne({ user_id })

            if (!user) {
                throw new BadRequestException('用戶不存在')
            }

            if (user.cart.length === 0) {
                throw new BadRequestException('購物車是空的')
            }

            const itemList = await this.getItemList(user.cart)

            if (itemList.total > user.credit) {
                throw new UnauthorizedException(
                    '會員的存款不夠支付購物車內的商品'
                )
            }

            const order = new OrderEntity()
            const now = parseInt(String(Date.now() / 1000), 10)
            const uuid = uuidv4()

            order.order_id = uuid
            order.order_details = user.cart
            order.created_time = now

            // 結帳
            user.credit -= itemList.total
            user.cart = []

            order.user = user

            await this.orderRepository.save(order)
            await this.userRepository.save(user)

            return
        } catch (err) {
            return err
        }
    }

    async deleteUser(user_id: string) {
        try {
            const user = await this.userRepository.findOne({ user_id })

            if (!user) {
                throw new BadRequestException('用戶不存在')
            }

            return await this.userRepository.remove(user)
        } catch (err) {
            return err
        }
    }
}
