if (!plugins.storage) {
	plugins.storage = new AutoStorage();
}
if (plugins.players.length === 0) {
	plugins.players.push(new HTML5Player('tv'));
}
