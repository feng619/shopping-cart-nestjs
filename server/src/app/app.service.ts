import { Component } from '@nestjs/common'

@Component()
export class AppService {
    root(): string {
        return 'Server is running!'
    }
}
