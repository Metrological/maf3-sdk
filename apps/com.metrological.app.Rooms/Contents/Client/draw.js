function () {
	// Create Canvas API
	var Canvas = function () {
		var canvas;
		var ctx;
		var clients = {};

		// On resize scale the canvas size
		window.addEventListener( 'resize', function() {
			canvas = canvas || document.getElementById( 'draw' );

			if ( canvas ) {
				canvas.width = document.body.clientWidth;
				canvas.height = document.body.clientHeight;
			}
		}, false );

		// setup Context
		function setup( c ) {
			canvas = canvas || document.getElementById( 'draw' );
			ctx = canvas.getContext( '2d' );
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			canvas.width = document.body.clientWidth;
			canvas.height = document.body.clientHeight;
		}

		// Draw to Canvas
		function draw( c, k, x, y ) {
			var prev;

			if ( !ctx ) setup( c );

			if ( k === 'start' ) clients[ c ] = { x: x, y: y };
			if ( k === 'end' ) delete clients[c];
			if ( k === 'paint' ) {
				if ( !clients[ c ] || !clients[ c ].x && !clients[ c ].y )
					clients[ c ] = { x: x, y: y };
				else {
					prev = clients[ c ];
					ctx.beginPath();
					ctx.lineWidth = 5.0;
					ctx.strokeStyle = c;
					ctx.moveTo( prev.x, prev.y );
					ctx.lineTo( x, y );
					ctx.closePath();
					ctx.stroke();
					clients[ c ] = { x: x, y: y };
				}
			}
		}

		// Clear the Canvas
		function clear( c ) {
			if ( !ctx && c ) setup( c );
			if ( ctx ) {
				ctx.setTransform( 1, 0, 0, 1, 0, 0 );
				ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
			}
		}

		return {
			draw: draw,
			clear: clear
		};
	}();

	// Random color helper
	function getRandomColor() {
		var letters = '0123456789ABCDEF'.split( '' );
		var color = '#';
		var i = 0;

		for ( i; i < 6; i++ )
			color += letters[ Math.floor( Math.random() * 16 ) ];

		return color;
	}

	// Draw API
	var Draw = function( c ) {
		var enabled = false;
		var room = new MAF.Room();

		room.addEventListener( 'joined', function( event ) {
			// A client has joined
			console.log( 'user joined', event.user );
		} );

		room.addEventListener( 'data', function( event ) {
			var d = event.data;
			var fn = Canvas[ d.e ];
			return fn && fn( d.c, d.k, d.x, d.y );
		} );

		window.addEventListener( 'unload', function() {
			room.destroy();
			room = null;
		}, false );

		function start( x, y)  {
			enabled = true;
			room.send( { e: 'draw', k: 'start', c: c, x: x, y: y } );
		}

		function end( x, y ) {
			enabled = false;
			room.send( { e: 'draw', k: 'end', c: c, x: x, y: y } );
		}

		function paint( x, y ) {
			if ( enabled ) room.send( { e: 'draw', k: 'paint', c: c, x: x, y: y } );
		}

		return {
			start: start,
			end: end,
			paint: paint
		};
	}( getRandomColor() );

	// Implement cross device xy conversion
	function getXY( e ) {
		if ( e.type && e.type.indexOf( 'touch' ) === 0 )
			e = e.changedTouches[ 0 ];

		return {
			x: e.pageX,
			y: e.pageY
		};
	}

	// Implement cross device drawing
	[
		'mousedown',
		'mouseup',
		'mousemove',
		'touchstart',
		'touchend',
		'touchmove'
	].forEach( function( type ) {
		window.addEventListener( type, function( event ) {
			var service = 'paint';
			var xy = getXY( event );

			if ( type === 'mousedown' || type === 'touchstart' ) service = 'start';
			if ( type === 'mouseup' || type === 'touchend' ) service = 'end';

			Draw[ service ]( xy.x, xy.y );

			event.preventDefault();
		}, false );
	} );
}();
