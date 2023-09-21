import { Module } from "@nestjs/common";

import { AppHostModule } from "@internal/app-host.module";
import { PrismaBotService } from "@internal/prisma-bot/prisma-bot.service";

@Module( {
    providers: [
        PrismaBotService,
    ],
    exports: [
        PrismaBotService,
    ],
    imports: [
        AppHostModule,
    ]
} )
export class PrismaBotModule {
}
