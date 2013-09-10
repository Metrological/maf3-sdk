var NDS = createPluginObject('my_user_api', 'my_user_api', 'application/x-jsuserapi-plugin'),
	Application = NDS.Application_getInstance && NDS.Application_getInstance();

KeyMap.defineKeys(KeyMap.NORMAL, {
	403: 'red', 404: 'green',
	405: 'yellow', 406: 'blue',
	413: 'stop', 415: 'playpause',
	417: 'forward', 412: 'rewind',
	462: 'menu', 461: 'back'
}, true);

window.addEventListener('blur', function () {
	Application.pause();
});
