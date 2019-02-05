import { Get, Post, Put, Delete, Body, Controller, Param } from '@nestjs/common'
import { UserService } from './user.service'

import { User } from './user.interface'
import {
    CreateUserDto,
    UserLoginDto,
    UserDepositDto,
    UserAddItemDto,
    UserRemoveItemDto,
    UserCheckoutDto,
} from './user.dto'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers()
    }

    @Get(':userId')
    getUser(@Param('userId') userId: string) {
        return this.userService.getUser(userId)
    }

    @Get(':userId/orderlist')
    getUserOrderList(@Param('userId') userId: string) {
        return this.userService.getUserOrderList(userId)
    }

    @Get(':userId/cart')
    getUserCart(@Param('userId') userId: string) {
        return this.userService.getUserCart(userId)
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }

    @Put('login')
    login(@Body() userLoginDto: UserLoginDto) {
        return this.userService.login(userLoginDto)
    }

    @Put('deposit')
    deposit(@Body() userDepositDto: UserDepositDto) {
        return this.userService.deposit(userDepositDto)
    }

    @Put('additem')
    addItem(@Body() userAddItemDto: UserAddItemDto) {
        return this.userService.addItem(userAddItemDto)
    }

    @Put('removeitem')
    removeItem(@Body() userRemoveItemDto: UserRemoveItemDto) {
        return this.userService.removeItem(userRemoveItemDto)
    }

    @Put('checkout')
    checkout(@Body() userCheckoutDto: UserCheckoutDto) {
        return this.userService.checkout(userCheckoutDto)
    }

    @Delete(':userId')
    deleteUser(@Param('userId') userId: string) {
        return this.userService.deleteUser(userId)
    }
}
