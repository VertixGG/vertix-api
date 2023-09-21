import { Module } from "@nestjs/common";

import { AppHostModule } from "@internal/app-host.module";
import { PrismaApiService } from "@internal/prisma-api/prisma-api.service";

@Module( {
    providers: [
        PrismaApiService,
    ],
    exports: [
        PrismaApiService,
    ],
    imports: [
        AppHostModule,
    ]
} )
export class PrismaApiModule {
}
