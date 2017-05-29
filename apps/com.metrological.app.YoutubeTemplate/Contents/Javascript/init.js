// Include your views and theme
include( 'Javascript/Theme.js' );
include( 'Javascript/core/API.js' );
include( 'Javascript/views/Main.js' );
include( 'Javascript/views/Video.js' );

// Init application with view config
MAF.application.init( {
	views: [
		{ id: 'Main', viewClass: MainView },
		{ id: 'Video', viewClass: VideoView },
		{ id: 'About', viewClass:  MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'Main',
	settingsViewId: 'About'
} );

