import { PrismaClient } from "@vertix-base-prisma-api";

import { Injectable, OnModuleInit } from "@nestjs/common";

import { AppHostService } from "@internal/app-host.service";

@Injectable()

export class PrismaApiService extends PrismaClient implements OnModuleInit {
    public constructor( private appHost: AppHostService ) {
        super();

        this.enableShutdownHooks();
    }

    public async onModuleInit() {
        await this.$connect();
    }

    public enableShutdownHooks() {
        this.$on( "beforeExit", async () => {
            await this.appHost.instance.close();
        } );
    }
}
