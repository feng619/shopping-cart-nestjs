import { Module } from '@nestjs/common'

import { DBModule } from '../db/db.module'
import { ItemController } from './item.controller'
import { ItemService } from './item.service'
import { itemProviders } from './item.providers'

@Module({
    modules: [DBModule],
    controllers: [ItemController],
    components: [...itemProviders, ItemService],
})
export class ItemsModule {}
