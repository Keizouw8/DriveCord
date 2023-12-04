import findMessage from "../db/findMessage";
import client from "../db/client";

export default async function({ body, cookie: { token } }){
    if(!(body?.server && body?.username && body?.password)) return { error: true, reason: "malformed request" };
    
    var guild = client.guilds.cache.get(body.server);
    if(!guild) return { error: true, reason: "bot not in server" };

    var general = guild.channels.cache.find(channel => channel.name == "general");
    if(!general) return { error: true, reason: "target server misconfigured" };

    var message = await findMessage(general, function(msg){
        if(msg.author.id != client.user.id) return false;
        return msg.content.split("\n")[0] == body.username;
    });

    if(message) return { error: true, reason: "username taken" };

    message = await general.send(`${ body.username }\n${ Bun.password.hashSync(body.password) }`);
    await guild.channels.create({ name: message.id });
    await guild.channels.create({ name: message.id + "-chunks" });
    token.value = `${body.server}>${message.id}`;

    return { error: false };
}