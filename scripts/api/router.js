import { Elysia } from "elysia";
import signup from "./signup";
import login from "./login";

export default new Elysia()
    .onError(function({ error }){
        return new Response(error.toString());
    })
	.post("/api/signup", signup)
	.post("/api/login", login)
    .all("/api*", function({ set }){
		set.status = 404;
		return "API Route - 404: Not Found";
	})