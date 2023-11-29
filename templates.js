import { renderFile } from "ejs";

function view(path){
	return function(locals){
		return new Promise(async (resolve) => renderFile(path, locals || {}, (_, str) => resolve(str)))
	}
}

export default {
	landing: view("./views/pages/landing.ejs"),
	hub: view("./views/pages/hub.ejs")
}