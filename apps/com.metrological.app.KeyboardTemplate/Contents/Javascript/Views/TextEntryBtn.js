// Create a new View class and extend it from the MAF.system.FullscreenView
var TextEntryBtn = new MAF.Class( {
	ClassName: 'TextEntryBtn',

	Extends: MAF.system.SidebarView,

	// Create the view template
	createView: function() {
		var backButton = new MAF.control.BackButton( {
			label: $_( 'BACK' )
		} ).appendTo( this );

		new MAF.control.TextEntryButton( {
			label: $_( 'General_searchBar' ).toUpperCase(),
			styles: {
				width: this.width,
				opacity: 0.6,
				vOffset: backButton.outerHeight + 40
			},
			events: {
				onFocus: function() {
					this.setStyle( 'opacity', 1 );
				},
				onBlur: function() {
					this.setStyle( 'opacity', 0.6 );
				},
				onCancel: function() {
					this.valueDisplay.setText( '' );
				}
			}
		} ).appendTo( this );
	}
} );
