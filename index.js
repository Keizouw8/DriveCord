import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import templates from "./templates.js";
import { Client, GatewayIntentBits, Events  } from "discord.js";
import { randomUUID } from "crypto";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.login(process.env.TOKEN);
client.once(Events.ClientReady, async function(readyClient){
	console.log(`Logged in as ${readyClient.user.tag}`);
	var guild = client.guilds.cache.get("1178861482906226688");
	console.log(client.guilds.cache.map(guild => guild.id));
	console.log(guild.channels.cache.map(guild => guild.name));
});

new Elysia()
	.use(html())
    .get("/", function({ cookie: { token }}){
		if(!token.value) return templates.landing();
		return templates.hub();
	})
    .listen(process.env.PORT);