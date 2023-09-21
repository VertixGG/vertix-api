import { Module } from "@nestjs/common";

import { DiscordUserModule } from "@internal/discord-user/discord-user.module";
import { PrismaBotModule } from "@internal/prisma-bot/prisma-bot.module";
import { DashboardController } from "@internal/dashboard/dashboard.controller";

@Module( {
    controllers: [
        DashboardController,
    ],
    imports: [
        DiscordUserModule,
        PrismaBotModule,
    ]
} )

export class DashboardModule {

}
