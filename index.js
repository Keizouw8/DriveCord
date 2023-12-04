import { Elysia } from "elysia";
import viewRouter from "./scripts/views/router";
import apiRouter from "./scripts/api/router";
import { setupClient } from "./scripts/db/client";

setupClient(process.env.TOKEN).then(({ user: { tag } }) => console.log(`Logged in as ${tag}`))

new Elysia()
	.use(viewRouter)
	.use(apiRouter)
    .listen(process.env.PORT, console.log(`Listening to port ${ process.env.PORT }`));