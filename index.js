import { Client, GatewayIntentBits, Events, ChannelType  } from "discord.js";
import findMessage from "./scripts/findMessage.js";
import templates from "./templates.js";
import { html } from "@elysiajs/html";
import { Elysia } from "elysia";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.login(process.env.TOKEN);
client.once(Events.ClientReady, ({ user: { tag } }) => console.log(`Logged in as ${tag}`));

new Elysia()
	.use(html())
	.onError(function({ code, error }){
		return new Response(error.toString());
	})
    .get("/", function({ cookie: { token }}){
		if(!token.value) return templates.landing();
		return templates.hub();
	})
	.post("/authenticate", async function({ body, cookie: { token } }){
		if(!(body?.server && body?.username && body?.password)) return { error: true, reason: "malformed request" };
		
		var guild = client.guilds.cache.get(body.server);
		if(!guild) return { error: true, reason: "bot not in server" };

		var general = guild.channels.cache.find(channel => channel.name == "general");
		if(!general) return { error: true, reason: "target server misconfigured" };

		var message = await findMessage(general, function(msg){
			if(msg.author.id != client.user.id) return false;
			return msg.content.split("\n")[0] == body.username;
		});

		if(message) if(!Bun.password.verifySync(body.password, message.content.split("\n")[1])) return { error: true, reason: "incorrect password" };
		if(!message){
			message = await general.send(`${body.username}\n${Bun.password.hashSync(body.password)}`);
			await guild.channels.create({ name: message.id });
			await guild.channels.create({ name: message.id+"-chunks" });
		}
		token.value = message.id;
		return { error: false };
	})
    .listen(process.env.PORT, console.log(`Listening to port ${process.env.PORT}`));