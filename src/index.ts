
import client from './client';
import { config } from "./config";
import handler from './utils/handler';
import deployCommands from "./deploy-commands";

(async () => {
    await deployCommands();

    await handler.loadCommands();
    await handler.loadEvents();

    await client.login(config.DISCORD_TOKEN);
})();
