import { Client } from "discord.js";

import { InitializeBase } from "@vertix-base/bases";

import login from "@vertix-base/discord/login";

export class DiscordManager extends InitializeBase {
    private static instance: DiscordManager;

    private readonly client: Client<true>;

    public static getName() {
        return "VertixApi/Managers/DiscordManager";
    }

    public static getInstance() {
        if ( ! DiscordManager.instance ) {
            DiscordManager.instance = new DiscordManager();
        }

        return DiscordManager.instance;
    }

    public static get $() {
        return DiscordManager.getInstance();
    }

    public constructor() {
        super();

        this.client = new Client( {
            intents: [],
        } );
    }

    public async login() {
        await login( this.client, () => {
            this.logger.info( this.login, `Logged in to Discord, user: '${ this.client.user.username }'` );
        } );
    }

    public getClient() {
        return this.client;
    }
}
