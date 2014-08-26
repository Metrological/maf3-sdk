// Include your views
include('Javascript/Views/MyView.js');

// Init application with view config
MAF.application.init({
	views: [
		{ id: 'view-MyView', viewClass: MyView },
		{ id: 'view-About', viewClass: MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'view-MyView', // Declare what view to be loaded when opening the app
	settingsViewId: 'view-About' // Declare what view is opened when a used loads the settings
});
