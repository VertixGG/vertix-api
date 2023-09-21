import { Module } from "@nestjs/common";

import { UserController } from "@internal/user/user.controller";

import { PrismaApiModule } from "@internal/prisma-api/prisma-api.module";

import { UserService } from "@internal/user/user.service";

@Module( {
    controllers: [
      UserController,
    ],
    providers: [
        UserService,
    ],
    exports: [
        UserService,
    ],
    imports: [
        PrismaApiModule,
    ],
} )

export class UserModule {
}
