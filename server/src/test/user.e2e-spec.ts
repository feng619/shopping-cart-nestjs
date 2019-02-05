import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as _ from 'lodash'

import { AppModule } from '../app/app.module'
import { Item } from '../items/item.interface'
import { Order } from '../orders/order.interface'
import { User } from '../users/user.interface'

describe('User e2e-spec', () => {
    const TEST_USER_NAME = 'chien',
        TEST_USER_ACCOUNT = 'abc@gmail.com',
        TEST_USER_PASSWORD = '123456',
        TEST_USER_CREDIT_INIT = 100,
        TEST_ITEM_NAME = '茶杯',
        TEST_ITEM_PRICE = 10,
        TEST_ITEM_IN_STOCK = 100,
        TEST_ITEM_AMOUNT_ADD_TO_CART = 1
    let testItem: Item,
        testItemId: string,
        testUser: User,
        testUserId: string,
        testOrder: Order,
        testOrderId: string
    let app: INestApplication
    let server

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = module.createNestApplication()

        if (!app) {
            process.exit(1)
        }

        await app.init()

        server = app.getHttpServer()

        // 新增一個商品
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

        // 新增一個會員
        await request(server)
            .post('/user')
            .send({
                user_name: TEST_USER_NAME,
                account: TEST_USER_ACCOUNT,
                password: TEST_USER_PASSWORD,
                credit: TEST_USER_CREDIT_INIT,
            })
            .set('Accept', 'application/json')
            .expect(201)
            .then(async () => {
                // 取得會員 uuid
                await request(server)
                    .get('/user')
                    .then(res => {
                        testUser = res.body[0]
                        testUserId = testUser.user_id
                    })

                // 加入購物車
                await request(server)
                    .put('/user/additem')
                    .send({
                        user_id: testUserId,
                        item_id: testItemId,
                        amount: TEST_ITEM_AMOUNT_ADD_TO_CART,
                    })
                    .set('Accept', 'application/json')
                    .expect(200)

                // 更新 testUser 的 cart
                await request(server)
                    .get('/user')
                    .then(res => {
                        testUser = res.body[0]
                    })
            })
    })

    it('/GET user', () => {
        return request(server)
            .get('/user')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect([testUser])
    })

    it('/GET user/:userId', () => {
        return request(server)
            .get(`/user/${testUserId}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                account: testUser.account,
                user_name: testUser.user_name,
                credit: testUser.credit,
                created_time: testUser.created_time,
                last_login_time: testUser.last_login_time,
            })
    })

    it('/GET user/:userId/cart', () => {
        const PAY = TEST_ITEM_PRICE * TEST_ITEM_AMOUNT_ADD_TO_CART

        return request(server)
            .get(`/user/${testUserId}/cart`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                total: PAY,
                item_list: [
                    {
                        item_id: testItemId,
                        item_name: TEST_ITEM_NAME,
                        item_price: TEST_ITEM_PRICE,
                        amount: TEST_ITEM_AMOUNT_ADD_TO_CART,
                        subtotal: PAY,
                    },
                ],
            })
    })

    it('/POST user/login', () => {
        return request(server)
            .put('/user/login')
            .send({ account: TEST_USER_ACCOUNT, password: TEST_USER_PASSWORD })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ user_id: testUserId, user_name: testUser.user_name })
    })

    it('/PUT user/deposit', async () => {
        const AMOUNT = 50,
            TOTAL = testUser.credit + AMOUNT

        await request(server)
            .put('/user/deposit')
            .send({ user_id: testUserId, amount: AMOUNT })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ user_id: testUserId, user_name: testUser.user_name })

        await request(server)
            .get('/user')
            .expect(200)
            .then(res => {
                testUser = res.body[0]
                expect(testUser.credit).toEqual(TOTAL)
            })
    })

    it('/PUT user/removeitem', async () => {
        await request(server)
            .put('/user/removeitem')
            .send({ user_id: testUserId, item_id: testItemId })
            .set('Accept', 'application/json')
            .expect(200)

        await request(server)
            .get('/user')
            .expect(200)
            .then(res => {
                testUser = res.body[0]
                expect(testUser.cart).toEqual([])
            })
    })

    it('/PUT user/checkout', async () => {
        const PAY = TEST_ITEM_PRICE * TEST_ITEM_AMOUNT_ADD_TO_CART

        // 加入購物車
        await request(server)
            .put('/user/additem')
            .send({
                user_id: testUserId,
                item_id: testItemId,
                amount: TEST_ITEM_AMOUNT_ADD_TO_CART,
            })
            .set('Accept', 'application/json')
            .expect(200)

        await request(server)
            .get('/user')
            .expect(200)
            .then(res => {
                testUser = res.body[0]
            })

        await request(server)
            .put('/user/checkout')
            .send({ user_id: testUserId })
            .set('Accept', 'application/json')
            .expect(200)

        await request(server)
            .get('/user')
            .expect(200)
            .then(res => {
                expect(res.body[0].cart).toEqual([])
                expect(res.body[0].credit).toEqual(testUser.credit - PAY)
                testUser = res.body[0]
            })

        await request(server)
            .get('/order')
            .expect(200)
            .then(res => {
                testOrder = res.body[0]
                testOrderId = testOrder.order_id

                expect(testOrder.order_details).toEqual([
                    {
                        item_id: testItemId,
                        amount: TEST_ITEM_AMOUNT_ADD_TO_CART,
                    },
                ])
            })
    })

    it('/GET user/:userId/orderlist', async () => {
        const PAY = TEST_ITEM_PRICE * TEST_ITEM_AMOUNT_ADD_TO_CART
        let created_time = testOrder ? testOrder.created_time : 0

        await request(server)
            .get(`/user/${testUserId}/orderlist`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                account: TEST_USER_ACCOUNT,
                name: TEST_USER_NAME,
                order_list: [
                    {
                        order_id: testOrderId,
                        item_list: [
                            {
                                item_id: testItemId,
                                item_name: TEST_ITEM_NAME,
                                item_price: TEST_ITEM_PRICE,
                                amount: TEST_ITEM_AMOUNT_ADD_TO_CART,
                                subtotal: PAY,
                            },
                        ],
                        created_time,
                        total: PAY,
                    },
                ],
            })
    })

    afterAll(async () => {
        // 移除訂單
        await request(server)
            .delete(`/order/${testOrderId}`)
            .expect(200)
            .then(async () => {
                await request(server)
                    .get('/order')
                    .then(res => {
                        console.log('user.e2e afterAll /order ', res.body)
                    })
            })

        // 移除會員
        await request(server)
            .delete(`/user/${testUserId}`)
            .expect(200)
            .then(async () => {
                await request(server)
                    .get('/user')
                    .then(res => {
                        console.log('user.e2e afterAll /user ', res.body)
                    })
            })

        // 移除商品
        await request(server)
            .delete(`/item/${testItemId}`)
            .expect(200)
            .then(async () => {
                await request(server)
                    .get('/item')
                    .then(res => {
                        console.log('user.e2e afterAll /item ', res.body)
                    })
            })

        await app.close()
    })
})
