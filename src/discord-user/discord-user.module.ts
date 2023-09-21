import { Module } from "@nestjs/common";

import { DiscordUserService } from "@internal/discord-user/discord-user.service";
import { TokenModule } from "@internal/token/token.module";

@Module( {
    providers: [
        DiscordUserService,
    ],
    exports: [
        DiscordUserService,
    ],
    imports: [
        TokenModule,
    ]
} )

export class DiscordUserModule {
}
