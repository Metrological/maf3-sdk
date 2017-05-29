// Create a class and extended it from the BaseView
var MainView = new MAF.Class( {
	ClassName: 'MainView',

	Extends: BaseView,

	// Create the view template
	createView: function() {
		this.parent();

		// Create an instance of our interesting button
		this.elements.myInterestingButton = new InterestingButton( {
			label: 'This is an interesting button',
			styles:{
				width: this.width - 100,
				hOffset: 50,
				vOffset: ( this.height - 100 ) / 2
			},
			events:{
				onSelect: function() {
					// On select it will display a default Alert
					new MAF.dialogs.Alert( {
						title: 'Alert',
						message: 'Hello World',
						buttons: [ {
							label: $_( 'Close message' ),
							callback: function() { log( 'Closing Dialog' ); }
						} ]
					} ).show();
				}
			}
		} ).appendTo( this );
	}
} );
