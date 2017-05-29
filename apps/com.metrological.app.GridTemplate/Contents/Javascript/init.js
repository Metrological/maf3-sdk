// Include your views, styles and other things you need
// The Contents folder is used as root here
include( 'Javascript/Theme.js' );
include( 'Javascript/Views/MainView.js' );
include( 'Javascript/Views/ControlGridView.js' );
include( 'Javascript/Views/ElementGridView.js' );
include( 'Javascript/Views/HorizontalGridView.js' );
include( 'Javascript/Views/VerticalGridView.js' );
include( 'Javascript/Views/SlideCarouselView.js' );
include( 'Javascript/Views/TwoDimensionalSlideCarouselView.js' );


// Init application with view config
MAF.application.init( {
	views: [
		{ id: 'Main', viewClass: MainView },
		{ id: 'ControlGrid', viewClass: ControlGridView },
		{ id: 'ElementGrid', viewClass: ElementGridView },
		{ id: 'HorizontalGrid', viewClass: HorizontalGridView },
		{ id: 'VerticalGrid', viewClass: VerticalGridView },
		{ id: 'SlideCarousel', viewClass: SlideCarouselView },
		{ id: 'TwoDimensionalSlideCarousel', viewClass: TwoDimensionalSlideCarouselView },
		{ id: 'About', viewClass: MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'Main',
	settingsViewId: 'About'
} );
