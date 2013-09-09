var NAF = this.NAF = {},
	WebApp = this.WebApp = {},
//	version = '1.0.8s4c2r87';
	version = '1.0.7s4c2r83';

// Capture globals
this.callId = this.params = this.isNotification = null;

console.log('include naf ' + version);
include('naf-webapp/' + version + '/naf-webapp.min.js');

console.log('create naf webapp model and controller');
var model = new WebApp.Model(),
	controller = new WebApp.Controller(model);

console.log('register naf pmrpc');
controller.registerPMRPC();

console.log('set callback on model initialized');
controller.on('model.initialized', function () {
	var doFn = controller['do'],
		internalIndex = controller.getApplicationIndex;

	function getApplicationIndex() {
		return internalIndex ? internalIndex() : 1;
	}

	window.addEventListener('focus', function () {
		var i = getApplicationIndex();
		console.log('doFocus: ' + i);
		doFn('model.state.applications.' + i + '?state=running');
		console.log('active?: ' + active);
		if (active && apps[active]) {
			send(active, 'onSelect', {
				id: apps[active].currentViewId
			});
		}
	});

	window.addEventListener('blur', function () {
		var i = getApplicationIndex();
		console.log('doBlur: ' + i);
		doFn('model.state.applications.' + i + '.appMsg', {
			method: 'paused',
			message: {}
		});
		console.log('active?: ' + active);
		if (active && active !== ui) {
			send(active, 'exit');
		}
	});

	controller.on('model.state.key', function () {
		var ev = model.state.key,
			keyCode = parseInt(ev.keyCode, 10),
			keyState = ev.keyState.toLowerCase(),
			eventObj = document.createEvent('Events'),
			el = document.activeElement || window;
		if (keyState === 'repeat') {
			keyState = 'down';
		}
		if (eventObj.initEvent) {
			eventObj.initEvent('key' + keyState, true, true);
		}
		console.log('doKeyDown: ' + keyCode);
		eventObj.keyCode = eventObj.which = keyCode;
		el.dispatchEvent(eventObj);
	});

	function onMessageCallback() {
		var i = getApplicationIndex(),
			msg = model.state.applications[i].appMsg,
			uiId = model.state.applications[0].id,
			message;
		if (msg.sourceId !== uiId) {
			return;
		}
		switch (msg.method) {
			case 'getApplications':
				var channelId = msg.message;
				message = [];
				break;
		}
		if (message) {
			doFn('model.state.applications.0.appMsg', {
				method: msg.method,
				message: message
			});
		}
	}

	var i = getApplicationIndex();
	console.log('onMessageCallback: ' + i);
	controller.on('model.state.applications.' + i + '.appMsg', onMessageCallback);
	console.log('setLoaded: ' + i);
	doFn('model.state.applications.' + i + '?state=loaded');
});

console.log('call controller init');
controller.init();
