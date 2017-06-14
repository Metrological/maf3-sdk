// Include your Views and Theme
include( 'Javascript/Theme.js' );
include( 'Javascript/Views/Room.js' );

// Init application with view config
MAF.application.init( {
	views: [ { id: 'Room', viewClass: Room } ],
	defaultViewId: 'Room'
} );
