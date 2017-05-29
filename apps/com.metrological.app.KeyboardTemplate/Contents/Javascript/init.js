// Include your views and theme
include( 'Javascript/Theme.js' );
include( 'Javascript/Views/MainView.js' );
include( 'Javascript/Views/StandardKeyboard.js' );
include( 'Javascript/Views/SecureKeyboard.js' );
include( 'Javascript/Views/CustomKeyboard.js' );
include( 'Javascript/Views/CustomKeyboardStyling.js' );
include( 'Javascript/Views/TextEntryBtn.js' );
include( 'Javascript/Views/SecureTextEntryBtn.js' );

// Init application with view config
MAF.application.init( {
	views: [
		{ id: 'Main', viewClass: MainView },
		{ id: 'StandardKeyboard', viewClass: StandardKeyboard },
		{ id: 'SecureKeyboard', viewClass: SecureKeyboard },
		{ id: 'CustomKeyboard', viewClass: CustomKeyboard },
		{ id: 'CustomKeyboardStyling', viewClass: CustomKeyboardStyling },
		{ id: 'TextEntryBtn', viewClass: TextEntryBtn },
		{ id: 'SecureTextEntryBtn', viewClass: SecureTextEntryBtn },
		{ id: 'About', viewClass: MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'Main',
	settingsViewId: 'About'
} );
