import { Client, GatewayIntentBits, Events  } from "discord.js";
import findMessage from "./scripts/findMessage.js";
import { Elysia, ParseError } from "elysia";
import templates from "./templates.js";
import { html } from "@elysiajs/html";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.login(process.env.TOKEN);
client.once(Events.ClientReady, ({ user: { tag } }) => console.log(`Logged in as ${tag}`));

new Elysia()
	.use(html())
	.onError(function({ code, error }){
		if(code == "PARSE")	set.status(400); 
		return new Response(error.toString());
	})
    .get("/", function({ cookie: { token }}){
		if(!token.value) return templates.landing();
		return templates.hub();
	})
	.post("/authenticate", async function({ body, cookie: { token } }){
		if(!(body?.server && body?.username && body?.password)) throw new ParseError();
		
		var guild = client.guilds.cache.get(server);
		if(!guild) return { error: true, reason: "bot not in server" };

		var general = guild.channels.cache.find(channel => channel.name == "general");
		if(!general) throw new ParseError();

		var message = findMessage(channel, function(msg){
			if(msg.author.id != client.user.id) return false;
			
			var [username, password] = msg.content.split("\n");
			if(username != body.username) return false;
			return Bun.password.verifySync(body.password, password);
		});

		if(message) return token.value = message.id;
		message = await general.send(`${body.username}\n${Bun.password.hashSync(body.password)}`);
		return token.value = message.id;
	})
    .listen(process.env.PORT);