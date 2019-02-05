import { IsEmail, IsString, Length, IsInt, Min } from 'class-validator'

export class CreateUserDto {
    @IsString()
    @Length(3, 32)
    readonly user_name: string

    @IsEmail()
    readonly account: string

    @IsString()
    @Length(6, 18)
    readonly password: string

    @IsInt()
    @Min(0)
    readonly credit: number
}

export class UserLoginDto {
    @IsEmail()
    readonly account: string

    @IsString()
    @Length(6, 18)
    readonly password: string
}

export class UserDepositDto {
    @IsString()
    readonly user_id: string

    @IsInt()
    @Min(0)
    readonly amount: number
}

export class UserAddItemDto {
    @IsString()
    readonly user_id: string

    @IsString()
    readonly item_id: string

    @IsInt()
    @Min(0)
    readonly amount: number
}

export class UserRemoveItemDto {
    @IsString()
    readonly user_id: string

    @IsString()
    readonly item_id: string
}

export class UserCheckoutDto {
    @IsString()
    readonly user_id: string
}
