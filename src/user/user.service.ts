import { Injectable } from "@nestjs/common";

import { PrismaApiService } from "@internal/prisma-api/prisma-api.service";
import { IUserData } from "@internal/user/user.interface";

@Injectable()

export class UserService {
    public constructor( private prismaApi: PrismaApiService ) {
    }

    public async get( discordId: string ) {
        return this.prismaApi.user.findUnique( { where: { discordId } } );
    }

    public async create( data: IUserData ) {
        this.ensureAvatar( data );

        return this.prismaApi.user.create( { data } );
    }

    public async update( data: IUserData ) {
        this.ensureAvatar( data );

        const discordId = data.discordId;

        delete data.discordId;

        return this.prismaApi.user.update( { where: { discordId }, data } );
    }

    private ensureAvatar( data: IUserData ) {
        data.avatar = data.avatar ? `https://cdn.discordapp.com/avatars/${ data.discordId }/${ data.avatar }.png` :
            `https://cdn.discordapp.com/embed/avatars/${ data.discriminator.substring( 0, 1 ) }.png`;
    }
}
