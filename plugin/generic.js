if (!plugins.storage) {
	plugins.storage = new AutoStorage();
}
if (plugins.players.length === 0) {
	plugins.players.push(new HTML5Player(Player.TV), new HTML5Player(Player.PIP), new HTML5Player(Player.MUSIC, Player.type.AUDIO), new HTML5Player(Player.FX, Player.type.AUDIO));
}
