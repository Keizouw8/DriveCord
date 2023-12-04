import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { cors } from "@elysiajs/cors";
import index from "./index";

export default new Elysia()
	.use(cors())
	.use(html())
	.onError(function({ error }){
		return new Response(error.toString());
	})
    .get("/", index)
    .all("*", function({ set }){
		set.status = 404;
		return "404: Not Found";
	})