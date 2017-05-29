// Create a new View class and extend it from the MAF.system.SidebarView
var ItemView = new MAF.Class( {
	ClassName: 'ItemView',

	Extends: MAF.system.SidebarView,

	// Add back params when going to the previous view
	viewBackParams: { reset: false },

	// Create your view template
	createView: function() {
		new MAF.control.BackButton( {
			label: $_( 'BACK' ),
			backParams: this.viewBackParams // Add backParms on select of BackButton
		} ).appendTo( this );

		var myDescription = new MAF.element.Text( {
			label: $_( 'This is the data that we received from the previous view (this.persist.view).' ),
			styles: {
				height: 200,
				width: this.width - 50,
				hOffset: 25,
				vOffset: 100,
				fontSize: 35,
				wrap: true,
				anchorStyle: 'center'
			}
		} ).appendTo( this );

		var myData = new MAF.element.Text( {
			label: $_( 'ExampleObject' ),
			styles: {
				height: 300,
				width: this.width - 50,
				hOffset: 25,
				vOffset: myDescription.outerHeight + 50,
				fontSize: 35,
				wrap: true
			}
		} ).appendTo( this );

		new MAF.element.Text( {
			label: $_( 'DeveloperTool' ),
			styles: {
				height: 100,
				width: this.width - 50,
				hOffset: 25,
				vOffset: myData.outerHeight,
				fontSize: 35,
				wrap: true,
				anchorStyle: 'center'
			}
		} ).appendTo( this );
	},

	// When the view is created or returning to the view
	updateView: function() {
		log( 'this is the persist.data :', this.persist.data );
	}
} );
