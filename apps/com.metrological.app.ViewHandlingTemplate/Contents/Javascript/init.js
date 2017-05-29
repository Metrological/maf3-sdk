// Include your views and theme
include( 'Javascript/Theme.js' );
include( 'Javascript/Views/MainView.js' );
include( 'Javascript/Views/ItemView.js' );

// Init Application with view config
MAF.application.init( {
	views: [
		{ id: 'Main', viewClass: MainView },
		{ id: 'Item', viewClass: ItemView },
		{ id: 'About', viewClass: MAF.views.AboutBox }  // Use standard About view
	],
	defaultViewId: 'Main',
	settingsViewId: 'About'
} );
