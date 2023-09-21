import { Module } from "@nestjs/common";

import { PrismaApiModule } from "@internal/prisma-api/prisma-api.module";
import { TokenService } from "@internal/token/token.service";

@Module( {
    exports: [
        TokenService,
    ],
    providers: [
        TokenService,
    ],
    imports: [
        PrismaApiModule,
    ],
} )

export class TokenModule {
}
