export default function findMessage(channel, callback) {
	return new Promise(async function(resolve, reject){
		var finished = false;

		let message = await channel.messages
			.fetch({ limit: 1 })
			.then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
		if(callback(message)) return resolve(message);
	
		while(message && !finished){
			await channel.messages
				.fetch({ limit: 100, before: message.id })
				.then(messagePage => {
					messagePage.forEach(function(msg){
						if(callback(msg)){
							finished = true;
							return resolve(msg);
						}
					});
					message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
				});
		}

		if(!finished) resolve(undefined);
	});
}