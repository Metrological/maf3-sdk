// Create a new View class and extend it from the MAF.system.SidebarView
var MainView = new MAF.Class( {
	ClassName: 'MainView',

	Extends: MAF.system.SidebarView,

	// Create your view template
	createView: function() {

		// An example object with data
		var data = {
			title: 'My Title',
			src: 'Images/tv.png',
			description: 'My Description'
		};

		var description = new MAF.element.Text( {
			label: $_( 'Description' ),
			styles: {
				height: 100,
				width: this.width - 50,
				hOffset: 25,
				vOffset: 100,
				fontSize: 35,
				wrap: true,
				anchorStyle: 'center'
			}
		} ).appendTo( this );

		var dataExample = new MAF.element.Text( {
			label: $_( 'ExampleObject' ),
			styles: {
				height: 300,
				width: this.width - 50,
				hOffset: 25,
				vOffset: description.outerHeight + 100,
				fontSize: 35,
				wrap: true
			}
		} ).appendTo( this );

		new MAF.control.TextButton( {
			label: $_( 'Send Data' ),
			guid: 'myControlTextButton',
			styles: {
				height: 80,
				width: 400,
				vOffset: dataExample.outerHeight + 20,
				hOffset: ( this.width - 400 ) / 2,
				borderRadius: 10
			},
			textStyles: {
				fontSize: 35,
				anchorStyle: 'center'
			},
			events: {
				onSelect: function() {
					log( 'Send the data to the next view' );
					MAF.application.loadView('Item', { data: data } );
				}
			}
		} ).appendTo( this );
	},

	// When view is created or returning to view the view is updated
	updateView: function() {
		if ( this.backParams.reset === false )
			log( 'view.backParams :', this.backParams.reset );
	}
} );
