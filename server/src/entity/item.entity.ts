import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class ItemEntity {
    @PrimaryColumn('uuid')
    item_id: string

    @Column('text')
    item_name: string

    @Column()
    price: number

    @Column()
    items_in_stock: number
}
