// Include your views, styles and other things you need
// The Contents folder is used as root here
include( 'Javascript/Theme.js' );
include( 'Javascript/Views/ExampleView1.js' );
include( 'Javascript/Views/ExampleView2.js' );

// Init application with view config
MAF.application.init( {
	views: [
		{ id: 'Example1', viewClass: ExampleView1 },
		{ id: 'Example2', viewClass: ExampleView2 },
		{ id: 'About', viewClass: MAF.views.AboutBox } // Use the default About view
	],
	defaultViewId: 'Example1', // Declare what view to be loaded when opening the app
	settingsViewId: 'About' // Declare what view is opened when a used loads the settings
} );
