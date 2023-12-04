import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { cors } from "@elysiajs/cors";
import index from "./index";
import signup from "./signup";
import login from "./login";

export default new Elysia()
	.use(cors())
	.use(html())
	.onError(function({ error }){
		return new Response(error.toString());
	})
    .get("/", index)
	.post("/signup", signup)
	.post("/login", login)
    .all("*", function({ set }){
		set.status = 404;
		return "Not Found";
	})