// Include your views and theme and other things
include( 'Javascript/Theme.js' );
include( 'Javascript/core/API.js' );
include( 'Javascript/views/ListView.js' );
include( 'Javascript/views/ItemView.js' );

// Init Application with view config
MAF.application.init( {
	views: [
		{ id: 'List', viewClass: ListView },
		{ id: 'Item', viewClass: ItemView },
		{ id: 'About', viewClass: MAF.views.AboutBox }
	],
	defaultViewId: 'List',
	settingsViewId: 'About'
} );
