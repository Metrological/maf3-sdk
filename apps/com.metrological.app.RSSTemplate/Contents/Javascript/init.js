// Include you're views
include("Javascript/core/API.js");
include("Javascript/views/ListView.js");
include("Javascript/views/ItemView.js");

// Data URL to be used to fetch the news
var APIUrl = 'http://www.apple.com/main/rss/hotnews/hotnews.rss';

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
	}
});

// Init Application with view config
MAF.application.init({
	views: [
		{ id: 'view-ListView', viewClass: ListView },
		{ id: 'view-ItemView', viewClass: ItemView }, 
		{ id: 'view-AboutView', viewClass: MAF.views.AboutBox }
	],
	defaultViewId: 'view-ListView',
	settingsViewId: 'view-AboutView'
});
