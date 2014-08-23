// Include you're views
include('Javascript/Views/MainView.js');
include('Javascript/Views/ControlGridView.js');
include('Javascript/Views/ElementGridView.js');
include('Javascript/Views/HorizontalGridView.js');
include('Javascript/Views/VerticalGridView.js');
include('Javascript/Views/SlideCarouselView.js');

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

// Init application with view config
MAF.application.init({
	views: [
		{ id: 'view-MainView', viewClass: MainView },
		{ id: 'view-ControlGridView', viewClass: ControlGridView },
		{ id: 'view-ElementGridView', viewClass: ElementGridView },
		{ id: 'view-HorizontalGridView', viewClass: HorizontalGridView },
		{ id: 'view-VerticalGridView', viewClass: VerticalGridView },
		{ id: 'view-SlideCarouselView', viewClass: SlideCarouselView },
		{ id: 'view-About', viewClass: MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'view-MainView',
	settingsViewId: 'view-About'
});
