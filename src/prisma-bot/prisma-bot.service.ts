import { PrismaBotInstance } from "@vertix-base/prisma/prisma-bot-instance";

import { Injectable, OnModuleInit } from "@nestjs/common";

import { AppHostService } from "@internal/app-host.service";

@Injectable()

export class PrismaBotService extends PrismaBotInstance implements OnModuleInit {
    public constructor( private appHost: AppHostService ) {
        super();

        this.enableShutdownHooks();
    }

    public async onModuleInit() {
        await this.client.$connect();
    }

    public enableShutdownHooks() {
        this.client.$on( "beforeExit", async () => {
            await this.appHost.instance.close();
        } );
    }
}
