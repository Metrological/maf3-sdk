var NAF = this.NAF = {};
var WebApp = this.WebApp = {};

include('naf-webapp/1.0.8s4c2r87/naf-webapp.min.js');

var model = new WebApp.Model(),
	controller = new WebApp.Controller(model);

controller.registerPMRPC();

controller.on('model.initialized', function () {
	var doFn = controller['do'];

	window.addEventListener('focus', function () {
		doFn('model.state.applications.1?state=running');
		if (apps[active]) {
			send(active, 'onSelect', {
				id: apps[active].currentViewId
			});
		}
	});

	controller.on('model.state.key', function () {
		var ev = model.state.key,
			keyCode = parseInt(ev.keyCode, 10),
			keyState = ev.keyState.toLowerCase(),
			eventObj = document.createEvent('Events'),
			el = document.activeElement || win;
		if (keyState === 'repeat') {
			keyState = 'down';
		}
		if (eventObj.initEvent) {
			eventObj.initEvent('key' + keyState, true, true);
		}
		eventObj.keyCode = eventObj.which = keyCode;
		if (el.dispatchEvent) {
			el.dispatchEvent(eventObj);
		} else if (el.fireEvent) {
			el.fireEvent('onkey' + keyState, eventObj);
		}
	});

	doFn('model.state.applications.1?state=loaded');
});

controller.init();
