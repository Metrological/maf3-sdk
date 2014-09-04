;(function (win, loc, doc, undef) {
	var MAF = win.MAF = win.MAF = {},
		origin = loc && loc.origin,
		regexp = RegExp,
		e = Error,
		reQueryString = /\??(.*?)=([^\&]*)&?/gi;

	function getter(obj, key, fn) { if (obj) obj.__defineGetter__(key, fn); }
	function setter(obj, key, fn) { if (obj) obj.__defineSetter__(key, fn); }

	function parseQueryString(q) {
		var r = {}, match;
		while ((match = reQueryString.exec(q))) r[match[1]] = match[2];
		return r;
	}

	var sdk = (function (origin) {
		var localOrigins = [
			regexp(/^https?:\/\/10.(\d{1,3}).(\d{1,3}).(\d{1,3}):?\d*$/), // Class A
			regexp(/^https?:\/\/172.(1[6-9]|2[0-9]|3[0-1]).(\d{1,3}).(\d{1,3}):?\d*$/), // Class B
			regexp(/^https?:\/\/192.168.(\d{1,3}).(\d{1,3}):?\d*$/), // Class C
			regexp(/^https?:\/\/localhost:?\d*$/) // localhost
		];
		function isLocal(origin) {
			if (!origin) return false;
			for (var i = 0; i < localOrigins.length; i++)
				if (localOrigins[i].test(origin)) return true;
			return false;
		}
		return isLocal(origin);
	}(origin));

	var options = (function (s) {
		return parseQueryString(s);
	}(doc.location.search)) || {};

	var settings = (function (s) {
		for (var i = 0; i < s.length; i++) {
			var params = (s[i].src || '').split('?');
			if (params.length > 1 && regexp('maf-room.(min.js|js)').test(params[0]))
				return parseQueryString(params[1]);
		}
	}(doc.getElementsByTagName('script'))) || {};

	var Room = MAF.Room = (function () {
		var retry = 0,
			reconnect = 3000,
			connected = false,
			users = {},
			rooms = {},
			ws;

		function trigger(event) {
			this.events = this.events || {};
			if (event in this.events === false) return;
			for (var i = 0; i < this.events[event].length; i++)
				this.events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		function send(o) {
			if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); 
		}
		function create() {
			try {
				return new WebSocket('ws://ws' + (sdk ? '-sdk' : '') + '.metrological.com/');
			} catch(err) {}
		}
		function opened() {
			connected = true;
			retry = 0;
			for (var key in rooms) {
				var r = rooms[key];
				r.user = undef;
				trigger.call(r, 'connected', { hash: key });
				var interval = setInterval(function () {
					if (r.joined) return clearInterval(interval);
					r.join();
				}, reconnect);
			}
		}
		function message(event) {
			var json = JSON.parse(event.data),
				e = json.e,
				h = json.h,
				u = json.u,
				d = json.d,
				r = rooms[h];
			if (!r) return;
			switch(e) {
				case 'j':
					r.joined = true;
					if (!r.user) r.user = u;
					users[h] = users[h] || [];
					if (users[h].indexOf(u) === -1) {
						users[h].push(u);
						trigger.call(r, 'joined', { hash: h, user: u, data: d});
					}
					if (r.user !== u)
						send({ e: 'p', h: h, d: d });
					break;
				case 'l':
					var i = users[h].indexOf(u);
					if (i > -1) {
						users[h].splice(i, 1);
						trigger.call(r, 'hasleft', { hash: h, user: u, data: d});
					}
					break;
				case 'd':
					if (users[h].indexOf(u) !== -1)
						trigger.call(r, 'data', { hash: h, user: u, data: d});
					break;
				case 'p':
					if (users[h].indexOf(u) === -1) {
						users[h].push(u);
						trigger.call(r, 'joined', { hash: h, user: u, data: d});
					}
					break;
				case 'e':
					trigger.call(r, 'error', { hash: h, user: u, code: json.c});
					break;
				default:
					break;
			}
		}
		function closed() {
			connected = false;
			retry++;
			if (ws) ws.onopen = ws.onmessage = ws.onclose = null;
			ws = null;
			for (var key in rooms) {
				var r = rooms[key];
				r.joined = undef;
				r.user = undef;
				users[key].length = 0;
			}
			setTimeout(init, reconnect * retry);
		}
		function init() {
			ws = ws || create();
			if (ws) {
				ws.onopen = opened;
				ws.onmessage = message;
				ws.onclose = closed;
			} else {
				retry++;
				setTimeout(init, reconnect * retry);
			}
		}

		init();

		function Room(hash) {
			hash = hash || options.hash || settings.hash;
			if (!hash) throw e('missing hash');
			if (rooms[hash]) return rooms[hash];

			getter(this, 'hash', function () {
				return hash;
			});

			getter(this, 'connected', function () {
				return connected;
			});

			this.joined = false;
			users[hash] = [];
			rooms[hash] = this;
		}
		Room.prototype = {
			join: function (data) {
				send({ e: 'j', h: this.hash, d: data });
			},
			leave: function (data) {
				this.user = undef;
				send({ e: 'l', h: this.hash, d: data });
			},
			send: function (data) {
				send({ e: 'd', h: this.hash, d: data });
			},
			addEventListener: function (event, fn) {
				this.events = this.events || {};
				this.events[event] = this.events[event] || [];
				this.events[event].push(fn);
			},
			removeEventListener: function (event, fn) {
				this.events = this.events || {};
				if (event in this.events === false) return;
				var i = this.events[event].indexOf(fn);
				if (i > -1) this.events[event].splice(i, 1);
			},
			destroy: function () {
				if (!rooms) return;
				this.leave();
				for (var event in this.events || {}) {
					if (this.events[event])
						this.events[event].length = 0;
					delete this.events[event];
				}
				delete this.events;
				if (users[this.hash])
					users[this.hash].length = 0;
				delete users[this.hash];
				delete rooms[this.hash];
			}
		};

		win.addEventListener('unload', function () {
			for (var key in rooms)
				if (rooms[key]) rooms[key].destroy();
			rooms = users = null;
		});

		return Room;
	}());
}(window, location, document));
