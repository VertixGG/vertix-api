import { Injectable } from "@nestjs/common";

import { TokenService } from "@internal/token/token.service";
import { IUserData } from "@internal/user/user.interface";
import { discordFetch } from "@internal/discord/discord.util";

@Injectable()

export class DiscordUserService {
    public constructor( private token: TokenService ) {
    }

    public async getGuilds( user: IUserData ) {
        const token = await this.token.get( user.discordId ),
            result = await discordFetch( token.accessToken, "users/@me/guilds" );

        return await result.json();
    }
}
