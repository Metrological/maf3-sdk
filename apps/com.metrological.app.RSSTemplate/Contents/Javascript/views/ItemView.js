// Create a new View class and extended it from the MAF.system.SidebarView
var ItemView = new MAF.Class( {
	Extends: MAF.system.SidebarView,

	ClassName: 'ItemView',

	// Add back params when going to the previous view
	viewBackParams: { reset: false },

	// Create your view template
	createView: function() {
		var backButton = new MAF.control.BackButton( {
			label: $_( 'BACK' ),
			backParams: this.viewBackParams // Add backParms on select of BackButton
		} ).appendTo( this );

		this.elements.myTextGrid = new MAF.element.TextGrid( {
			styles: {
				width: this.width,
				height: ( this.height - backButton.height - 20 ),
				vOffset: backButton.outerHeight,
				fontSize: 24,
				wrap: true
			}
		} ).appendTo( this );
	},

	// When view is created or returning to view the view is updated
	updateView: function() {
		var item = this.persist.item;

		if ( item.title && item.pubDate && item.description )
			this.elements.myTextGrid.setText(
				item.title + '<br />' +
				moment( item.pubDate).format( 'DD MMM YYYY HH:MM' ) +
				'<br /><br />' +
				item.description
			);
	}
} );
