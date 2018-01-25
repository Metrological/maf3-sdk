// Create a new View class and extend it from the MAF.system.FullscreenView
var Room = new MAF.Class( {
	ClassName: 'Room',

	Extends: MAF.system.FullscreenView,

	// Keep track of the clients connected
	clients: {},

	initView: function() {
		log( 'CREATE ROOM' );
		// Create a Room across all households
		// this.room = new MAF.Room( this.ClassName );

		// Create a Room for this specific household
		this.room = new MAF.PrivateRoom( this.ClassName );
	},

	// Create your view template
	createView: function() {
		var clients = this.clients;

		// Create a Canvas element
		var canvas = new MAF.element.Core( {
			element: Canvas,
			styles: {
				width: this.width - 620,
				height: this.height,
				hOffset: 620
			}
		} ).appendTo( this );

		// Get Context of Canvas
		var ctx = canvas.element.getContext( '2d' );
		if ( ctx ) {
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
		}

		// Create a placeholder for the QRCode image
		var qrcode = new MAF.element.Image( {
			styles: {
				vAlign: 'bottom',
				vOffset: 50,
				hOffset: 50
			},
			events: {
				onLoaded: function() {
					log( 'LOADED IMAGE' );
				},
				onError: function() {
					log( 'ERROR LOADING IMAGE' );
				}
			}
		} ).appendTo( this );

		// Adding a button to clear the canvas
		var clear = new MAF.control.TextButton( {
			label: $_( 'Clear' ),
			styles: {
				width: this.width - canvas.width - 100,
				height: 60,
				hOffset: 50,
				vOffset: 50
			},
			textStyles: { anchorStyle: 'center' },
			events: {
				onSelect: function() {
					// Send clear to all devices
					if ( this.room.joined ) this.room.send( { e: 'clear' } );
				}
			}
		} ).appendTo( this );

		// Close button
		new MAF.control.TextButton( {
			label: $_( 'Close' ),
			styles: {
				width: clear.width,
				height: clear.height,
				hOffset: clear.hOffset,
				vOffset: clear.outerHeight + 20
			},
			textStyles: { anchorStyle: 'center' },
			events: {
				onSelect: function() { MAF.application.exit(); }
			}
		} ).appendTo( this );

		// Reset the Canvas
		function reset() {
			if ( ctx ) {
				ctx.setTransform( 1, 0, 0, 1, 0, 0 );
				ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
			}
		}

		// Draw to Canvas function
		function draw( c, k, x, y ) {
			var prev;

			if ( k === 'start' ) {
				clients[ c ] = { x: x, y: y };
				return;
			} else if ( k === 'end' ) {
				delete clients[ c ];
				return;
			} else if ( k === 'paint' ) {
				if ( !clients[ c ] || !clients[ c ].x && !clients[ c ].y )
					clients[ c ] = { x: x, y: y };
				else {
					prev = clients[ c ];
					ctx.beginPath();
					ctx.lineWidth = 7.0;
					ctx.strokeStyle = c;
					ctx.moveTo( prev.x, prev.y );
					ctx.lineTo( x, y );
					ctx.closePath();
					ctx.stroke();
					clients[ c ] = { x: x, y: y };
				}
				return;
			}
		}

		// Set listeners for Room and Connection
		function roomListener( event ) {
			var payload = event.payload;
			var eventType = event.type;
			var data = payload.data;
			var url;

			log( 'ROOM TYPE: ' + eventType );

			if ( eventType === 'onConnected' ) {
					log( 'room connected' );

					// If connected but room not joined make sure to join it automaticly
					if ( !this.room.joined ) return this.room.join();

			} else if ( eventType === 'onDisconnected' ) {
					// Reset clients
					this.clients = {};

					return log( 'connection lost waiting for reconnect and automaticly rejoin' );

			} else if ( eventType === 'onCreated' ) {
					// Create an url to the client application and pass the hash as querystring
					url = widget.getUrl( 'Client/draw.html?hash=' + payload.hash );

					qrcode.setSource( QRCode.get( url ) );

					return log( 'room created', payload.hash, url );
			} else if ( eventType === 'onDestroyed' ) {
				clients = {}; // Reset clients

				return log( 'room destroyed', payload.hash );
			} else if ( eventType === 'onJoined' ) {
				// If user is not the app then log the user
				if ( payload.user !== this.room.user )
					log( 'user joined', payload.user );

				return;
			} else if ( eventType === 'onHasLeft' ) {
				// If user is not the app then log the user
				if ( payload.user !== this.room.user )
					log( 'user has left', payload.user );

				return;
			} else if ( eventType === 'onData' ) {

				if ( data.e === 'draw' )
					return draw( data.c, data.k, data.x, data.y );

				if ( data.e === 'clear' )
					return reset();
			}

			log( eventType, payload );
		}

		this.onRoomEvent = roomListener.subscribeTo( this.room, [
			'onConnected',
		  'onDisconnected',
		  'onCreated',
		  'onDestroyed',
		  'onJoined',
		  'onHasLeft',
		  'onData',
		  'onError'
		], this );

		// If Room socket is connected create and join room
		if ( this.room.connected ) this.room.join();
	},

	destroyView: function () {
		this.onRoomEvent.unsubscribeFrom( this.room, [
			'onConnected',
		  'onDisconnected',
		  'onCreated',
		  'onDestroyed',
		  'onJoined',
		  'onHasLeft',
		  'onData',
		  'onError'
		] );

		if ( this.room ) {

			// Leave room, will trigger an onLeaved of the app user
			this.room.leave();

			// Destroy the room
			this.room.destroy();

			// Unreference from view for GC
			this.room = null;
		}

		log( 'EXIT APP' );
	}
} );
