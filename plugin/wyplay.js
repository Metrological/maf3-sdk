wms.AV.coopLevel = wms.AV.coopLevelValue.Exclusive;

KeyMap.defineKeys(KeyMap.NORMAL, {
	46: 'back',
	19: 'stop'
}, true);

var releasePlayer = function () {
	try {
		wms.AV.coopLevel = wms.AV.coopLevelValue.Priority;
	} catch(err) {}
};

window.addEventListener('unload', function () {
	releasePlayer();
});
