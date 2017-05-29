// Create a new View class and extend it from the MAF.system.SidebarView
var MainView = new MAF.Class( {
	ClassName: 'MainView',

	Extends: MAF.system.SidebarView,

	// Create the view template
	createView: function() {
		var buttons = [
			{ label: $_( 'Standard Keyboard' ), view: 'StandardKeyboard' },
			{ label: $_( 'Secure Keyboard' ), view: 'SecureKeyboard' },
			{ label: $_( 'Custom Keyboard' ), view: 'CustomKeyboard' },
			{ label: $_( 'Custom Styling' ), view: 'CustomKeyboardStyling' },
			{ label: $_( 'Dialog TextEntry' ) },
			{ label: $_( 'TextEntry Button' ), view: 'TextEntryBtn' },
			{ label: $_( 'Secure TextEntry Button' ), view: 'SecureTextEntryBtn' }
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

						new MAF.dialogs.TextEntry( {
							title: 'MAF.dialogs.TextEntry',
							callback: function( callback ) {
								log( 'callback response:', callback.response );
							}
						} ).show();
					}
				}
			} ).appendTo( this );
		}, this );
	}
} );
