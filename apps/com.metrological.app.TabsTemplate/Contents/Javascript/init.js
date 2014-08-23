// Include the view
include('Javascript/Views/MainView.js');

// Set the theme
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
	ControlTabPipeButton: {
		focused: {
			styles: {
				backgroundColor: '#5f429c'
			}
		},
		selected: {
			styles: {
				backgroundColor: 'rgba(129, 1, 177, 0.4)'
			}
		}
	},
	ControlTabStripButton: {
		focused: {
			styles: {
				backgroundColor: '#5f429c'
			}
		},
		selected: {
			styles: {
				backgroundColor: 'rgba(129, 1, 177, 0.4)'
			}
		}
	},
	'CustomTab .ControlTabPipeButton': {
		normal: {
			styles: {
				width: 200,
				height: 70,
				border: 0,
				borderRadius: 0,
				backgroundColor: 'transparent',
				fontSize: 35
			}
		},
		focused: {
			styles: {
				borderBottom: '5px solid #5f429c'
			}
		},
		selected: {
			styles: {
				borderBottom: '5px solid orange'
			}
		}
	}
});

// Init application with view config
MAF.application.init({
	views: [
		{ id: 'view-MainView', viewClass: MainView },
		{ id: 'view-About', viewClass: MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'view-MainView',
	settingsViewId: 'view-About'
});
