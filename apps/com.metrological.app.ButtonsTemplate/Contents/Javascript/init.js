// Include you're views
include('Javascript/Views/ExampleView1.js');
include('Javascript/Views/ExampleView2.js');

// Set base glow and focus theme
Theme.set({
	BaseGlow: {
		styles: {
			color: 'white',
			backgroundColor: 'grey'
		}
	},
	BaseFocus: {
		styles: {
			backgroundColor: '#5f429c'
		}
	}
});

// Init application with view config
MAF.application.init({
	views: [
		{ id: 'view-ExampleView1', viewClass: ExampleView1 },
		{ id: 'view-ExampleView2', viewClass: ExampleView2 },
		{ id: 'view-About', viewClass: MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'view-ExampleView1', // Declare what view to be loaded when opening the app
	settingsViewId: 'view-About' // Declare what view is opened when a used loads the settings
});
