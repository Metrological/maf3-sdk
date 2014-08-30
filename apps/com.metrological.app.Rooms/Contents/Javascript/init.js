// Include your views
include('Javascript/Views/Room.js');

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
		{ id: 'view-Room', viewClass: Room }
	],
	defaultViewId: 'view-Room'
});
