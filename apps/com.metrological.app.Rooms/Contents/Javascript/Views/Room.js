// Create a class and extended it from the MAF.system.SidebarView
var Room = new MAF.Class({
	ClassName: 'Room',

	Extends: MAF.system.FullscreenView,

	initialize: function () {
		var view = this;
		view.parent();
		// Create a Room across all households
//		view.room = new MAF.Room(view.ClassName);
		// Create a Room for this specific household
		view.room = new MAF.PrivateRoom(view.ClassName);
	},

	// Create your view template
	createView: function () {
		var view = this,
			room = view.room,
			clients = {}; // Keep track of the clients connected

		// Create a Canvas element
		var canvas = new MAF.element.Core({
			element: Canvas,
			styles: {
				width: view.width - 620,
				height: view.height,
				hOffset: 620
			}
		}).appendTo(view);

		// Get Context of Canvas
		var ctx = canvas.element.getContext('2d');
		if (ctx) {
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
		}

		// Create a placeholder for the QRCode image
		var qrcode = new MAF.element.Image({
			styles: {
				vAlign: 'bottom',
				vOffset: 50,
				hOffset: 50
			}
		}).appendTo(view);

		// Adding a button to clear the canvas
		var clear = new MAF.control.TextButton({
			label: $_('Clear'),
			styles: {
				width: view.width - canvas.width - 100,
				height: 60,
				hOffset: 50,
				vOffset: 50
			},
			textStyles: {
				anchorStyle: 'center'
			},
			events: {
				onSelect: function () {
					// Send clear to all devices
					if (room.joined) room.send({e: 'clear'});
				}
			}
		}).appendTo(view);

		// Close button
		new MAF.control.TextButton({
			label: $_('Close'),
			styles: {
				width: clear.width,
				height: clear.height,
				hOffset: clear.hOffset,
				vOffset: clear.outerHeight + 20
			},
			textStyles: {
				anchorStyle: 'center'
			},
			events: {
				onSelect: function () {
					MAF.application.exit();
				}
			}
		}).appendTo(view);

		// Reset the Canvas
		function reset() {
			if (ctx) {
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			}
		}

		// Draw to Canvas function
		function draw(c, k, x, y) {
			switch (k) {
				case 'start':
					clients[c] = { x: x, y: y };
					return;
				case 'end':
					delete clients[c];
					return;
				case 'paint':
					if (!clients[c] || !clients[c].x && !clients[c].y) {
						clients[c] = { x: x, y: y };
					} else {
						var prev = clients[c];
						ctx.beginPath();
						ctx.lineWidth = 7.0;
						ctx.strokeStyle = c;
						ctx.moveTo(prev.x, prev.y);
						ctx.lineTo(x, y);
						ctx.closePath();
						ctx.stroke();
						clients[c] = { x: x, y: y };
					}
					return;
			}
		}

		// Set listeners for Room and Connection
		(function (event) {
			var payload = event.payload;
			switch (event.type) {
				case 'onConnected':
					log('room connected');
					// If connected but room not joined make sure to join it automaticly
					if (!room.joined) room.join();
					return;
				case 'onDisconnected':
					clients = {}; // Reset clients
					log('connection lost waiting for reconnect and automaticly rejoin');
					return;
				case 'onCreated':
					// Create an url to the client application and pass the hash as querystring
					var url = widget.getUrl('Client/draw.html?hash=' + payload.hash);
					qrcode.setSource(QRCode.get(url));
					log('room created', payload.hash, url);
					return;
				case 'onDestroyed':
					clients = {}; // Reset clients
					log('room destroyed', payload.hash);
					return;
				case 'onJoined':
					// If user is not the app then log the user
					if (payload.user !== room.user)
						log('user joined', payload.user);
					return;
				case 'onHasLeft':
					// If user is not the app then log the user
					if (payload.user !== room.user)
						log('user has left', payload.user);
					return;
				case 'onData':
					var data = payload.data;
					if (data.e === 'draw')
						return draw(data.c, data.k, data.x, data.y);
					if (data.e === 'clear')
						return reset();
					break;
				default:
					log(event.type, payload);
					break;
			}
		}).subscribeTo(room, ['onConnected', 'onDisconnected', 'onCreated', 'onDestroyed', 'onJoined', 'onHasLeft', 'onData', 'onError']);

		// If Room socket is connected create and join room
		if (room.connected) room.join();
	},

	destroyView: function () {
		var view = this;
		if (view.room) {
			view.room.leave(); // Leave room, will trigger an onLeaved of the app user
			view.room.destroy(); // Destroy the room
			delete view.room; // Unreference from view for GC
		}
	}
});
