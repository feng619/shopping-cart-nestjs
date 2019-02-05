import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

import { AppModule } from '../app/app.module'

describe('App e2e-spec', () => {
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

    it('/GET /', () => {
        return request(server)
            .get('/')
            .expect(200)
            .expect('Server is running!')
    })

    afterAll(async () => {
        await app.close()
    })
})
