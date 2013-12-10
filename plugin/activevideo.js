KeyMap.defineKeys(KeyMap.NORMAL, {
	19: 'pause', 413: 'stop', 415: 'play',
	403: 'red', 404: 'green', 405: 'yellow', 406: 'blue'
}, true);

var player = new HTML5Player(Player.TV);
player.hide();
plugins.players.push(player);

plugins.storage = new CookieStorage();
/*
window.addEventListener('keydown', function (event) {
	screen.log(event.keyCode);
});
*/
window.addEventListener('blur', function () {
	if (active === ui) {
		window.close();
	}
});
