import { Module } from "@nestjs/common";

import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "@internal/auth/auth.module";
import { AppHostModule } from "@internal/app-host.module";
import { PrismaApiModule } from "@internal/prisma-api/prisma-api.module";
import { PrismaBotModule } from "@internal/prisma-bot/prisma-bot.module";
import { DashboardModule } from "@internal/dashboard/dashboard.module";

@Module( {
    imports: [
        ConfigModule.forRoot(),
        AppHostModule,
        PrismaApiModule,
        PrismaBotModule,
        AuthModule,
        DashboardModule,
    ],
} )

export class AppModule {
}
