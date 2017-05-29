// Include your views and theme and other items
include('Javascript/Core/API.js');
include('Javascript/Core/InterestingButton.js');
include('Javascript/Core/Article.js');
include('Javascript/Core/ValueSlider.js');
include('Javascript/Core/PercentageBar.js');

include('Javascript/Theme.js');
include('Javascript/Core/BaseView.js');

include('Javascript/Views/MainView.js');
include('Javascript/Views/ArticleView.js');
include('Javascript/Views/MovieView.js');

// Init application with view config
MAF.application.init( {
	views: [
		{ id: 'Main', viewClass: MainView },
		{ id: 'Article', viewClass: ArticleView },
		{ id: 'Movie', viewClass: MovieView },
		{ id: 'About', viewClass: MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'Main',
	settingsViewId: 'About'
} );
