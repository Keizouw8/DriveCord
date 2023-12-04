import { Elysia } from "elysia";
import router from "./scripts/routes/router";
import { setupClient } from "./scripts/db/client";

setupClient(process.env.TOKEN).then(({ user: { tag } }) => console.log(`Logged in as ${tag}`))

new Elysia()
	.use(router)
    .listen(process.env.PORT, console.log(`Listening to port ${ process.env.PORT }`));