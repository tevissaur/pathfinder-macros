main();

async function main() {
        //let myCharId = "ZVsmTFG6BaNH8Mcc"
	//let actor = game.actors.get(myCharId);

	console.log("Tokens: ", game.canvas.tokens.controlled);
	if (game.canvas.tokens.controlled.length !== 1) {
		ui.notifications.warn("Please select a single token");
		return;
	}
        let actor = game.canvas.tokens.controlled[0].actor;
	let healthPotion = actor.items.find(
		(item) => item.name === "Elixir of Life (Minor)"
	);
	if (!healthPotion) {
		ui.notifications.error("No health potions found!");
		return;
	}

	if (actor.system.attributes.hp.value === actor.system.attributes.hp.max) {
		ui.notifications.error("Actor at full health!");
		return;
	}

	await healthPotion.update({
		"system.quantity": healthPotion.system.quantity - 1,
	});

	if (healthPotion.system.quantity < 1) {
		healthPotion.delete();
	}

        let roll = await new Roll(`${healthPotion.system.consume.value}`).roll();
        console.log(roll.total);

	let newHealth = actor.data.data.attributes.hp.value + roll.total;
	if (newHealth > actor.data.system.attributes.hp.max) {
		newHealth = actor.data.system.attributes.hp.max;
	}

	await actor.update({ "system.attributes.hp.value": newHealth });
        let message = `${actor.data.name} drank a health potion! And healed for ${roll.total} hp.`;

	ui.notifications.info(message);

	ChatMessage.create({
		user: game.user._id,
		speaker: ChatMessage.getSpeaker({ token: actor }),
		content: message,
	});
}