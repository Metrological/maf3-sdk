(function (win, doc, nav, undef) {
	var parent = win && win.parent,
		regexp = RegExp,
		string = String,
		userAgent = string(nav.userAgent),
		proto = string('prototype'),
		reQueryString = /\??(.*?)=([^\&]*)&?/gi,
		storage = [];
	function getter(obj, key, fn) { return obj && obj.__defineGetter__(key, fn); }
	function setter(obj, key, fn) { return obj && obj.__defineSetter__(key, fn); }
	function json(obj) { return JSON.stringify(obj); }
	function parseQueryString(q) {
		var r = {}, match;
		while ((match = reQueryString.exec(q))) r[match[1]] = match[2];
		return r;
	}
	var navigator = win.navigator = {
		userAgent: userAgent
	};
	var settings = (function (s) {
		for (var i = 0; i < s.length; i++) {
			var params = (s[i].src || '').split('?');
			if (params.length > 1 && regexp('maf.(min.js|js)').test(params[0]))
				return parseQueryString(params[1]);
		}
	}(doc.getElementsByTagName('script'))) || {};
	var options = (function (s) {
		var params = s.split('?');
		if (params.length > 1) return parseQueryString(params[1]);
	}(win.location.href)) || {};
	function dispatchKey(o) {
		if (!o) return;
		var el = document.activeElement || document.body || window,
			keyEvent = document.createEvent('Event');
		keyEvent.initEvent('key' + (o.type || 'down'), true, true);
		keyEvent.keyCode = o.keyCode;
		keyEvent.which = o.keyCode;
		keyEvent.shiftKey = o.shiftKey || false;
		keyEvent.altKey = o.altKey || false;
		keyEvent.ctrlKey = o.ctrlKey || false;
		el.dispatchEvent(keyEvent);
	}
	function handleMessage(e) {
		var obj;
		if (!e.data) return;
		try {
			obj = JSON.parse(e.data);
		} catch(err) { return; }
		switch(obj.type) {
			case 'storage':
				storage = (obj.message || '').split(';');
				break;
			case 'key':
				dispatchKey(obj.message);
				break;
		}
	}
	function handleResize(e) {
		var scale = (win.innerHeight || (doc.documentElement && doc.documentElement.clientHeight) || (doc.body && doc.body.clientHeight) || settings.scale || 1080) / parseInt(settings.scale || 1080, 10);
		if (parent) parent.postMessage(json({type: 'scale', scale: scale }), '*');
		window.focus();
	}
	if (parent) {
		win.addEventListener('resize', handleResize, false);
		win.addEventListener('message', handleMessage, false);
		parent.postMessage(json({type: 'getStorage'}), '*');
		this.close = function () {
			var obj = { type: 'close' };
			parent.postMessage(json(obj), '*');
		};
		handleResize();
		if (doc) {
			getter(navigator, 'language', function () {
				return options.language || 'nl';
			});
			getter(doc, 'cookie', function () {
				return storage.join(';');
			});
			setter(doc, 'cookie', function (cookie) {
				if (cookie) {
					var str = cookie.split(';')[0],
						key = str.split('=')[0],
						updated = false;
					for (var i = 0; i < storage.length; i++) {
						if (storage[i].indexOf(key + '=') === 0) {
							storage[i] = str;
							updated = true;
						}
					}
					if (!updated) storage.push(str);
					parent.postMessage(json({
						type: 'setStorage',
						message: storage.join(';')
					}), '*');
				}
			});
		}
	}
}(window, document, navigator));
