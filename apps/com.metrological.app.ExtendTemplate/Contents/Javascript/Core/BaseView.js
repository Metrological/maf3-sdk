// Create a class and extended it from the MAF.system.SidebarView
var BaseView = new MAF.Class( {

	Extends: MAF.system.SidebarView,

	// Create the view template
	createView: function() {

		this.elements.menubar = new MAF.control.TabPipe( {
			tabs: [
				{ label: 'Main' },
				{ label: 'Article' },
				{ label: 'Movie of the day' }
			],
			styles: { width: this.width },
			events: {
				onTabSelect: function( event ) {
					var view = this.owner;
					var label = event.payload.label;

					if ( label === 'Main' && view.ClassName !== 'MainView' )
						return MAF.application.loadDefaultView();

					else if ( label === 'Article' && view.ClassName !== 'ArticleView' )
						return MAF.application.loadView( 'Article' );

					else if ( label === 'Movie of the day' && view.ClassName !== 'MovieView' )
						return MAF.application.loadView( 'Movie' );
				}
			}
		} ).appendTo( this );
	},

	updateView: function() {
		if ( this.ClassName === 'MainView' )
			this.elements.menubar.selectTab( 0 );

		else if ( this.ClassName === 'ArticleView' )
			this.elements.menubar.selectTab( 1 );

		else if ( this.ClassName === 'MovieView' )
			this.elements.menubar.selectTab( 2 );
	}
} );
