// Include your views and theme
include( 'Javascript/Theme.js' );
include( 'Javascript/views/mainView.js' );
include( 'Javascript/views/transportOverlay.js' );

// Init application with view config
MAF.application.init( {
	views: [
		{ id: 'Main', viewClass: MainView },
		{ id: 'TransportOverlay', viewClass: TransportOverlayView },
		{ id: 'About', viewClass: MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'Main',
	settingsViewId: 'About'
} );
