var MainView = new MAF.Class( {
	ClassName: 'MainView',

	Extends: MAF.system.SidebarView,

	createView: function() {
		var buttons = [
			{ label: $_( 'Control Grid' ), view: 'ControlGrid' },
			{ label: $_( 'Element Grid' ), view: 'ElementGrid' },
			{ label: $_( 'Horizontal Grid' ), view: 'HorizontalGrid' },
			{ label: $_( 'Vertical Grid' ), view: 'VerticalGrid' },
			{ label: $_( 'Slide Carousel' ), view: 'SlideCarousel' }
		];

		// Create a list of buttons based on an array and
		// set guid for keeping focus state on previous view
		buttons.forEach( function( button, i ) {
			// Generate a unqiue name for the view.controls and the guid
			var id = 'myButton' + i;

			this.controls[ id ] = new MAF.control.TextButton( {
				guid: id,
				label: button.label,
				view: button.view || null,
				styles: {
					height: 80,
					width: 450,
					vOffset: 150 + ( i * 100 ),
					hOffset: ( this.width - 450 ) / 2,
					borderRadius: 10
				},
				textStyles: {
					fontSize: 35,
					anchorStyle: 'center'
				},
				events: {
					onSelect: function() {
						if ( this.config.view ) return MAF.application.loadView( this.config.view );
					}
				}
			} ).appendTo( this );
		}, this );
	}
} );
