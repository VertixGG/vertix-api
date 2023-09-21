import { Body, Controller, Get, Logger, Param, Patch, Request, UseGuards } from "@nestjs/common";

import { GuildDataManager } from "@vertix-base/managers/guild-data-manager";

import { E_INTERNAL_CHANNEL_TYPES } from "@vertix-base-prisma-bot";

import {
    APIDataTypeGetGuild,
    APIDataTypeGetGuilds, APIDataTypeGuild,
    APIDataTypeMasterChannel
} from "@vertix-base/data-types/api-data-type";

import { GuildChannel } from "discord.js";

import { AuthGuard } from "@internal/auth/auth.guard";
import { DiscordUserService } from "@internal/discord-user/discord-user.service";
import { PrismaBotService } from "@internal/prisma-bot/prisma-bot.service";

import { DiscordManager } from "@internal/managers/discord-manager";

@Controller( "dashboard" )

@UseGuards( AuthGuard )

export class DashboardController {

    public constructor(
        private discordUser: DiscordUserService,
        private prismaBot: PrismaBotService,
    ) {

    }

    @Get( "guilds" )

    public async guilds( @Request() request ): Promise<APIDataTypeGetGuilds> {
        const guilds = await this.discordUser.getGuilds( request.user ) || [] as any[],
            newGuilds = guilds.map( async ( guild ) => {
                if ( ! guild.owner ) {
                    return null;
                }

                const channels = await this.prismaBot.getClient().channel.findMany( {
                    where: {
                        guildId: guild.id,
                    },
                    include: {
                        data: true,
                    }
                } );

                return {
                    ... guild,
                    channels,
                };
            } );

        return ( await Promise.all( newGuilds ) ).filter( ( i: any ) => i !== null );
    }

    //------------------------------------------------------------------------------------------------------------------

    @Get( "guild/:id" )

    public async guild( @Request() request, @Param( "id" ) id: string ): Promise<APIDataTypeGetGuild> {
        const guilds = await this.discordUser.getGuilds( request.user );

        if ( ! guilds.length ) {
            return {
                error: true,
                message: "guilds not found.",
                code: 404,
            };
        }

        const guild = guilds.find( ( guild ) => guild.id === id );

        if ( ! guild ) {
            return {
                error: true,
                message: "You are not the owner of this guild.",
            };
        }

        const guildDB = await this.prismaBot.getClient().guild.findUnique( {
            where: {
                guildId: id,
            },
            include: {
                data: true,
            }
        } );

        const masterChannelsDB = await this.prismaBot.getClient().channel.findMany( {
            where: {
                guildId: id,
                internalType: E_INTERNAL_CHANNEL_TYPES.MASTER_CREATE_CHANNEL,
            },
            include: {
                data: true,
            }
        } );

        const masterChannels: APIDataTypeMasterChannel[] = [];

        for ( const i in masterChannelsDB ) {
            const channelDB = masterChannelsDB[ i ];

            const discordChannel = await DiscordManager.$.getClient().channels.fetch( channelDB.channelId )
                .catch( () => {} );

            if ( ! discordChannel ) {
                Logger.error( `Discord channel ${ channelDB.channelId } not found.` );

                continue;
            }

            const owner = await DiscordManager.$.getClient().users.fetch( channelDB.userOwnerId )
                .catch( () => {} );

            if ( ! owner ) {
                Logger.error( `Discord owner ${ channelDB.userOwnerId } not found.` );
                continue;
            }

            masterChannels.push( {
                channelDB,
                dataDB: channelDB.data,
                channelDS: discordChannel as GuildChannel,
                userOwnerDS: owner,
                dynamicChannelsDB: await this.prismaBot.getClient().channel.findMany( {
                    where: {
                        guildId: id,
                        ownerChannelId: channelDB.channelId,
                    }
                } )
            } );
        }

        return {
            guildRS: guild,
            masterChannelsAP: masterChannels,
            dataDB: guildDB.data,
        } as APIDataTypeGuild;
    }

    //------------------------------------------------------------------------------------------------------------------

    @Patch( "badwords" )

    public async badwords( @Request() request, @Body() body ) {
        const guilds = await this.discordUser.getGuilds( request.user ),
            guild = guilds.find( guild => guild.id === body.guildId );

        if ( ! guild.owner ) {
            return {
                error: true,
                message: "You are not the owner of this guild.",
            };
        }

        return GuildDataManager.$.setBadwords( body.guildId, body.badwords );
    }
}
