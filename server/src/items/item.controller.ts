import { Get, Post, Put, Delete, Body, Controller, Param } from '@nestjs/common'
import { ItemService } from './item.service'

import { CreateItemDto, UpdateItemDto } from './item.dto'

@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Get()
    getAllItems() {
        return this.itemService.getAllItems()
    }

    @Get(':itemId')
    getItem(@Param('itemId') itemId: string) {
        return this.itemService.getItem(itemId)
    }

    @Post()
    createItem(@Body() createItemDto: CreateItemDto) {
        return this.itemService.createItem(createItemDto)
    }

    @Put()
    updateItem(@Body() updateItemDto: UpdateItemDto) {
        return this.itemService.updateItem(updateItemDto)
    }

    @Delete(':itemId')
    deleteItem(@Param('itemId') itemId: string) {
        return this.itemService.deleteItem(itemId)
    }
}
