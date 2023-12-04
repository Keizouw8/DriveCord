import templates from "./templates";
import client from "../db/client";

export default function({ cookie: { token }}){
    if(!token.value) return templates.landing();
    var [server, user] = token.value.split(">");

    var guild = client.guilds.cache?.get(server);
    var general = guild?.channels?.cache?.find(channel => channel.name == "general");
    var user = general?.messages?.fetch(user);

    if(!user){
        token.remove();
        return templates.landing();
    }

    return templates.hub();
}