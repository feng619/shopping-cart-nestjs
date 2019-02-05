import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

import { AppModule } from '../app/app.module'
import { Item } from '../items/item.interface'

describe('App e2e-spec', () => {
    const TEST_ITEM_NAME = '茶杯',
        TEST_ITEM_PRICE = 10,
        TEST_ITEM_IN_STOCK = 100
    let testItem: Item, testItemId: string
    let app: INestApplication
    let server

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()

        if (!app) {
            process.exit(1)
        }

        await app.init()

        server = app.getHttpServer()
    })

    it('/POST item', async () => {
        await request(server)
            .post('/item')
            .send({
                item_name: TEST_ITEM_NAME,
                price: TEST_ITEM_PRICE,
                items_in_stock: TEST_ITEM_IN_STOCK,
            })
            .set('Accept', 'application/json')
            .expect(201)
            .then(async () => {
                // 取得商品 uuid
                await request(server)
                    .get('/item')
                    .then(res => {
                        testItem = res.body[0]
                        testItemId = testItem.item_id
                    })
            })
    })

    it('/GET item/:itemId', () => {
        return request(server)
            .get(`/item/${testItemId}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                item_name: TEST_ITEM_NAME,
                price: TEST_ITEM_PRICE,
                items_in_stock: TEST_ITEM_IN_STOCK,
            })
    })

    it('/PUT item/:itemId', async () => {
        const CHANGE_PRICE = 25,
            CHANGE_IN_STOCK = 500

        await request(server)
            .put('/item')
            .send({
                item_id: testItemId,
                price: CHANGE_PRICE,
                items_in_stock: CHANGE_IN_STOCK,
            })
            .set('Accept', 'application/json')
            .expect(200)

        await request(server)
            .get(`/item/${testItemId}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                item_name: TEST_ITEM_NAME,
                price: CHANGE_PRICE,
                items_in_stock: CHANGE_IN_STOCK,
            })
    })

    afterAll(async () => {
        // 移除商品
        await request(server)
            .delete(`/item/${testItemId}`)
            .expect(200)
            .then(async () => {
                await request(server)
                    .get('/item')
                    .then(res => {
                        console.log('item.e2e afterAll /item ', res.body)
                    })
            })

        await app.close()
    })
})
