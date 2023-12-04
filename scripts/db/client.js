import { Client, GatewayIntentBits, Events } from "discord.js";

var client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
export default client;

export function setupClient(token){
    return new Promise(function(resolve){
        client.login(token);
        client.once(Events.ClientReady, resolve);
    })
}