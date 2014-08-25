// Include your views
include("Javascript/views/mainView.js");
include("Javascript/views/transportOverlay.js");

// Set base glow and focus theme
Theme.set({
	BaseGlow: {
		styles: {
			color: 'white',
			backgroundColor: 'transparent'
		}
	},
	BaseFocus: {
		styles: {
			backgroundColor: '#5f429c'
		}
	},
	ControlMediaTransportOverlayButton: {
		styles: {
			fontSize: 30,
			height: 100,
			width: 100,
			borderRadius: 2
		},
		normal: {
			styles: {
				color: 'white',
				backgroundColor: ''
			}
		},
		focused: {
			styles: {
				color: 'white',
				backgroundColor: '#5f429c'
			}
		}
	}
});

// Init application with view config
MAF.application.init({
	views: [
		{ id: 'view-mainView', viewClass: mainView },
		{ id: 'view-transportOverlay', viewClass: transportOverlay },
		{ id: 'view-About', viewClass: MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'view-mainView',
	settingsViewId: 'view-About'
});
